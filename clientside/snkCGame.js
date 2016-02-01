// -- Client-side -- //


/**
 * @file Client for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


function GameClient(conn)
{
	return new SnkCGame(conn);
}


function SnkCGame (conn)
{

	'use strict';

	var self = this;	/* copy of GameClient's 'this' pointer for use in main loop */
	var ngRoom;							/* Game room object */
  var snkEnv;   					/* Game page environment */
	var readyCounter = 0;		/* Stage of game readiness */
	var readyStages = 2;		/* Total number of steps to be ready */
	var gameSpeed = 200;		/* Default game speed */
	var bgStateChanged = true;	/* Flag if background needs updated */
	var snake;							/* Snake player object */
	var dot;								/* Dot player object */
	var keyIsPressed = [false, false, false, false];	/* Keypress/swipe data */
	var gameLoopID = null;	/* setInterval ID for the game loop */
	var gameRunning;				/* Game running flag */
	var paused = false;			/* Game pause switch */



	init();

  /**
    * @function init
    * @memberof SnkClient
    *
    * @desc Set all event listeners for the page
  */
  function init()
  {
		// Connect to game room, load assets, and prepare game environment
		ngRoom = new NgRoom(conn, function () {
			snkEnv = new SnkEnvironment();
			snkEnv.init(function () {
				// Register all event listeners for the page
				setPageListeners();
				// // Set the initial snake properties
				snake = new CSnake();
				// // Set the initial dot properties
				dot = new CDot();
				// Send 'PlayerReady' message to server
				ngRoom.dataToServer({
					PlayerReady: {
						pid: ngRoom.getMyID()
					}
				});
			});
		});
  }

	/**
		* @function setPageListeners
		* @memberof SnkClient
		*
		* @desc Set all event listeners for the page
	*/
	function setPageListeners()
	{
		// Register event listener for keypresses, clicks, and touches.
		window.addEventListener('keydown', onKeyDown, true);
		snkEnv.Foreground.canvas.addEventListener('click', onClick, true);
		// Initialize Hammer touch events
		var options = {
	  	preventDefault: true
		};
		snkEnv.mc = new Hammer(canvfg, options);
		snkEnv.mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		// Hammerjs swipe event handler
		snkEnv.mc.on("panend", onPan);
		// Register event listener for window resize and reset.
		window.addEventListener('resize', snkEnv.onResize, true);
		snkEnv.ResetBtn.addEventListener('click', onGameReset, true);
		// Register custom event listeners
		addEventListener('onGameStart', onGameStart, true);
		addEventListener('onState', onState, true);
		addEventListener('onGameOver', onGameOver, true);
	}

  /**
    * @function gameLoop
    * @memberof SnkClient
    *
    * @desc The main game loop
  */
  function gameLoop()
  {
		if (gameRunning) {
			if (snake.updateLoc(keyIsPressed)) {
				if (snake.isColliding(dot)) {
					// Dot collision detected. Increase score and respawn dot.
					snake.grow();
					// Clear dot position until reset
					dot.setDefault();
				}
			}
		}
		// Check if screen is paused
		if (!paused) {
			// Redraw scene if states changed.
			if (bgStateChanged) {
				// Draw the canvas background.
				drawBg(snkEnv.Background);
				bgStateChanged = false;
			}
			// Draw the canvas foreground.
			drawFg(snkEnv.Foreground);
		}
	}

	/**
    * @function drawBg
    * @memberof SnkClient
    *
    * @desc Draw background elements within the canvas area.
  */
  function drawBg(glbgc)
  {
		// Paint background.
		glbgc.font="20px Arial";
		glbgc.fillStyle="#aaaaaa";
		glbgc.fillRect(snkEnv.RCU.x[0], snkEnv.RCU.y[0], snkEnv.RCU.x[100], snkEnv.RCU.y[100]);	/* x,y,w,h */
		// Draw grid lines.
		for (var x = 5; x < 100; x += 5) {
			glbgc.beginPath();
			glbgc.moveTo(snkEnv.RCU.x[x], snkEnv.RCU.y[0]);
			glbgc.lineTo(snkEnv.RCU.x[x], snkEnv.RCU.y[100]);
			glbgc.stroke();
		}
		for (var y = 5; y < 100; y += 5) {
			glbgc.beginPath();
			glbgc.moveTo(snkEnv.RCU.x[0], snkEnv.RCU.y[y]);
			glbgc.lineTo(snkEnv.RCU.x[100], snkEnv.RCU.y[y]);
			glbgc.stroke();
		}
	}

	/**
		* @function drawFg
		* @memberof SnkClient
		*
		* @desc Draw foreground elements within the canvas area.
	*/
	function drawFg(glfgc)
	{
		// TODO
		// Determine if player data has been sent recently
		if (0 === 1) {
			// If not, calculate next snake position

		}
		// Clear previously drawn player.
		// for (var i = 0; i < snkCoords.LastXLoc.length; i++) {
		// 	glfgc.clearRect(snkEnv.RCU.x[snkCoords.LastXLoc[i]], snkEnv.RCU.y[snkCoords.LastYLoc[i]], snkEnv.RCU.x[5], snkEnv.RCU.y[5]);
		// }
		// Clear foreground
		glfgc.clearRect(snkEnv.RCU.x[0], snkEnv.RCU.y[0], snkEnv.RCU.x[100], snkEnv.RCU.y[100]);
		// Clear dot
		//glfgc.clearRect(snkEnv.RCU.x[dotCoords.LastXLoc], snkEnv.RCU.y[dotCoords.LastYLoc], snkEnv.RCU.x[5], snkEnv.RCU.y[5]);
		// Draw new player position.
		glfgc.fillStyle="#000000";
		for (var j = 0; j < snake.XLoc.length; j++) {
			glfgc.fillRect(snkEnv.RCU.x[snake.XLoc[j]], snkEnv.RCU.y[snake.YLoc[j]], snkEnv.RCU.x[5], snkEnv.RCU.y[5]);			/* x,y,w,h */
		}

		// Redraw dot
		//glfgc.fillStyle="#000000";
		//glfgc.fillRect(snkEnv.RCU.x[dot.XLoc], snkEnv.RCU.y[dot.YLoc], snkEnv.RCU.x[5], snkEnv.RCU.y[5]);			/* x,y,w,h */
		glfgc.drawImage(snkEnv.DotSkin, snkEnv.RCU.x[dot.XLoc], snkEnv.RCU.y[dot.YLoc], snkEnv.RCU.x[5], snkEnv.RCU.y[5]);
	}


	// ----- SnkClient JavaScript Events ----- //

	/**
	 * @function onkeyDown
	 * @param {Event} e - Event object for keypress event
	 * @desc Handle keyboard keypress down event.
	*/
	function onKeyDown(e)
	{
		if (ngRoom.getMyID() === snake.ID) {
			if (!gameRunning && dot.DotSet) {
				gameRunning = true;
			}
			if (gameRunning) {
				keyIsPressed = [false, false, false, false];			/* Flags for pressed keys: 38, 40, 37, 39 */
				var validKey = false;
				// ---- Arrow Key --------------
				if (e.keyCode == 38) {
					e.preventDefault();
					// Toggle "move up" keypress state.
					keyIsPressed[0] = true;
					validKey = true;
				}
				if (e.keyCode == 40) {
					e.preventDefault();
					// Toggle "move down" keypress state.
					keyIsPressed[1] = true;
					validKey = true;
				}
				if (e.keyCode == 37) {
					e.preventDefault();
					// Toggle "move left" keypress state.
					keyIsPressed[2] = true;
					validKey = true;
				}
				if (e.keyCode == 39) {
					e.preventDefault();
					// Toggle "move right" keypress state.
					keyIsPressed[3] = true;
					validKey = true;
				}
				if (validKey) {
					// Send input data to server
					ngRoom.dataToServer({
						Input: {
							pid: ngRoom.getMyID(),
							keybd: {
								keys: keyIsPressed
							}
						}
					});	// End dataToServer
				}
			}
		}
	}	// End onKeyDown


	/**
	 * @function onClick
	 * @param {Event} e - Event object for onclick event
	 * @desc Handles client mouse click events
	 */
	function onClick(e)
	{
		if (ngRoom.getMyID() === dot.ID && !dot.DotSet) {
			var canvcoords = snkEnv.getMousePos(e.clientX, e.clientY);
			// Clip click position to the upper-leftmost grid space
			canvcoords.x = Math.floor( canvcoords.x / 5 ) * 5;
			canvcoords.y = Math.floor( canvcoords.y / 5 ) * 5;
			// Update local state
			dot.setValue(canvcoords.x, canvcoords.y);
			// Send input data to server
			ngRoom.dataToServer({
				Input: {
					pid: ngRoom.getMyID(),
					mouse: {
						x: canvcoords.x,
						y: canvcoords.y
					}
				}
			});
		}
	}


	/**
	 * @function onPan
	 */
	function onPan(evt)
	{
		if (ngRoom.getMyID() === snake.ID) {
			if (!gameRunning && dot.DotSet) {
				gameRunning = true;
			}
			if (gameRunning) {
				keyIsPressed = [false, false, false, false];			/* Flags for pressed keys: 38, 40, 37, 39 */
				var validSwipe = false;
				if (evt.direction === 8) {
					// Swipe up
					keyIsPressed[0] = true;
					validSwipe = true;
				} else if (evt.direction === 16) {
					// Swipe down
					keyIsPressed[1] = true;
					validSwipe = true;
				} else if (evt.direction === 2) {
					// Swipe left
					keyIsPressed[2] = true;
					validSwipe = true;
				} else if (evt.direction === 4) {
					// Swipe right
					keyIsPressed[3] = true;
					validSwipe = true;
				}
				if (validSwipe) {
					// Send input data to server
					ngRoom.dataToServer({
						Input: {
							pid: ngRoom.getMyID(),
							touch: {
								pan: {
									direction: keyIsPressed
								}
							}
						}
					});	// End dataToServer
				}
			}
		}
	}	// End onPan

	/**
	 * @function onResize
	 * @memberof SnkClient
	 *
	 * @desc Handler for canvas resize event
	 */
	function onResize()
	{
		// Clear canvases
		paused = true;
		snkEnv.Background.clearRect(snkEnv.RCU.x[0], snkEnv.RCU.y[0], snkEnv.RCU.x[100], snkEnv.RCU.y[100]);
		snkEnv.Foreground.clearRect(snkEnv.RCU.x[0], snkEnv.RCU.y[0], snkEnv.RCU.x[100], snkEnv.RCU.y[100]);
		// Resize canvas and allow for redraw
		snkEnv.resize();
		bgStateChanged = true;
		paused = false;
	}	// End onResize

	/**
		* @function onGameReset
		* @memberof SnkClient
		*
		* @desc Handler for game reset event
	*/
	function onGameReset()
	{
		// Reset the scoreboard
		snkEnv.MyScoreSpan.innerHTML = 0;
		snkEnv.OppScoreSpan.innerHTML = 0;
		// Send 'ResetRequest' message to server
		ngRoom.dataToServer({
			ResetRequest: true
		});
	}	// End onGameReset

	// -- Server Events -- //

	/**
		* @function onReset
		* @memberof SnkClient
		*
		* @desc Handler for 'ResetAck' server event
	*/
	function onReset(e)
	{
		var resetData = e.detail;
		// Reset the scoreboard
		snkEnv.MyScoreSpan.innerHTML = 0;
		snkEnv.OppScoreSpan.innerHTML = 0;
	}	// End onReset

	/**
		* @function onGameStart
		* @memberof SnkClient
		*
		* @desc Handler for 'GameReady' server event
	*/
	function onGameStart(e)
	{
		var readyData = e.detail;
		// Assign players to roles
		snake.ID = readyData.playerone.pid;
		dot.ID = readyData.playertwo.pid;
		// Start game loop
		gameRunning = true;
		gameLoopID = setInterval(gameLoop, 800);
	}	// End onGameStart

	/**
		* @function onState
		* @memberof SnkClient
		*
		* @desc Handler for 'StateUpdate' server event
	*/
	function onState(e)
	{
		var stateData = e.detail;
		// Update snake state
		snake.stateUpdate(stateData.playerone);
		// Update dot state
		dot.stateUpdate(stateData.playertwo);
		// Update the scoreboard and player ids
		if (ngRoom.getMyID() === stateData.playerone.pid) {
			snkEnv.MyScoreSpan = stateData.playerone.score;
			snkEnv.OppScoreSpan = stateData.playertwo.score;
		} else if (ngRoom.getMyID() === stateData.playertwo.pid) {
			snkEnv.MyScoreSpan = stateData.playertwo.score;
			snkEnv.OppScoreSpan = stateData.playerone.score;
		}
	}	// End onState

	/**
		* @function onGameOver
		* @memberof SnkClient
		*
		* @desc Handler for 'GameOver' server event
	*/
	function onGameOver(e)
	{
		// Game is stopped
		gameRunning = false;
	}	// End onGameOver
}	// End GameClient
