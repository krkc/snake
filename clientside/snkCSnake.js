// -- Client-side --

/**
 * @file Manages the client's snake object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


/**
 * @class CSnake
 * @desc Class representing Dot player
 */
function CSnake ()
{
  'use strict';

  var pid;            /* Snake player's id */

  var headx;          /* Starting position on x-axis */
  var heady;          /* Starting position on y-axis */

  var xLoc = [];      /* Array of snake x-axis coordinates */
  var yLoc = [];      /* Array of snake y-axis coordinates */
  var lastXLoc = [];  /* Previous position on the x-axis */
  var lastYLoc = [];  /* Previous position on the y-axis */
  var movingLeft;     /* Movement status flags */
  var movingRight;
  var movingUp;
  var movingDown;

  var score;    /* Player score */

  // Initialize player data
  initData();



  /**
   * @property ID
   * @memberof CSnake
   * @return {Array} - x-axis locations of snake blocks
   * @desc Getter for current snake x-axis location
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
   * @memberof CSnake
   * @return {Array} - x-axis locations of snake blocks
   * @desc Getter for current snake x-axis location
   * @public
   */
  Object.defineProperty(this, 'XLoc', {
    get: function() { return xLoc; },
    enumerable: true,
    configurable: true
  });


  /**
   * @property YLoc
   * @memberof CSnake
   * @return {Array} - y-axis locations of snake blocks
   * @desc Getter for current snake y-axis location
   * @public
   */
  Object.defineProperty(this, 'YLoc', {
    get: function() { return yLoc; },
    enumerable: true,
    configurable: true
  });


  /**
   * @property Score
   * @memberof CSnake
   * @return {Integer} - score of the current snake player
   * @desc Getter for current snake player's running score
   * @public
   */
  Object.defineProperty(this, 'Score', {
    get: function() { return score; },
    enumerable: true,
    configurable: true
  });


  // -- Private methods -- //

  /**
   * @function initData
   *
   * @desc Initializes default snake player data
   */
  function initData()
  {
    // For a 100x100 map, each square is 5
    headx = 45;   /* Starting position on x-axis */
    heady = 95;   /* Starting position on y-axis */

    xLoc = [headx, headx, headx, headx, headx];
    yLoc = [heady, heady, heady, heady, heady];
    movingLeft = false;
    movingRight = false;
    movingUp = false;
    movingDown = false;

    score = 0;
  }


  /*
    Function:     moveSnake()
    Parameters:		string (direction)
    Return:			  none
    Description:	Calculate new snake block positions.
  */
  function moveSnake(direction)
  {
    // Reset moving flags.
    movingUp = false;
    movingDown = false;
    movingLeft = false;
    movingRight = false;

    // Move all snake blocks except head.
    var lastblock = yLoc.length - 1;
    for (lastblock; lastblock > 0; lastblock--) {
      xLoc[lastblock] = xLoc[lastblock - 1];
      yLoc[lastblock] = yLoc[lastblock - 1];
    }

    // Move snake head block.
    if (direction == "up") {
      if (yLoc[0] > 0)
        yLoc[0] = heady-=5;
      movingUp = true;
    }
    else if (direction == "down") {
      if (yLoc[0] < 95)
        yLoc[0] = heady+=5;
      movingDown = true;
    }
    else if (direction == "left") {
      if (xLoc[0] > 0)
        xLoc[0] = headx-=5;
      movingLeft = true;
    } else {
      if (xLoc[0] < 95)
        xLoc[0] = headx+=5;
      movingRight = true;
    }

  }

  /*
    Function:     isEatingTail()
    Parameters:		none
    Return:			  bool
    Description:	Determine if snake has hit its tail or a wall.
  */
  function isEatingTail()
  {

    var snklen = xLoc.length;

    for (var i = 1; i <= snklen - 1; i++) {
      if (headx == xLoc[i] && heady == yLoc[i]) {
        return true;
      }
    }
    return false;

  }

  /**
   * @function deepCopy
   * @memberof CSnake
   * @param {Array} arrIn - Original array to copy
   * @return {Array} - Deep copy
   *
   * @desc Makes a deep copy of an array
   */
  function deepCopy (arrIn)
  {
    var newArr = [];
    for (var i = 0; i < arrIn.length; i++) {
      newArr.push(arrIn[i]);
    }
    return newArr;
  }


  // -- Public methods -- //

  /**
    @function isColliding
    @memberof CSnake
    @param {object} obj - Foreign object to test
    @return {bool} true for collision
    @desc Detects whether snake is colliding with dot.
  */
  CSnake.prototype.isColliding = function(obj)
  {
    // If snake head is > dot x/y, or is < dot x/y + rcux/y[5]
    // then return true for colliding flag. else false.
    //if ((headx >= obj.XLoc && headx <= (obj.XLoc + 2)) && (heady >= obj.YLoc && heady <= (obj.YLoc + 2))) {
    if (headx == obj.XLoc && heady == obj.YLoc) {
      return true;
    } else {
      return false;
    }
  };


  /**
    @function updateLoc
    @memberof CSnake
    @return {bool} true for collision
    @desc Update snake location each tick.
  */
  CSnake.prototype.updateLoc = function(keyIsPressed)
  {
    if (keyIsPressed[0] === true && !movingDown) {
      // Move up
      moveSnake("up");
    }
    else if (keyIsPressed[1] === true && !movingUp) {
      // Move down
      moveSnake("down");
    }
    else if (keyIsPressed[2] === true && !movingRight) {
      // Move left
      moveSnake("left");
    }
    else if (keyIsPressed[3] === true && !movingLeft) {
      // Move right
      moveSnake("right");
    }
    else {
      // Continue moving.
      if (movingUp)
        moveSnake("up");
      if (movingDown)
        moveSnake("down");
      if (movingLeft)
        moveSnake("left");
      if (movingRight)
        moveSnake("right");
    }
    // Reset keypress flags.
    keyIsPressed[0] = false;
    keyIsPressed[1] = false;
    keyIsPressed[2] = false;
    keyIsPressed[3] = false;

    return !isEatingTail();
  };


  /**
   * @function grow
   * @memberof CSnake
   * @desc Increase length of snake tail by 3.
  */
  CSnake.prototype.grow = function ()
  {
    var lastBlock = xLoc.length - 1;
    for (var i=0; i<3; i++) {
      xLoc.push(xLoc[lastBlock]);
      yLoc.push(yLoc[lastBlock]);
    }

    score += 10;
  };


  /**
   * @function setDefaults
   * @memberof CSnake
   * @param {Int} scoreIn - New score to set (optional)
   *
   * @desc Clear all player data to defaults
  */
  CSnake.prototype.setDefaults = function (scoreIn)
  {
    // Set location/movement data to defaults
    initData();
    // Set score
    if (scoreIn) {
      score = scoreIn;
    }
  };

  /**
   * @member stateUpdate
   * @memberof CSnake
   *
   * @desc Updates the dot player's current state
   */
  CSnake.prototype.stateUpdate = function (p1Data)
  {
    // Update snake player id
    pid = p1Data.pid;
    // Update snake position
    if (lastXLoc.length !== xLoc.length) {
      // Reconnect arrays if needed
      lastXLoc = null;
      lastYLoc = null;
      lastXLoc = xLoc;
      lastYLoc = yLoc;
    }
    // Make a deep copy of arrays if needed
    if (lastXLoc.length !== p1Data.xloc.length) {
      lastXLoc = deepCopy(xLoc);
      lastYLoc = deepCopy(yLoc);
    }
    xLoc = p1Data.xloc;
    yLoc = p1Data.yloc;
    // Update score
    score = p1Data.score;
  };

}
