/**
 * TypeGen Obliqueness Param.
 *
 * @class
 * @constructor
 * @param {number} [value=0]
 */
tg.ObliquenessParam = function ( value ) {
	// Parent constructor
	tg.Param.call( this, value );
};

/* Inheritance */

tg.inheritClass( tg.ObliquenessParam, tg.Param );

/* Static Properties */

tg.ObliquenessParam.static.defaultValue = 0;

tg.ObliquenessParam.static.minimumValue = -2;

tg.ObliquenessParam.static.maximumValue = 2;

/* Methods */

/**
 * Transforms a point.
 *
 * @param {tg.Point} point
 * @returns {tg.Point}
 */
tg.ObliquenessParam.prototype.transformFinalPoint = function ( point ) {
	return new tg.Point( point.x + this.value * ( 1 - point.y ), point.y );
};
