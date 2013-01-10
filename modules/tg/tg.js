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

tg.getLineAngle = function ( a, b ) {
	return Math.atan2( b[1] - a[1], b[0] - a[0] );
};

tg.getIntersection = function ( a1, a2, b1, b2 ) {
	var aM, bM, aB, bB,
		isX = 0,
		isY = 0;

	if ( ( a2[0] - a1[0] ) === 0 ) {
		isX = a1[0];
		bM = ( b2[1] - b1[1] ) / ( b2[0] - b1[0] );
		bB = b2[1] - bM * b2[0];
		isY = bM * isX + bB;
	} else if ( ( b2[0] - b1[0] ) === 0 ){
		isX = b1[0];
		aM = ( a2[1] - a1[1] ) / ( a2[0] - a1[0] );
		aB = a2[1] - aM * a2[0];
		isY = aM * isX + aB;
	} else {
		aM = ( a2[1] - a1[1] ) / ( a2[0] - a1[0] );
		bM = ( b2[1] - b1[1] ) / ( b2[0] - b1[0] );
		aB = a2[1] - aM * a2[0];
		bB = b2[1] - bM * b2[0];
		isX = Math.max( ( ( bB - aB ) / ( aM - bM ) ), 0 );
		isY = aM * isX + aB;
	}
	return [ isX, isY ];
};

tg.getStrokeOutline = function ( a, b, ao, bo, radius ) {
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
