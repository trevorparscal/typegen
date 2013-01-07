/**
 * TypeGen namesapce.
 */
var tg = {};

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

/*
tg.getDistanceBetweeenPoints = function ( a, b ) {
	var x = b[0] - a[0],
		y = b[1] - a[1];
	return Math.sqrt( x * x + y * y );
};

tg.getPolarCoordinates = function ( x, y ) {
	var r = Math.sqrt( x * x + y * y ),
		t = Math.atan2( x, y );
	return [ r, t ];
};

tg.getCartesianCoordinates = function ( r, t ) {
	return [ r * Math.cos( t ), r * Math.sin( t ) ];
};
*/

tg.getPointOnLine = function ( a, b, i ) {
	var x = b[0] - a[0],
		y = b[1] - a[1],
		r = Math.sqrt( x * x + y * y ),
		t = Math.atan2( x, y ) * i;
	return [ r * Math.cos( t ) + a[0], r * Math.sin( t ) + a[1] ];
};
