/**
 * TypeGen Line.
 *
 * @class
 * @constructor
 * @param {tg.Point} a Starting point
 * @param {tg.Point} b Ending point
 */
tg.Line = function ( a, b ) {
	this.a = a || new tg.Point();
	this.b = b || new tg.Point();
};

/* Methods */

/**
 * Get a copy of the line.
 *
 * @method
 * @returns {tg.Line}
 */
tg.Line.prototype.clone = function () {
	return new tg.Line( this.a, this.b );
};

/**
 * Get an SVG compatible string of the line.
 *
 * @method
 * @param {tg.Font} font
 * @param {tg.Point} [from] Current pen position
 * @returns {string}
 */
tg.Line.prototype.toSvgString = function ( font, from ) {
	var str = '';
	if ( !from || ( from instanceof tg.Point && !from.isAt( this.a ) ) ) {
		str += 'M' + this.a.toSvgString( font );
	}
	return str + 'L' + this.b.toSvgString( font );
};

/**
 * Get an array of the line points.
 *
 * @method
 * @returns {tg.Point[2]}
 */
tg.Line.prototype.toArray = function () {
	return [ this.a, this.b ];
};

/**
 * Get the angle of the line.
 *
 * @method
 * @returns {tg.Angle}
 */
tg.Line.prototype.getAngle = function () {
	return new tg.Angle( Math.atan2( this.b.y - this.a.y, this.b.x - this.a.x ) );
};

/**
 * Get the length of the line.
 *
 * @method
 * @returns {number}
 */
tg.Line.prototype.getLength = function () {
	var x = this.b.x - this.a.x,
		y = this.b.y - this.a.y;
	return Math.sqrt( x * x + y * y );
};

/**
 * Get a point on the line.
 *
 * Formula:
 *     x = ( b.x - a.x ) * t + a.x
 *     y = ( b.y - a.y ) * t + a.y
 *
 * @method
 * @param {number} t Interpolation factor
 * @returns {tg.Point}
 */
tg.Line.prototype.getPointAtFactor = function ( t ) {
	if ( t < tg.tolerance ) {
		return this.a;
	}
	if ( t > 1 - tg.tolerance ) {
		return this.b;
	}
	return new tg.Point(
		( this.b.x - this.a.x ) * t + this.a.x, ( this.b.y - this.a.y ) * t + this.a.y
	);
};

/**
 * Get a point at the intersection of a line and this one.
 *
 * @method
 * @param {tg.Line}
 * @returns {tg.Point}
 */
tg.Line.prototype.getPointAtIntersection = function ( line ) {
	var x1 = this.a.x,
		y1 = this.a.y,
		x2 = this.b.x,
		y2 = this.b.y,
		x3 = line.a.x,
		y3 = line.a.y,
		x4 = line.b.x,
		y4 = line.b.y,
		nx = ( x1 * y2 - y1 * x2 ) * ( x3 - x4 ) - ( x1 - x2 ) * ( x3 * y4 - y3 * x4 ),
		ny = ( x1 * y2 - y1 * x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 * y4 - y3 * x4 ),
		denominator = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );

	// Paralell lines never intersect
	if ( denominator === 0 ) {
		return null;
	}

	return new tg.Point( nx / denominator, ny / denominator );
};

/**
 * Get a horizontal mirror of the line.
 *
 * @method
 * @param {number} axis Angle to mirror on
 * @returns {tg.Point}
 */
tg.Line.prototype.reflectOn = function ( axis ) {
	var m = new tg.Point( ( this.a.x + this.b.x ) / 2, ( this.a.y + this.b.y ) / 2 ),
		a = this.a.rotateAround( m, axis.invert() ),
		b = this.b.rotateAround( m, axis.invert() );

	return new tg.Line(
		new tg.Point( m.x - ( a.x - m.x ), a.y ).rotateAround( m, axis ),
		new tg.Point( m.x - ( b.x - m.x ), b.y ).rotateAround( m, axis )
	);
};

/**
 * Get an offset version of the line.
 *
 * @method
 * @param {number} start Starting offset distance
 * @param {number} [end=start] Ending offset distance
 * @returns {tg.Line}
 */
tg.Line.prototype.offsetBy = function ( start, end ) {
	end = end !== undefined ? end : start;
	var dir = Math.PI / 2,
		angle = dir + Math.atan2( this.b.y - this.a.y, this.b.x - this.a.x ),
		cos = Math.cos( angle ),
		sin = Math.sin( angle );

	return new tg.Line(
		new tg.Point( this.a.x + start * cos, this.a.y + start * sin ),
		new tg.Point( this.b.x + end * cos, this.b.y + end * sin )
	);
};

/**
 * Get a curve equivilant to the line.
 *
 * @method
 * @returns {tg.Curve}
 */
tg.Line.prototype.getCurve = function () {
	return new tg.Curve(
		this.a,
		new tg.Point(
			( this.b.x - this.a.x ) / 2 + this.a.x,
			( this.b.y - this.a.y ) / 2 + this.a.y
		),
		this.b
	);
};
