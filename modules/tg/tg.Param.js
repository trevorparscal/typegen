/**
 * TypeGen Param.
 *
 * @class
 * @constructor
 * @param {Mixed} value
 */
tg.Param = function ( value ) {
	// Properties
	this.value = value || this.constructor.static.defaultValue;
};

/* Static Properties */

tg.Param.static = {};

tg.Param.static.defaultValue = 0;

tg.Param.static.minimumValue = 0;

tg.Param.static.maximumValue = 0;

/* Methods */

tg.Param.prototype.getValue = function () {
	return this.value;
};

tg.Param.prototype.setValue = function ( value ) {
	this.value = value;
};

tg.Param.prototype.resetValue = function () {
	this.setValue( this.constructor.static.defaultValue );
};

tg.Param.prototype.getMinimumValue = function () {
	return this.constructor.static.minimumValue;
};

tg.Param.prototype.getMaximumValue = function () {
	return this.constructor.static.maximumValue;
};
