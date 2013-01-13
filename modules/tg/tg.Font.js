/**
 * TypeGen Font.
 *
 * @class
 * @constructor
 */
tg.Font = function () {
	// Properties
	this.params = {};
	this.glyphs = {};

	// Initialization
	this.params.weight = new tg.WeightParam();
	this.params.width = new tg.WidthParam();
	this.params.obliqueness = new tg.ObliquenessParam();
	this.loadGlyphs( /[a-zA-Z0-9]/ );
};

/* Methods */

/**
 * Loads a set of glyphs.
 *
 * @method
 * @param {RegExp} pattern Glyph name pattern
 * @returns {number} Number of loaded glyphs
 */
tg.Font.prototype.loadGlyphs = function ( pattern ) {
	var name,
		count = 0;
	for ( name in tg.glyphs ) {
		if ( pattern.test( name ) ) {
			this.glyphs[name] = new tg.Glyph( tg.glyphs[name], this );
			count++;
		}
	}
	return count;
};

/**
 * Get names of supported parameters.
 *
 * @method
 * @returns {string[]}
 */
tg.Font.prototype.getParamNames = function () {
	return Object.keys( this.params );
};

/**
 * Get a parameter.
 *
 * @method
 * @param {string} key
 * @returns {tg.Param}
 * @throws {Error} Unknown param
 */
tg.Font.prototype.getParam = function ( key ) {
	if ( key in this.params ) {
		return this.params[key];
	}
	throw new Error( 'Unknown param: ' + key );
};

/**
 * Reset all parameters to their default values.
 *
 * @method
 */
tg.Font.prototype.resetParams = function () {
	var key;
	for ( key in this.params ) {
		this.params[key].resetValue();
	}
};

/**
 * Get names of supported glyphs.
 *
 * @method
 * @returns {string[]}
 */
tg.Font.prototype.getGlyphNames = function () {
	return Object.keys( this.glyphs );
};

/**
 * Get a glyph.
 *
 * @method
 * @param {string} name
 * @returns {tg.Glyph}
 */
tg.Font.prototype.getGlyph = function ( name ) {
	if ( name in this.glyphs ) {
		return this.glyphs[name];
	}
	return null;
};

/**
 * Transform a final point.
 *
 * @method
 * @param {tg.Point} point
 * @returns {tg.Point}
 */
tg.Font.prototype.transformFinalPoint = function ( point ) {
	var key, param;

	for ( key in this.params ) {
		param = this.params[key];
		if ( typeof param.transformFinalPoint === 'function' ) {
			point = param.transformFinalPoint( point );
		}
	}
	return point;
};

/**
 * Transform a guide point.
 *
 * @method
 * @param {tg.Point} point
 * @returns {tg.Point}
 */
tg.Font.prototype.transformGuidePoint = function ( point ) {
	var key, param;

	for ( key in this.params ) {
		param = this.params[key];
		if ( typeof param.transformGuidePoint === 'function' ) {
			point = param.transformGuidePoint( point );
		}
	}
	return point;
};

/*
tg.Font.prototype.getStrokeOutline = function ( a, b, ao, bo, radius, bias ) {
	var x = b[0] - a[0],
		y = b[1] - a[1],
		angle = Math.atan2( y, x ),
		accw90 = Math.PI + ao,
		acw90 = Math.PI * 2 + ao,
		bccw90 = Math.PI + bo,
		bcw90 = Math.PI * 2 + bo,
		ne = ( 2 - ( bias + 1 ) ),
		pe = ( ( bias + 1 ) ),

		// Scale width based on weightBias
		weightBias = this.getParamValue( 'weightBias' ),
		min = radius * Math.abs( weightBias ),
		width = radius - min * Math.abs( ( weightBias > 0 ? Math.cos : Math.sin )( angle ) ),

		// Maintain line width
		ad = width * Math.sin( angle - ao ),
		bd = width * Math.sin( angle - bo );

		return [
			[ bd * ne * Math.cos( bccw90 ) + b[0], bd * ne * Math.sin( bccw90 ) + b[1] ],
			[ ad * ne * Math.cos( accw90 ) + a[0], ad * ne * Math.sin( accw90 ) + a[1] ],
			[ ad * pe * Math.cos( acw90 ) + a[0], ad * pe * Math.sin( acw90 ) + a[1] ],
			[ bd * pe * Math.cos( bcw90 ) + b[0], bd * pe * Math.sin( bcw90 ) + b[1] ]
		];
};

tg.Font.prototype.getArchPath = function ( outline, rise ) {
	var aa = tg.getLineAngle( outline[0], outline[1] ) + Math.PI / 2,
		ba = tg.getLineAngle( outline[2], outline[3] ) - Math.PI / 2,
		ac = [ ( outline[0][0] + outline[1][0] ) * 0.5, ( outline[0][1] + outline[1][1] ) * 0.5 ],
		bc = [ ( outline[2][0] + outline[3][0] ) * 0.5, ( outline[2][1] + outline[3][1] ) * 0.5 ];
	return [
		'M', outline[0][0], outline[0][1],
		'Q',
			rise * Math.cos( aa ) + ac[0], rise * Math.sin( aa ) + ac[1],
			outline[1][0], outline[1][1],
		'L', outline[2][0], outline[2][1],
		'Q',
			rise * Math.cos( ba ) + bc[0], rise * Math.sin( ba ) + bc[1],
			outline[3][0], outline[3][1],
		'Z'
	];
};

tg.Font.prototype.getRectPath = function ( outline ) {
	// Place control points at corners (square)
	return [
		'M', outline[0][0], outline[0][1],
		'L', outline[1][0], outline[1][1],
			outline[2][0], outline[2][1],
			outline[3][0], outline[3][1],
		'Z'
	];
};
*/
