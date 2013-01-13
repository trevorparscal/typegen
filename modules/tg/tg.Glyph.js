/**
 * TypeGen Glyph.
 *
 * @class
 * @constructor
 */
tg.Glyph = function ( model, font ) {
	this.font = font;
	this.model = model;
	this.paths = [];
	this.updatePaths();
};

/* Methods */

tg.Glyph.prototype.getWidth = function () {
	var i, len, value,
		max = 0,
		points = this.model.points;
	for ( i = 0, len = this.model.points.length; i < len; i++ ) {
		value = this.font.transformGuidePoint( new tg.Point( points[i][0], points[i][1] ) );
		if ( value.x > max ) {
			max = value.x;
		}
	}
	return max;
};

tg.Glyph.prototype.updatePaths = function () {
	var i, len, stroke, a, b, c, ab, ba, bc, ac, axis, flip, sio, soo, eio, eoo, mio, moo,
		guide = new tg.Path(),
		paths = [],
		points = this.model.points,
		strokes = this.model.strokes,
		weight = this.font.getParam( 'weight' ).getValue() * 0.05;

	// Build guide
	for ( i = 0, len = points.length - 1; i < len; i++ ) {
		guide.push(
			new tg.Line(
				this.font.transformGuidePoint( new tg.Point( points[i][0], points[i][1] ) ),
				this.font.transformGuidePoint( new tg.Point( points[i + 1][0], points[i + 1][1] ) )
			)
		);
	}

	for ( i = 0, len = strokes.length; i < len; i++ ) {
		stroke = strokes[i];
		sio = -weight - ( weight * stroke.offsets[0] );
		soo = ( weight - ( weight * stroke.offsets[0] ) ) * -1;
		eio = -weight - ( weight * stroke.offsets[stroke.offsets.length - 1] );
		eoo = ( weight - ( weight * stroke.offsets[stroke.offsets.length - 1] ) ) * -1;
		switch ( stroke.type ) {
			case 'stroke':
			case 'descender':
			case 'ascender':
			case 'stem':
			case 'arm':
			case 'crossbar':
				a = guide.getPointAtFactor( stroke.points[0] );
				b = guide.getPointAtFactor( stroke.points[1] );
				ab = new tg.Line( a, b );
				ba = new tg.Line( b, a );
				paths.push(
					new tg.Path( [
						ab.offsetBy( sio, eio ),
						ba.offsetBy( soo, eoo )
					] )
				);
				break;
			case 'bowl':
				a = guide.getPointAtFactor( stroke.points[0] );
				b = guide.getPointAtFactor( stroke.points[1] );
				c = guide.getPointAtFactor( stroke.points[2] );
				ab = new tg.Line( a, b );
				bc = new tg.Line( b, c );
				ac = new tg.Line( a, c );
				axis = ac.getAngle().rotateByFactor( 0.25 );
				flip = axis.toNumber() >= Math.PI;
				mio = -weight - ( weight * stroke.offsets[1] );
				moo = ( weight - ( weight * stroke.offsets[1] ) ) * -1;
				paths.push(
					new tg.Path( [
						new tg.Curve( a, ab.reflectOn( axis ).getPointAtFactor( flip ? 1 : 0 ), b ).offsetBy( sio, mio ),
						new tg.Curve( b, bc.reflectOn( axis ).getPointAtFactor( flip ? 0 : 1 ), c ).offsetBy( mio, eio ),
						new tg.Curve( c, bc.reflectOn( axis ).getPointAtFactor( flip ? 0 : 1 ), b ).offsetBy( eoo, moo ),
						new tg.Curve( b, ab.reflectOn( axis ).getPointAtFactor( flip ? 1 : 0 ), a ).offsetBy( moo, soo ),
					] )
				);
				break;
		}
	}
	this.paths = paths;
};

tg.Glyph.prototype.toSvgString = function () {
	var i, len,
		str = '';

	this.updatePaths();
	for ( i = 0, len = this.paths.length; i < len; i++ ) {
		str += this.paths[i].toSvgString( this.font );
	}
	return str;
};

/*
tg.Glyph.prototype.getPath = function () {
	var i, len, stroke, run, outline, start, end, sa, ea, ma, m1, m2, s1, s2, e1, e2, p1, p2, p3,
		precision = this.constructor.static.precision,
		font = this.font,
		strokes = this.model.strokes,
		steps = [],
		weight = font.getParamValue( 'weight' ) / 10,
		meanLine = font.getParamValue( 'meanLine' ),
		path = '';

	// Outline segments
	for ( i = 0, len = strokes.length; i < len; i++ ) {
		stroke = strokes[i];
		outline = null;
		switch ( stroke.type ) {
			case 'stroke':
			case 'descender':
			case 'ascender':
			case 'stem':
			case 'arm':
				p1 = this.getPoint( stroke.from );
				p2 = this.getPoint( stroke.to );
				sa = ea = tg.getLineAngle( p1, p2 ) - Math.PI / 2;
				steps = steps.concat(
					this.font.getRectPath(
						this.font.getStrokeOutline( p1, p2, sa, ea, weight, stroke.bias )
					)
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
				p1 = tg.getIntersection( m1, m2, s1, s2 );
				p2 = tg.getIntersection( m1, m2, e1, e2 );
				sa = tg.getLineAngle( s1, s2 );
				ea = tg.getLineAngle( e1, e2 );
				steps = steps.concat(
					this.font.getRectPath(
						this.font.getStrokeOutline( p1, p2, sa, ea, weight, 0 )
					)
				);
				break;
			case 'bowl':
				p1 = this.getPoint( stroke.from );
				p2 = this.getPoint( stroke.through );
				p3 = this.getPoint( stroke.to );
				sa = ea = tg.getLineAngle( p1, p3 );
				ma = sa - Math.PI / 2;
				steps = steps.concat(
					this.font.getRectPath(
						this.font.getStrokeOutline( p1, p2, sa, ma, weight, stroke.bias ), -0.25
					)
				);
				steps = steps.concat(
					this.font.getRectPath(
						this.font.getStrokeOutline( p2, p3, ma, ea, weight, stroke.bias ), -0.25
					)
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
			if ( run.length ) {
				path += run.join( ',' );
				i--;
			}
		}
	}
	return path;
};
*/