/**
 * TypeGen Path.
 *
 * @class
 * @constructor
 * @param {Array} segments List of tg.Line and tg.Curve objects
 */
tg.Path = function ( segments ) {
	this.segments = segments || [];
};

/* Methods */

/**
 * Append a segment to the end of the path.
 *
 * @method
 * @param {tg.Line|tg.Curve} [args]
 * @returns {string}
 */
tg.Path.prototype.push = function () {
	this.segments.push.apply( this.segments, arguments );
};

/**
 * Get a copy of the path.
 *
 * @method
 * @returns {tg.Path}
 */
tg.Path.prototype.clone = function () {
	return new tg.Path( this.segments.slice( 0 ) );
};

/**
 * Get an SVG compatible string of the path.
 *
 * @method
 * @param {tg.Font} font
 * @returns {string}
 */
tg.Path.prototype.toSvgString = function ( font ) {
	var i, len, curr, prev, end, start,
		str = '';
	for ( i = 0, len = this.segments.length; i < len; i++ ) {
		prev = curr;
		curr = this.segments[i];
		if ( prev ) {
			end = prev.getPointAtFactor( 1 );
			start = curr.getPointAtFactor( 0 );
			if ( !end.isAt( start ) ) {
				// Bridge gap
				str += 'L' + start.toSvgString( font );
			}
		}
		str += curr.toSvgString( font, i !== 0 );
	}
	return str + 'Z';
};

/**
 * Get an array of the path segments.
 *
 * @method
 * @returns {tg.Point[3]}
 */
tg.Path.prototype.toArray = function () {
	return this.segments.slice( 0 );
};

/**
 * Get a point on the path.
 *
 * @method
 * @param {number} t Interpolation factor
 * @returns {tg.Point}
 */
tg.Path.prototype.getPointAtFactor = function ( t ) {
	var max = this.segments.length,
		factor = Math.max( Math.min( t, max ), 0 ),
		floor = Math.floor( factor ),
		end = floor === max;

	return this.segments[end ? floor - 1 : floor].getPointAtFactor( end ? 1 : factor - floor );
};
