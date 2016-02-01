// -- Client-side --

/**
 * @file Manages the dot object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */



/**
 * @class CDot
 * @desc Class representing Dot player
 */
function CDot ()
{
  'use strict';

  // -- Private -- //

  // For a 100x100 map, each square is 5
  var pid;          /* Player ID */
  var xLoc = -1;    /* Starting position on x-axis */
  var yLoc = -1;    /* Starting position on y-axis */
  var lastXLoc;     /* Previous position on the x-axis */
  var lastYLoc;     /* Previous position on the y-axis */
  var score = 0;    /* Dot player's running score */
  var set = false;  /* Indicates if dot is currently set in-game */




  // -- Public -- //

  /**
   * @property ID
   * @memberof CDot
   * @return {Int} - PLayer ID
   * @desc Getter for current Dot player ID
   * @public
   */
  Object.defineProperty(this, 'ID', {
    get: function() { return pid; },
    set: function(newID) { pid = newID; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property XLoc
   * @memberof CDot
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
   * @memberof CDot
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
   * @memberof CDot
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
   * @memberof CDot
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
   * @memberof CDot
   * @param {Int} x - New x-axis position of dot
   * @param {Int} y - New y-axis position of dot
   *
   * @desc Sets a new position for the dot player
   */
  CDot.prototype.setValue = function (x, y)
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
   * @memberof CDot
   * @param {Int} scoreIn - New score to set (optional)
   *
   * @desc Resets all dot properties to default values
   */
  CDot.prototype.setDefault = function (scoreIn)
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
   * @memberof CDot
   *
   * @desc Decreases dot score if dot is not set
   */
  CDot.prototype.dotCheck = function ()
  {
    if (!set && score > 0) {
      score -= 2;
    } else if (set) {
      score += 1;
    }
  };

  /**
   * @member stateUpdate
   * @memberof CDot
   *
   * @desc Updates the dot player's current state
   */
  CDot.prototype.stateUpdate = function (p2Data)
  {
    // Update dot player id
    pid = p2Data.pid;
    // Update dot position
    lastXLoc = xLoc;
    xLoc = p2Data.xloc;
    lastYLoc = yLoc;
    yLoc = p2Data.yloc;
    // Update score and set status
    score = p2Data.score;
    set = p2Data.set;
  };

}
