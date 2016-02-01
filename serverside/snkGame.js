// -- Server-side --

/**
 * @file Manages the game state object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


/**
 * Represents an active game state
 * @class
 */
var Game = function (p1, p2) {
  'use strict';

  //var events = require('events');   /* Events middleware module */
  var mainloop = null;    /* ID for setInterval callback (this.mainl) */
  var self = this;        /* Explicit reference to current context for calling setInterval */
  var readyPlayers = 0;   /* Players that are ready for play */



  //this.eventEmitter = new events.EventEmitter();  /* Event emitter object */

  this.keyIsPressed = [false, false, false, false];   /* Keypress flags */

  /**
   * @member gameSpeed
   * @memberof Game
   */
  this.gameSpeed = 800;					/* Game speed in milliseconds */

  /**
   * @member gameRunning
   * @memberof Game
   */
  this.gameRunning = false;					/* Game running status */

  /**
   * @member GameID
   * @memberof Game
   */
  this.GameID = p1.toString() + p2.toString();

  /**
   * @member PlayerOne
   * @memberof Game
   */
  var Snake = require('./snkSnake');
  this.PlayerOne = new Snake();
  this.PlayerOne.ID = p1;

  /**
   * @member PlayerTwo
   * @memberof Game
   */
  var Dot = require('./snkDot');
  this.PlayerTwo = new Dot();
  this.PlayerTwo.ID = p2;

  /**
   * @member Message
   * @memberof Game
   */
  this.Message = null;

  /**
   * @member MsgTargetID
   * @memberof Game
   */
  this.MsgTargetID = null;


  /**
   * @function gameOver
   * @memberof Game
   * @desc End gameplay round
   */
  Game.prototype.gameOver = function ()
  {
    try {
      clearInterval(mainloop);
      mainloop = null;
    }
    catch (e) {
      console.log('clearInterval failed:' + e.message);
    }
    this.gameRunning = false;
    // Inform clients that game has ended
    this.Message = "Round Over";
    this.sendData({
      GameOver: true,
      Toast: {
        msg: this.Message
      }
    });
  };

  /**
   * @function reset
   * @memberof Game
   * @desc Reset the game-state
   */
  Game.prototype.reset = function ()
  {
    try {
      clearInterval(mainloop);
      mainloop = null;
    }
    catch (e) {
      console.log('clearInterval failed:' + e.message);
    }
    this.gameRunning = false;
    this.PlayerOne.setDefaults();
    this.PlayerTwo.setDefault();
    this.sendData({
      ResetAck: true
    });
  };

  /**
   * @function init
   * @memberof Game
   * @param {bool} noreset - Option to reset game or create new game
   * @desc Initialize the game environment prior to the game loop starting.
   */
  Game.prototype.init = function ()
  {
    // 1. Player 2 chooses dot location.
    // 2. Player 1 presses a key.
    // 3. Main game loop begins.
    if (mainloop === null) {
      mainloop = setInterval(this.mainl, this.gameSpeed);
    }
  };

  /**
   * @function main
   * @memberof Game
   * @desc Main server-side game loop.
   */
  Game.prototype.mainl = function ()
  {
    if (self.gameRunning) {
      // Update snake location.
      if (!self.PlayerOne.updateLoc(self.keyIsPressed)) {
        // Snake died. Initiate game over.
        self.gameOver();
      } else {
        // Test if colliding with dot.
        if (self.PlayerOne.isColliding(self.PlayerTwo)) {
          // Dot collision detected. Increase score and respawn dot.
          self.PlayerOne.grow();
          // Clear dot position until reset
          self.PlayerTwo.setDefault();
        }
        // Adjust dot score
        self.PlayerTwo.dotCheck();
        // Send 'StateUpdate' message to client
        self.sendData();
      }
    }
  };  // End mainl

  /**
   * @function sendData
   * @memberof Game
   * @param {Object} dataOut - Data going out to the client (optional)
   * @desc Send outgoing data to the client player
   */
  Game.prototype.sendData = function (dataOut)
  {
    // Send outgoing packet with new coordinates to clients
    if (dataOut) {
      // A non-standard message is being sent
      this.eventEmitter.emit('dataFromGame', dataOut);
    } else {
      // A standard game-state message is being sent
      this.eventEmitter.emit('dataFromGame', {
        StateUpdate: {
          playerone: {
            pid: self.PlayerOne.ID,
            xloc: self.PlayerOne.XLoc,
            yloc: self.PlayerOne.YLoc,
            score: self.PlayerOne.Score,
            direction: self.PlayerOne.Direction
          },
          playertwo: {
            pid: self.PlayerTwo.ID,
            xloc: self.PlayerTwo.XLoc,
            yloc: self.PlayerTwo.YLoc,
            score: self.PlayerTwo.Score,
            set: self.PlayerTwo.DotSet
          }
        }
      }); // End eventemiiter
    }
  };  // End sendData

  /**
   * @function runData
   * @memberof Game
   * @param {Object} dataIn - Data coming in from the client
   * @desc Receive and process incoming data sent from client player
   */
  Game.prototype.runData = function (dataIn) {
    // -- Server message: 'PlayerReady' -- //
    if (dataIn.PlayerReady) {
      // A player is ready, increment readyPlayer counter
      if (++readyPlayers >= 2) {
        // Start game
        this.init();
        // Send updated data to clients
        this.Message = "Click or touch anywhere to place dot and begin game.";
        this.MsgTargetID = this.PlayerTwo.ID;
        this.sendData({
          GameReady: {
            playerone: {
              pid: this.PlayerOne.ID
            },
            playertwo: {
              pid: this.PlayerTwo.ID
            }
          },
          Toast: {
            pid: this.MsgTargetID,
            msg: this.Message
          }
        });
      }
    }
    // -- Server message: 'ResetRequest' -- //
    if (dataIn.ResetRequest) {
      // Perform reset
      this.reset();
    }
    // -- Server message: 'Input' -- //
    if (dataIn.Input){
      if (dataIn.Input.keybd) {
        if (dataIn.Input.pid === this.PlayerOne.ID) {
          if (!this.gameRunning && this.PlayerTwo.DotSet) {
            this.gameRunning = true;
          }
          if (this.gameRunning) {
            this.keyIsPressed = dataIn.Input.keybd.keys;
          }
        }
      }
      if (dataIn.Input.mouse) {
        if (dataIn.Input.pid === this.PlayerTwo.ID) {
          this.PlayerTwo.setValue(dataIn.Input.mouse.x, dataIn.Input.mouse.y);
          this.sendData();
        }
      }
      if (dataIn.Input.touch) {
        if (dataIn.Input.pid === this.PlayerOne.ID) {
          if (!this.gameRunning && this.PlayerTwo.DotSet) {
            this.gameRunning = true;
          }
          if (this.gameRunning) {
            this.keyIsPressed = dataIn.Input.touch.pan.direction;
          }
        }
      }
    }
  };  // End runData
};  // End Game


module.exports = Game;
