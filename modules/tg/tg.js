/**
 * TypeGen namesapce.
 *
 * @static
 * @type {Object}
 */
var tg = {};

/* Static Properties */

/**
 * Level of decimal precision.
 *
 * JavaScript's floating point support can be a little strange at times, so it's often useful to
 * approximate similarities between floating point values rather than using equality. The default
 * value of 5 causes 0.000005 and 0.000014 effectively equivilent in some calculations.
 *
 * @static
 * @type {number}
 */
tg.precision = 5;

/**
 * Numeric distance between effectively equivilent numbers.
 *
 * @see tg.precision
 *
 * @static
 * @type {number}
 */
tg.tolerance = Math.pow( 10, -tg.precision );

/**
 * Glyph models.
 *
 * @static
 * @type {Object}
 */
tg.glyphs = {
	'A': {
		'points': [
			[ 0, 1 ],
			[ 0.4, 0 ],
			[ 0.8, 1 ]
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'stroke', 'points': [ 1, 2 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'crossbar', 'points': [ 0.5, 1.5 ], 'offsets': [ 0, 0 ] }
		]
	},
	'B': {
		'points': [
			[ 0, 1 ],
			[ 0, 0 ],
			[ 0.4, 0 ],
			[ 0.8, 0.25 ],
			[ 0.4, 0.5 ],
			[ 0.8, 0.75 ],
			[ 0.4, 1 ],
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ -1, -1 ] },
			{ 'type': 'stroke', 'points': [ 1, 2 ], 'offsets': [ -1, -1 ] },
			{ 'type': 'bowl', 'points': [ 2, 3, 4 ], 'offsets': [ -1, 0, 0 ] },
			{ 'type': 'stroke', 'points': [ 4, 0.5 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'bowl', 'points': [ 4, 5, 6 ], 'offsets': [ 0, 0, -1 ] },
			{ 'type': 'stroke', 'points': [ 6, 0 ], 'offsets': [ -1, -1 ] }
		]
	},
	'D': {
		'points': [
			[ 0, 1 ],
			[ 0, 0 ],
			[ 0.4, 0 ],
			[ 0.8, 0.5 ],
			[ 0.4, 1 ],
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ -1, -1 ] },
			{ 'type': 'stroke', 'points': [ 1, 2 ], 'offsets': [ -1, -1 ] },
			{ 'type': 'bowl', 'points': [ 2, 3, 4 ], 'offsets': [ -1, -1, -1 ] },
			{ 'type': 'stroke', 'points': [ 4, 0 ], 'offsets': [ -1, -1 ] }
		]
	},
	'E': {
		'points': [
			[ 0.8, 0 ],
			[ 0, 0 ],
			[ 0, 1 ],
			[ 0.8, 1 ],
			[ 0.8, 0.5 ]
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'stroke', 'points': [ 1, 2 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'stroke', 'points': [ 2, 3 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'stroke', 'points': [ 1.5, 4 ], 'offsets': [ 0, 0 ] },
		]
	},
	'K': {
		'points': [
			[ 0, 0 ],
			[ 0, 1 ],
			[ 0, 0.66 ],
			[ 0.8, 0 ],
			[ 0.8, 1 ]
		],
		'strokes': [
			{ 'type': 'stem', 'points': [ 0, 1 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'stroke', 'points': [ 2, 3 ], 'offsets': [ 0.5, 0.5 ] },
			{ 'type': 'stroke', 'points': [ 2.33, 4 ], 'offsets': [ 0.5, 0.5 ] },
		]
	},
	'L': {
		'points': [
			[ 0, 0 ],
			[ 0, 1 ],
			[ 0.8, 1 ]
		],
		'strokes': [
			{ 'type': 'stem', 'points': [ 0, 1 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'stroke', 'points': [ 1, 2 ], 'offsets': [ 1, 1 ] },
		]
	},
	'U': {
		'points': [
			[ 0, 0 ],
			[ 0, 0.66 ],
			[ 0.4, 1 ],
			[ 0.8, 0.66 ],
			[ 0.8, 0 ]
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'bowl', 'points': [ 1, 2, 3 ], 'offsets': [ 1, 1 ] },
			{ 'type': 'stroke', 'points': [ 3, 4 ], 'offsets': [ 1, 1 ] }
		]
	},
	'W': {
		'points': [
			[ 0, 0 ],
			[ 0.25, 1 ],
			[ 0.5, 0 ],
			[ 0.75, 1 ],
			[ 1, 0 ]
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'stroke', 'points': [ 1, 2 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'stroke', 'points': [ 2, 3 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'stroke', 'points': [ 3, 4 ], 'offsets': [ 0, 0 ] }
		]
	},
	'X': {
		'points': [
			[ 0, 0 ],
			[ 0.8, 1 ],
			[ 0.8, 0 ],
			[ 0, 1 ]
		],
		'strokes': [
			{ 'type': 'stroke', 'points': [ 0, 1 ], 'offsets': [ 0, 0 ] },
			{ 'type': 'stroke', 'points': [ 2, 3 ], 'offsets': [ 0, 0 ] },
		]
	}
};

/* Static Methods */

/**
 * Inherit from one class to another.
 *
 * @static
 * @method
 * @param {Function} target Child class
 * @param {Function} origin Parent class
 */
tg.inheritClass = function ( target, origin ) {
	var targetConstructor = target.prototype.constructor;
	target.prototype = tg.createObject( origin.prototype );
	target.prototype.constructor = targetConstructor;
	origin.static = origin.static || {}; // Lazy-init
	target.static = tg.createObject( origin.static );
};

/**
 * Shim for Object.create.
 */
tg.createObject = Object.create || function ( origin ) {
	function O() {}
	O.prototype = origin;
	var r = new O();
	return r;
};
