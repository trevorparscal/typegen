/**
 * TypeGen Width Param.
 *
 * @class
 * @constructor
 * @param {number} [value=1]
 */
tg.WidthParam = function ( value ) {
	// Parent constructor
	tg.Param.call( this, value );
};

/* Inheritance */

tg.inheritClass( tg.WidthParam, tg.Param );

/* Static Properties */

tg.WidthParam.static.defaultValue = 1;

tg.WidthParam.static.minimumValue = 0;

tg.WidthParam.static.maximumValue = 2;

/* Methods */

/**
 * Transforms a point.
 *
 * @param {tg.Point} point
 * @returns {tg.Point}
 */
tg.WidthParam.prototype.transformGuidePoint = function ( point ) {
	return new tg.Point( point.x * this.value, point.y );
};
