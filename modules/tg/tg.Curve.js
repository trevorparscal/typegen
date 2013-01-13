/**
 * TypeGen Curve.
 *
 * @class
 * @constructor
 * @param {tg.Point} a Starting point
 * @param {tg.Point} b Control point
 * @param {tg.Point} c Ending point
 */
tg.Curve = function ( a, b, c ) {
	this.a = a || new tg.Point();
	this.b = b || new tg.Point();
	this.c = c || new tg.Point();
};

/* Methods */

/**
 * Get a copy of the curve.
 *
 * @method
 * @returns {tg.Curve}
 */
tg.Curve.prototype.clone = function () {
	return new tg.Curve( this.a, this.b, this.c );
};

/**
 * Get an SVG compatible string of the curve.
 *
 * @method
 * @param {tg.Font} font
 * @param {tg.Point|boolean} [from] Current pen position, or whether the pen is already at the start
 * @returns {string}
 */
tg.Curve.prototype.toSvgString = function ( font, from ) {
	var str = '';
	if ( !from || ( from instanceof tg.Point && !from.isAt( this.a ) ) ) {
		str += 'M' + this.a.toSvgString( font );
	}
	return str + 'Q' + this.b.toSvgString( font ) + ' ' + this.c.toSvgString( font );
};

/**
 * Get an array of the curve points.
 *
 * @method
 * @returns {tg.Point[3]}
 */
tg.Curve.prototype.toArray = function () {
	return [ this.a, this.b, this.c ];
};

/**
 * Get the angle at a point on the curve.
 *
 * @method
 * @param {number} t Interpolation factor
 * @returns {tg.Angle}
 */
tg.Curve.prototype.getAngleAtFactor = function ( t ) {
	return new tg.Angle(
		Math.atan2(
			( ( this.c.y - this.b.y ) * t + this.b.y ) - ( ( this.b.y - this.a.y ) * t + this.a.y ),
			( ( this.c.x - this.b.x ) * t + this.b.x ) - ( ( this.b.x - this.a.x ) * t + this.a.x )
		)
	);
};

/**
 * Get the length of the curve.
 *
 * @method
 * @returns {number}
 */
tg.Curve.prototype.getLength = function () {
	var a = new tg.Point( this.a.x - 2 * this.b.x + this.c.x, this.a.y - 2 * this.b.y + this.c.y ),
		b = new tg.Point( 2 * this.b.x - 2 * this.a.x, 2 * this.b.y - 2 * this.a.y ),
		c = 4 * ( a.x * a.x + a.y * a.y ),
		d = 4 * ( a.x * b.x + a.y * b.y ),
		e = b.x * b.x + b.y * b.y,
		sq2cde = 2 * Math.sqrt( c + d + e ),
		c2 = Math.sqrt( c ),
		c32 = 2 * c * c2,
		e2 = 2 * Math.sqrt( e ),
		dc = d / c2;

	return (
		c32 * sq2cde + c2 * d * ( sq2cde - e2 ) +
		( 4 * e * c - d * d ) * Math.log( ( 2 * c2 + dc + sq2cde ) / ( dc + e2 ) )
	) / ( 4 * c32 );
};

/**
 * Get a point on the curve.
 *
 * Formula:
 *     x = ( 1 - t ) ^ 2 * a.x + 2 * ( 1 - t ) * t * b.x + t ^ 2 * c.x;
 *     y = ( 1 - t ) ^ 2 * a.y + 2 * ( 1 - t ) * t * b.y + t ^ 2 * c.y;
 *
 * @method
 * @param {number} t Interpolation factor
 * @returns {tg.Point}
 */
tg.Curve.prototype.getPointAtFactor = function ( t ) {
	if ( t < tg.tolerance ) {
		return this.a;
	}
	if ( t > 1 - tg.tolerance ) {
		return this.c;
	}
	var t1 = ( 1 - t ) * ( 1 - t ),
		t2 = 2 * ( 1 - t ) * t,
		t3 = t * t;
	return new tg.Point(
		t1 * this.a.x + t2 * this.b.x + t3 * this.c.x, t1 * this.a.y + t2 * this.b.y + t3 * this.c.y
	);
};

/**
 * Get an offset version of the line.
 *
 * @method
 * @param {number} start Starting offset distance
 * @param {number} [end=start] Ending offset distance
 * @returns {tg.Curve}
 */
tg.Curve.prototype.offsetBy = function ( start, end ) {
	end = end !== undefined ? end : start;
	var dir = Math.PI / 2,
		// Angles
		aa = dir + Math.atan2( this.b.y - this.a.y, this.b.x - this.a.x ),
		ca = dir + Math.atan2( this.c.y - this.b.y, this.c.x - this.b.x ),
		// Points
		ap = new tg.Point( this.a.x + start * Math.cos( aa ), this.a.y + start * Math.sin( aa ) ),
		cp = new tg.Point( this.c.x + end * Math.cos( ca ), this.c.y + end * Math.sin( ca ) ),
		// Control point
		line1 = new tg.Line(
			new tg.Point( ap.x, ap.y ),
			new tg.Point( ap.x + ( this.b.x - this.a.x ), ap.y + ( this.b.y - this.a.y ) )
		),
		line2 = new tg.Line(
			new tg.Point( cp.x, cp.y ),
			new tg.Point( cp.x + ( this.c.x - this.b.x ), cp.y + ( this.c.y - this.b.y ) )
		),
		intersection = line2.getPointAtIntersection( line1 );
	if ( !intersection ) {
		throw new Error( 'Lines do not intersect.' );
	}

	return new tg.Curve( ap, intersection, cp );
};

/**
 * Get lines that approximate the curve.
 *
 * @method
 * @param {number} [segments] Number of lines
 * @returns {tg.Line[]}
 */
tg.Curve.prototype.getLines = function ( segments ) {
	segments = segments || Math.ceil( this.getLength() * 10 );
	var i, t,
		inc = 1 / segments,
		lines = [];

	for ( i = 0, t = 0; i < segments; i++, t += inc ) {
		lines.push( new tg.Line( this.getPointAtFactor( t ), this.getPointAtFactor( t + inc ) ) );
	}
	return lines;
};

/**
 * Get points that approximate the curve.
 *
 * @method
 * @param {number} [segments] Number of points
 * @returns {tg.Point[]}
 */
tg.Curve.prototype.getPoints = function ( segments ) {
	segments = segments || Math.ceil( this.getLength() * 10 );
	var i, t,
		inc = 1 / segments,
		points = [];

	for ( i = 0, t = 0; i <= segments; i++, t += inc ) {
		points.push( new tg.Point( this.getPointAtFactor( t ) ) );
	}
	return points;
};
