// -- Server-side --

/**
 * @file Manages the dot object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */



/**
 * @class Dot
 * @desc Class representing Dot player
 */
var Dot = function ()
{
  'use strict';

  // -- Private -- //

  // For a 100x100 map, each square is 5
  var xLoc = -1;    /* Starting position on x-axis */
  var yLoc = -1;    /* Starting position on y-axis */
  var score = 0;    /* Dot player's running score */
  var set = false;  /* Indicates if dot is currently set in-game */




  // -- Public -- //

  /**
   * @property XLoc
   * @memberof Dot
   * @return {Int} - x-axis locations of dot
   * @desc Getter for current dot x-axis location
   * @public
   */
  Object.defineProperty(this, 'XLoc', {
    get: function() { return xLoc; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property YLoc
   * @memberof Dot
   * @return {Int} - y-axis locations of dot blocks
   * @desc Getter for current dot y-axis location
   * @public
   */
  Object.defineProperty(this, 'YLoc', {
    get: function() { return yLoc; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property Score
   * @memberof Dot
   * @return {Integer} - score of the current dot player
   * @desc Getter for current dot player's running score
   * @public
   */
  Object.defineProperty(this, 'Score', {
    get: function() { return score; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property DotSet
   * @memberof Dot
   * @param {Boolean} newStatus - Updated set status for dot (when used as setter)
   * @return {Boolean} - confirmation that dot is set (when used as getter)
   * @desc Updates dot set status or returns confirmation that dot is set
   * @public
   */
  Object.defineProperty(this, 'DotSet', {
    get: function() { return set; },
    set: function(newStatus) { set = newStatus; },
    enumerable: true,
    configurable: true
  });

  /**
   * @member setValue
   * @memberof Dot
   * @param {Int} x - New x-axis position of dot
   * @param {Int} y - New y-axis position of dot
   *
   * @desc Sets a new position for the dot player
   */
  Dot.prototype.setValue = function (x, y)
  {
    if (!set) {
      // Dot is not yet set; set the dot
      xLoc = x;
      yLoc = y;
      set = true;
    }
  };

  /**
   * @member setDefault
   * @memberof Dot
   * @param {Int} scoreIn - New score to set (optional)
   *
   * @desc Resets all dot properties to default values
   */
  Dot.prototype.setDefault = function (scoreIn)
  {
    xLoc = -1;
    yLoc = -1;
    set = false;

    score = 0;
    if (scoreIn) {
      score = scoreIn;
    }
  };

  /**
   * @member dotCheck
   * @memberof Dot
   *
   * @desc Decreases dot score if dot is not set
   */
  Dot.prototype.dotCheck = function ()
  {
    if (!set && score > 0) {
      score -= 2;
    } else if (set) {
      score += 1;
    }
  };

};

module.exports = Dot;
