/**
 * TypeGen Glyph.
 *
 */
tg.Glyph = function ( character, font ) {
	this.character = character;
	this.font = font;
	this.model = this.font.getModel( character );
};

/* Static Properties */

tg.Glyph.static = {};

tg.Glyph.static.precision = 4;
tg.Glyph.static.tolerance = Math.pow( 10, -tg.Glyph.static.precision );

/* Methods */

tg.Glyph.prototype.getPoint = function ( index ) {
	var a, b,
		points = this.model.points,
		integer = Math.floor( index ),
		decimal = index - integer;

	if ( decimal < tg.Glyph.static.tolerance ) {
		// Absolute values
		return this.font.transformPoint( points[integer].slice( 0 ) );
	}

	// Interpolated values
	a = points[integer];
	b = points[integer + 1];
	return this.font.transformPoint(
		[ ( b[0] - a[0] ) * decimal + a[0], ( b[1] - a[1] ) * decimal + a[1] ]
	);
};

tg.Glyph.prototype.getPath = function () {
	var i, len, stroke, run, outline, start, end, m1, m2, s1, s2, e1, e2,
		precision = this.constructor.static.precision,
		font = this.font,
		model = font.getModel( this.character ),
		strokes = model.strokes,
		steps = [],
		weight = font.getParamValue( 'weight' ),
		meanLine = font.getParamValue( 'meanLine' ),
		path = '';

	// Outline segments
	for ( i = 0, len = strokes.length; i < len; i++ ) {
		stroke = strokes[i];
		outline = null;
		switch ( stroke.type ) {
			case 'diagonal-stroke':
			case 'descender':
			case 'ascender':
			case 'stem':
			case 'arm':
				outline = tg.getStrokeOutline(
					this.getPoint( stroke.from ),
					this.getPoint( stroke.to ),
					0,
					0,
					weight
				);
				break;
			case 'crossbar':
				// HACK: only uses first and last stroke
				start = strokes[stroke.through[0]];
				end = strokes[stroke.through[stroke.through.length - 1]];

				m1 = [0, meanLine];
				m2 = [1, meanLine];
				s1 = this.getPoint( start.from ),
				s2 = this.getPoint( start.to ),
				e1 = this.getPoint( end.from ),
				e2 = this.getPoint( end.to );

				outline = tg.getStrokeOutline(
					tg.getIntersection( m1, m2, s1, s2 ),
					tg.getIntersection( m1, m2, e1, e2 ),
					tg.getLineAngle( s1, s2 ),
					tg.getLineAngle( e1, e2 ),
					weight
				);

				break;
		}
		if ( outline ) {
			steps.push(
				'M', outline[0][0], outline[0][1],
				'L', outline[1][0], outline[1][1],
					outline[2][0], outline[2][1],
					outline[3][0], outline[3][1],
				'Z'
			);
		}
	}

	// Stringify SVG path steps
	for ( i = 0, len = steps.length; i < len; i++ ) {
		if ( typeof steps[i] === 'string' ) {
			path += steps[i];
		} else {
			run = [];
			while ( typeof steps[i] === 'number' ) {
				run.push( steps[i].toFixed( precision ) );
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
