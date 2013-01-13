/**
 * TypeGen Point.
 *
 * @class
 * @constructor
 * @param {number} x Horizontal position
 * @param {number} y Vertical position
 */
tg.Point = function ( x, y ) {
	// Properties
	this.x = x || 0;
	this.y = y || 0;
};

/* Methods */

/**
 * Get a copy of the point.
 *
 * @method
 * @returns {tg.Point}
 */
tg.Point.prototype.clone = function () {
	return new tg.Point( this.x, this.y );
};

/**
 * Get an SVG compatible string of the point.
 *
 * @method
 * @param {tg.Font} font
 * @returns {string}
 */
tg.Point.prototype.toSvgString = function ( font ) {
	var point = font.transformFinalPoint( this );
	return point.x.toFixed( tg.precision ) + ',' + point.y.toFixed( tg.precision );
};

/**
 * Get an array of the points dimensions.
 *
 * @method
 * @returns {Number[2]}
 */
tg.Point.prototype.toArray = function () {
	return [ this.x, this.y ];
};

/**
 * Checks if the point is at another point.
 *
 * @method
 * @param {tg.Point} point Other point
 * @param {number} [tolerance=0.00001] Proximity to consider close enough
 * @returns {number}
 */
tg.Point.prototype.isAt = function ( point, tolerance ) {
	var x = point.x - this.x,
		y = point.y - this.y;
	return Math.sqrt( x * x + y * y ) < ( tolerance || tg.tolerance );
};

/**
 * Get the distance from the point to another one.
 *
 * @method
 * @param {tg.Point} origin Origin point
 * @returns {number}
 */
tg.Point.prototype.getDistanceFrom = function ( origin ) {
	var x = origin.x - this.x,
		y = origin.y - this.y;
	return Math.sqrt( x * x + y * y );
};

/**
 * Get a translated point.
 *
 * @method
 * @param {number} x Horizontal distance
 * @param {number} y Vertical distance
 * @returns {tg.Point}
 */
tg.Point.prototype.translate = function ( x, y ) {
	return new tg.Point( this.x + x, this.y + y );
};

/**
 * Get a translated point.
 *
 * @method
 * @param {tg.Angle} angle Origin angle
 * @param {number} distance Translation distance
 * @returns {tg.Point}
 */
tg.Point.prototype.project = function ( angle, distance ) {
	angle = angle.toNumber();
	return new tg.Point(
		distance * Math.cos( angle ) + this.x,
		distance * Math.sin( angle ) + this.y
	);
};

/**
 * Get a scaled point.
 *
 * @method
 * @param {number} x Horizontal scale factor
 * @param {number} [y=x] Vertical scale factor
 * @returns {tg.Point}
 */
tg.Point.prototype.scale = function ( x, y ) {
	return new tg.Point( this.x * x, this.y * ( y || x ) );
};

/**
 * Get a rotated point.
 *
 * @method
 * @param {tg.Point} origin Origin point
 * @param {tg.Angle} amount Rotation angle
 * @returns {tg.Point}
 */
tg.Point.prototype.rotateAround = function ( origin, amount ) {
	var x = this.x - origin.x,
		y = this.y - origin.y,
		radius = Math.sqrt( x * x + y * y ),
		angle = Math.atan2( y, x ) + amount.toNumber();
	return new tg.Point(
		radius * Math.cos( angle ) + origin.x,
		radius * Math.sin( angle ) + origin.y
	);
};
