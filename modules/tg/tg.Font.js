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
			[ 'diagonal-stroke', 0, 1 ],
			[ 'diagonal-stroke', 1, 2 ],
			[ 'crossbar', 0.5, 1.5 ]
		]
	}
};

tg.Font.static.params = {
	'weight': {
		'min': 0,
		'max': 0.2,
		'step': 0.001,
	},
	'obliqueness': {
		'min': -1,
		'max': 1,
		'step': 0.01,
	},
	'width': {
		'min': 0,
		'max': 2,
		'step': 0.01
	},
	'crossbarHeight': {
		'min': -0.5,
		'max': 0.5,
		'step': 0.01
	}
};

tg.Font.static.defaults = {
	'weight': 0.1,
	'obliqueness': 0,
	'width': 1,
	'crossbarHeight': 0
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

tg.Font.prototype.getParamNames = function () {
	return Object.keys( this.constructor.static.params );
};

tg.Font.prototype.setParamValue = function ( key, value ) {
	this.params[key] = value;
};

tg.Font.prototype.getParamValue = function ( key ) {
	return this.params[key];
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

tg.Font.prototype.getParamStep = function ( key ) {
	return this.constructor.static.params[key].step;
};
