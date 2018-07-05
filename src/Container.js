/**
 * @fileoverview Basic IoC container with constructor injection.
 * @author Pavel Mach·Ëek <pavex@ines.cz>
 */


export default class Container {


/** @private @type {Map} */
	_classes = new Map();

/** @private @type {Map} */
	_instances = new Map();

/** @private @type {Number} */
	static _injectedIndex = 1;





/**
 * @param {Class} classname
 * @param {Array=|Object=} opt_params
 * @param {Object=} opt_setters
 */	
	set(classname, opt_params, opt_setters) {
		let index = Container._injectedIndex++;
		classname._injectedIndex = index;
		let params = opt_params || [];
		let setters = opt_setters || {};
		this._classes.set(index, {classname, params, setters});
	};





/**
 * @protected
 * @param {Object|Array}
 */
	_reference(value) {
		return this.get(value);
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
				if (!!instance[name]) {
					instance[name](setters[name]);
				}
			}
		}
	};





/**
 * @protected
 * @param {Constructor} classname
 * @param {Array} params
 * @param {Object} setters
 * @return {Object}
 */	
	_createInstance(classname, params, setters) {
		let instance = new classname(...params);
		this._setters(instance, setters);
		return instance;
	};





/**
 * @pivate
 * @param {string} index
 * @return {Object}
 */
	_create(index) {
		let {classname, params, setters} = this._classes.get(index);
		params = this._references(params);
		setters = this._references(setters);
		this._instances.set(index, this._createInstance(
			classname, params, setters
		));
	};





/**
 * @param {string} value
 * @return {boolean}
 */
	has(value) {
		return value._injectedIndex > 0;
	};





/**
 * @param {string} classname
 * @return {Object}
 */
//	get(classname) {
	get(value) {
		if (value._injectedIndex) {
			let index = value._injectedIndex;
			if (!this._instances.has(index)) {
				if (!this._classes.has(index)) {
					throw Error('Class `'+ index + '` not set.');
				}
				this._create(index);
			}
			return this._instances.get(index);
		}
		return value;
	};


}