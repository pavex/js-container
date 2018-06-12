/**
 * @fileoverview Basic IoC container with constructor injection.
 * @author Pavel Mach·Ëek <pavex@ines.cz>
 */


export default class Container {


/** @private @type {Map} */
	_classes = new Map();

/** @private @type {Map} */
	_instances = new Map();





/**
 * Create getter function name
 * @private
 * @param {string} method
 * @param {string} string
 * @return {string}
 */	
	_getMethodName(method, string) {
		return method + string.charAt(0).toUpperCase() + string.slice(1);
	}





/**
 * Get class name helper
 * @private
 * @return {string|Constructor} classname
 */
	_getClassName(classname) {
		return !!classname.name ? classname.name : classname;
	};





/**
 * Inject getter into container by name
 * @private
 * @param {string} name
 * @return {Object}
 */
	_inject(name) {
		let getter = this._getMethodName('get', name);
		this[getter] = () => this.get(name);
	};




/**
 * @param {string} name
 * @param {Class} classname
 * @param {Array=|Object=} opt_params
 * @param {Object=} opt_setters
 */	
	setName(name, classname, opt_params, opt_setters) {
		if (!classname.name) {
			throw Error('Invalid class.');
		}
		let is_object = !!opt_params && opt_params.constructor === Object;	
		let params = is_object ? [] : opt_params || [];
		let setters = is_object ? opt_params : opt_setters || {};
		this._classes.set(name, {classname, params, setters});
		this._inject(name);
	};





/**
 * @param {Class} classname
 * @param {Array=|Object=} opt_params
 * @param {Object=} opt_setters
 */	
	set(classname, opt_params, opt_setters) {
		let name = classname.name;
		this.setName(name, classname, opt_params, opt_setters);
	};





/**
 * @protected
 * @param {Object|Array}
 */
	_reference(value) {
		if (!!value && !!value.name && this._classes.has(value.name)) {
			return this.get(value.name);
		}
		return value;
	};





/**
 * @protected
 * @param {Object|Array}
 */
	_references(traversable) {
		let values = [];
		for (let key in traversable) {
			if (traversable.hasOwnProperty(key)) {
				values[key] = this._reference(traversable[key]);
			}
		}
		return values;
	};





/**
 * @private
 * @param {Object} instance
 * @param {Object} setters
 */	
	_setters(instance, setters) {
		for (let name in setters) {
			if (setters.hasOwnProperty(name)) {
				let setter = this._getMethodName('set', name);
				if (!!instance[setter]) {
					let value = setters[name];
					instance[setter](value);
				}
			}
		}
	};





/**
 * @protected
 * @param {string} name
 * @param {Constructor} classname
 * @param {Array} params
 * @param {Object} setters
 * @return {Object}
 */	
	_createInstance(name, classname, params, setters) {
		let instance = new classname(...params);
		this._setters(instance, setters);
		return instance;
	};





/**
 * @pivate
 * @param {string} name
 * @return {Object}
 */
	_create(name) {
		let {classname, params, setters} = this._classes.get(name);
		params = this._references(params);
		setters = this._references(setters);
		this._instances.set(name, this._createInstance(
			name, classname, params, setters
		));
	};





/**
 * @param {string} classname
 * @return {boolean}
 */
	has(classname) {
		let name = this._getClassName(classname);
		return this._classes.has(name);
	};





/**
 * @param {string} classname
 * @return {Object}
 */
	get(classname) {
		let name = this._getClassName(classname);
		if (!this._instances.has(name)) {
			if (!this.has(name)) {
				throw Error('Class `'+ name + '` not set.');
			}
			this._create(name);
		}
		return this._instances.get(name);
	};


}