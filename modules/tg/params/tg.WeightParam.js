/**
 * TypeGen Weight Param.
 *
 * @class
 * @constructor
 * @param {number} [value=0]
 */
tg.WeightParam = function ( value ) {
	// Parent constructor
	tg.Param.call( this, value );
};

/* Inheritance */

tg.inheritClass( tg.WeightParam, tg.Param );

/* Static Properties */

tg.WeightParam.static.defaultValue = 1;

tg.WeightParam.static.minimumValue = 0;

tg.WeightParam.static.maximumValue = 2;

/* Methods */

/**
 * Transforms an offset.
 *
 * @param {number} offset
 * @returns {number}
 */
tg.WeightParam.prototype.transformOffset = function ( offset ) {
	return offset * this.value;
};
