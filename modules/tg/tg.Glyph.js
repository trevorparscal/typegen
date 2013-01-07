/**
 * TypeGen Glyph.
 *
 */
tg.Glyph = function ( character, font ) {
	this.character = character;
	this.font = font;
};

/* Static Methods */

tg.Glyph.static = {};

tg.Glyph.static.getPoint = function( points, index ) {
	var a, b, x, y, radius, angle,
		tollerance = 0.001,
		integer = Math.floor( index ),
		decimal = index - integer;
	if ( decimal < tollerance ) {
		// Absolute values
		return points[integer].slice( 0 );
	}
	// Interpolated values
	a = points[integer];
	b = points[integer + 1];
	x = b[0] - a[0];
	y = b[1] - a[1];
	radius = Math.sqrt( x * x + y * y ) * decimal;
	angle = Math.atan2( y, x );
	return [ radius * Math.cos( angle ) + a[0], radius * Math.sin( angle ) + a[1] ];
};

/* Methods */

tg.Glyph.prototype.getPath = function () {
	var i, len, prev, curr, run,
		getPoint = this.constructor.static.getPoint,
		font = this.font,
		model = font.getModel( this.character ),
		strokes = model.strokes,
		points = model.points,
		segments = [],
		steps = [],
		path = '';

	// Evaluate segments
	for ( i = 0, len = strokes.length; i < len; i++ ) {
		// HACK: Hardcoded for lines only
		segments.push( [
			font.transformPoint( getPoint( points, strokes[i][0] ) ),
			font.transformPoint( getPoint( points, strokes[i][1] ) )
		] );
	}

	// Build SVG path steps from segments
	for ( i = 0, len = segments.length; i < len; i++ ) {
		prev = curr;
		curr = segments[i];
		if ( !prev || prev[1][0] !== curr[0][0] || prev[1][1] !== curr[0][1] ) {
			// Move
			steps.push( 'M', curr[0][0], curr[0][1], 'L', curr[1][0], curr[1][1] );
		} else {
			// Keep going
			steps.push( curr[1][0], curr[1][1] );
		}
	}

	// Stringify SVG path steps
	for ( i = 0, len = steps.length; i < len; i++ ) {
		if ( typeof steps[i] === 'string' ) {
			path += steps[i];
		} else {
			run = [];
			while ( typeof steps[i] === 'number' ) {
				run.push( steps[i] );
				i++;
			}
			i--;
			if ( run.length ) {
				path += run.join( ',' );
			}
		}
	}
	return path;
};
