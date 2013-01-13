/**
 * TypeGen Angle.
 *
 * @class
 * @constructor
 * @param {number} radians Angle in radians
 */
tg.Angle = function ( radians ) {
	// Properties
	this.radians = radians || 0;
	if ( this.radians instanceof tg.Angle ) {
		this.radians = this.radians.radians;
	}
};

/* Methods */

/**
 * Get a copy of this angle.
 *
 * @method
 * @returns {tg.Angle}
 */
tg.Angle.prototype.clone = function () {
	return new tg.Angle( this.radians );
};

/**
 * Get value in radians.
 *
 * @method
 * @returns {number}
 */
tg.Angle.prototype.toNumber = function () {
	return this.radians;
};

/**
 * Rotate angle by a factor.
 *
 * @method
 * @param {number} factor Rotation amount, where 1 = 360º
 * @returns {tg.Angle}
 */
tg.Angle.prototype.rotateByFactor = function ( factor ) {
	var max = Math.PI * 2;
	return new tg.Angle( ( this.radians + max * factor ) % max );
};

/**
 * Invert angle.
 *
 * @method
 * @returns {tg.Angle}
 */
tg.Angle.prototype.invert = function () {
	return new tg.Angle( ( this.radians + Math.PI ) % ( Math.PI * 2 ) );
};
