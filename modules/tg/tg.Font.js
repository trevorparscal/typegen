/**
 * TypeGen Font.
 *
 */
tg.Font = function () {
	this.params = tg.createObject( this.constructor.static.defaultParams );
};

/* Static Properties */

tg.Font.static = {};

tg.Font.static.models = {
	'A': {
		'points': [
			[ 0, 1 ],
			[ 0.5, 0 ],
			[ 1, 1 ]
		],
		'strokes': [
			[ 0, 1 ],
			[ 1, 2 ],
			[ 0.5, 1.5 ]
		]
	}
};

tg.Font.static.defaultParams = {
	'weight': 1,
	'obliqueness': 0,
	'width': 1
};

/* Methods */

tg.Font.prototype.getGlyph = function ( character ) {
	if ( character in this.constructor.static.models ) {
		return new tg.Glyph( character, this );
	}
	return null;
};

tg.Font.prototype.getModel = function ( character ) {
	var models = this.constructor.static.models;
	if ( character in models ) {
		return models[character];
	}
	return null;
};

tg.Font.prototype.transformPoint = function ( point ) {
	point = point.slice( 0 );
	if ( this.params.obliqueness !== 0 ) {
		// Shear X (x = x + shear * y)
		point[0] += this.params.obliqueness * ( 1 - point[1] );
	}
	if ( this.params.width !== 1 ) {
		// Scale X (x = x * width)
		point[0] *= this.params.width;
	}
	return point;
};

tg.Font.prototype.setParam = function ( key, value ) {
	this.params[key] = value;
};

tg.Font.prototype.getParam = function ( key ) {
	return this.params[key];
};

tg.Font.prototype.resetParam = function ( key ) {
	delete this.params[key];
};
