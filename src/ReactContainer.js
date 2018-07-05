/**
 * @fileoverview React IoC container.
 * @author Pavel Mach��ek <pavex@ines.cz>
 */
import React from 'react';
import Container from './Container';


export default class ReactContainer extends Container {





/** @overrride */
	_reference(value) {
// check if value is a React component, no create instance
		if (!!value.prototype && !!value.prototype.isReactComponent) {
			return value;
		}
		return super._reference(value);
	};





/** @overrride */
	_createInstance(classname, params, setters) {
		if (React.Component.isPrototypeOf(classname)) {
			return React.createElement(classname, params, null);
		}
		return super._createInstance(...arguments);
	};


}