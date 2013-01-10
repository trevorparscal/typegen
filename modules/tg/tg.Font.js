/**
 * TypeGen Font.
 *
 */
tg.Font = function () {
	this.params = tg.createObject( this.constructor.static.defaults );
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
			{ 'type': 'diagonal-stroke', 'from': 0, 'to': 1 },
			{ 'type': 'diagonal-stroke', 'from': 1, 'to': 2 },
			{ 'type': 'crossbar', 'through': [ 0, 1 ] }
		]
	}
};

tg.Font.static.params = {
	'weight': {
		'min': 0,
		'max': 0.25
	},
	'obliqueness': {
		'min': -1,
		'max': 1,
		'transformPoint': function ( point, value ) {
			// Shear X
			return [ point[0] + value * ( 1 - point[1] ), point[1] ];
		}
	},
	'width': {
		'min': 0,
		'max': 2,
		'transformPoint': function ( point, value ) {
			// Scale X
			return [ point[0] * value, point[1] ];
		}
	},
	'meanLine': {
		'min': 0,
		'max': 1
	}
};

tg.Font.static.defaults = {
	'weight': 0.125,
	'obliqueness': 0,
	'width': 1,
	'meanLine': 0.5
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
	var key,
		params = this.constructor.static.params;

	for ( key in params ) {
		if ( typeof params[key].transformPoint === 'function' ) {
			point = params[key].transformPoint( point, this.params[key] );
		}
	}

	return point;
};

tg.Font.prototype.getParamNames = function () {
	return Object.keys( this.constructor.static.params );
};

tg.Font.prototype.setParamValue = function ( key, value ) {
	this.params[key] = value;
};

tg.Font.prototype.getParamValue = function ( key ) {
	return this.params[key];
};

tg.Font.prototype.resetParams = function () {
	var key;
	for ( key in this.constructor.static.params ) {
		delete this.params[key];
	}
};

tg.Font.prototype.resetParam = function ( key ) {
	delete this.params[key];
};

tg.Font.prototype.getParamMin = function ( key ) {
	return this.constructor.static.params[key].min;
};

tg.Font.prototype.getParamMax = function ( key ) {
	return this.constructor.static.params[key].max;
};
