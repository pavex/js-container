/**
 * @fileoverview React IoC container.
 * @author Pavel Mach·Ëek <pavex@ines.cz>
 */
import React from 'react';
import Container from './Container';


export default class ReactContainer extends Container {





/** @overrride */
	_reference(value) {
// check if value is a React component, no create instance
		if (value.prototype && value.prototype.isReactComponent) {
			return;
		}
		super._reference(value);
	};





/** @overrride */
	_createInstance(name, classname, params, setters) {
		if (React.Component.isPrototypeOf(classname)) {
			return React.createElement(classname, setters, null);
		}
		return super._createInstance(...arguments);
	};


}