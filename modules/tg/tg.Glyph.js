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

tg.Glyph.static.precision = 4;
tg.Glyph.static.tolerance = Math.pow( 10, -tg.Glyph.static.precision );

tg.Glyph.static.transformPoint = function ( font, point ) {
	point = point.slice( 0 );
	if ( font.params.obliqueness !== 0 ) {
		// Shear X (x = x + shear * y)
		point[0] += font.getParamValue( 'obliqueness' ) * ( 1 - point[1] );
	}
	if ( font.params.width !== 1 ) {
		// Scale X (x = x * width)
		point[0] *= font.getParamValue( 'width' );
	}
	return point;
};

tg.Glyph.static.getAngle = function ( font, points, index ) {
	var transformPoint = tg.Glyph.static.transformPoint,
		ap = Math.floor( index ),
		bp = Math.ceil( index ),
		a = transformPoint( font, points[ap] ),
		b = transformPoint( font, points[bp] );

	if ( ap === bp ) {
		// HACK
		return 0;
	} else {
		return Math.atan2( b[1] - a[1], b[0] - a[0] );
	}
};

tg.Glyph.static.getPoint = function ( font, points, index ) {
	var a, b,
		transformPoint = tg.Glyph.static.transformPoint,
		integer = Math.floor( index ),
		decimal = index - integer;
	if ( decimal < tg.Glyph.static.tolerance ) {
		// Absolute values
		return transformPoint( font, points[integer].slice( 0 ) );
	}
	// Interpolated values
	a = points[integer];
	b = points[integer + 1];
	return transformPoint(
		font, [ ( b[0] - a[0] ) * decimal + a[0], ( b[1] - a[1] ) * decimal + a[1] ]
	);
};

tg.Glyph.static.getStrokeOutline = function ( a, b, ao, bo, radius ) {
	var x = b[0] - a[0],
		y = b[1] - a[1],
		angle = Math.atan2( y, x ),
		accw90 = Math.PI + ( ao || 0 ),
		acw90 = Math.PI * 2 + ( ao || 0 ),
		bccw90 = Math.PI + ( bo || 0 ),
		bcw90 = Math.PI * 2 + ( bo || 0 ),
		ad = ( radius / 2 ) / Math.sin( angle - ( ao || 0 ) ),
		bd = ( radius / 2 ) / Math.sin( angle - ( bo || 0 ) );

	return [
		[ ad * Math.cos( accw90 ) + a[0], ad * Math.sin( accw90 ) + a[1] ],
		[ ad * Math.cos( acw90 ) + a[0], ad * Math.sin( acw90 ) + a[1] ],
		[ bd * Math.cos( bcw90 ) + b[0], bd * Math.sin( bcw90 ) + b[1] ],
		[ bd * Math.cos( bccw90 ) + b[0], bd * Math.sin( bccw90 ) + b[1] ]
	];
};

/* Methods */

tg.Glyph.prototype.getPath = function () {
	var i, len, stroke, run, outline,
		getPoint = this.constructor.static.getPoint,
		getAngle = this.constructor.static.getAngle,
		getStrokeOutline = this.constructor.static.getStrokeOutline,
		precision = this.constructor.static.precision,
		font = this.font,
		model = font.getModel( this.character ),
		strokes = model.strokes,
		points = model.points,
		steps = [],
		crossbarHeight = font.getParamValue( 'crossbarHeight' ),
		weight = font.getParamValue( 'weight' ),
		path = '';

	// Outline segments
	for ( i = 0, len = strokes.length; i < len; i++ ) {
		stroke = strokes[i];
		switch ( stroke[0] ) {
			case 'diagonal-stroke':
			case 'descender':
			case 'ascender':
			case 'crossbar':
			case 'stem':
			case 'arm':
				if ( stroke[0] === 'crossbar' ) {
					outline = getStrokeOutline(
						getPoint( font, points, stroke[1] + crossbarHeight ),
						getPoint( font, points, stroke[2] - crossbarHeight ),
						getAngle( font, points, stroke[1] ),
						getAngle( font, points, stroke[2] ),
						weight
					);
				} else {
					outline = getStrokeOutline(
						getPoint( font, points, stroke[1] ),
						getPoint( font, points, stroke[2] ),
						0,
						0,
						weight
					);
				}
				steps.push(
					'M', outline[0][0], outline[0][1],
					'L', outline[1][0], outline[1][1],
						outline[2][0], outline[2][1],
						outline[3][0], outline[3][1],
					'Z'
				);
				break;
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
