// -- Client-side -- //


/**
 * @file Client-side environment for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */



function SnkEnvironment ()
{
	'use strict';

	var mc;						/* HammerJS object */

  var canvbg;       /* Page canvas background DOM object */
  var canvfg;       /* Page canvas foreground DOM object */
  var resetBtn;     /* Game Reset button DOM object */
  var myScoreSpan;  /* Player Score DOM object */
  var oppScoreSpan; /* Opponent Score DOM object */
	var snkDot;				/* Texture for Dot player */

	var wWidth;				/* Window width */
	var wHeight;			/* Window height */
	var existingWidth;/* Last window width- used for preventing vertical resizing */
	var glfg;					/* canvas foreground context object */
	var glbg;					/* canvas background context object */

	var rcu;					/* relative canvas units object */
	var dotSkin;			/* Dot texture (skin) */
	var totalAssets = 1;
	var assetCount = 0;


  /**
    * @function init
    * @memberof SnkEnvironment
    *
    * @desc Initializes the client-side browser environment
  */
  function getPageElements()
  {
    // Get all required DOM objects from page
    canvbg = document.getElementById("canvbg");
		canvfg = document.getElementById("canvfg");
    resetBtn = document.getElementById("resetBtn");
    myScoreSpan = document.getElementById("myscorespan");
    oppScoreSpan = document.getElementById("oppscorespan");
  }

	/**
	 * @function setCanvas
	 * @memberof SnkEnvironment
	 *
	 * @desc Initialize the canvas properties and start a context
	 */
	function setCanvas ()
	{
		wWidth = window.innerWidth;										/* Window width */
		wHeight = window.innerHeight;									/* Window height */
		existingWidth = wWidth;												/* Previous window width */
		// Specify canvas size based on window size.
		canvbg.setAttribute('width', (wWidth - Math.floor(wWidth * 0.1)) );
		canvfg.setAttribute('width', (wWidth - Math.floor(wWidth * 0.1)) );
		canvbg.setAttribute('height', (wHeight - Math.floor(wHeight * 0.2)) );
		canvfg.setAttribute('height', (wHeight - Math.floor(wHeight * 0.2)) );
		// Establish a 2D drawing context.
		try {
			glbg = canvbg.getContext("2d");
			glfg = canvfg.getContext("2d");				/* Drawing context object */
		}
		catch(e){
			console.log("Error establishing drawing context.");
		}
	}

	/**
	 * @function getRCU
	 * @memberof SnkEnvironment
	 * @return {JSON Object} x and y relative canvas units
	 *
	 * @desc Defines units relative to the game canvas (Relative Canvas Units)
	 */
	function getRCU ()
	{
		var rcux = [];	/* Grid values along the x-axis */
		var rcuy = [];	/* Grid values along the y-axis */
		// Empty any grid values
	  while (rcux.length > 0)
	    rcux.pop();
	  while (rcuy.length > 0)
	    rcuy.pop();
		// Fill x and y grid values
	  for (var i = 0; i <= 1.01; i += 0.01) {
	      rcux.push(Math.floor(canvfg.clientWidth * i));
	      rcuy.push(Math.floor(canvfg.clientHeight * i));
	  }
		return { x: rcux, y: rcuy };
	}

	/**
	 * @function loadGameAssets
	 * @memberof SnkEnvironment
	 *
	 * @desc Load all of the game assets
	 */
	function loadGameAssets (assetsLoadedCB)
	{

	  dotSkin = new Image();	/* Image texture for dot player */
	  // Load the dot texture (skin)
	  dotSkin.src = 'images/snkDot.png';
		dotSkin.onload = function () {
			if (++assetCount === totalAssets) {
				assetsLoadedCB();
			}
		};
	}

	/**
		* @function resize
		* @memberof SnkEnvironment
		*
		* @desc Handler for horizontal resize event
	*/
	this.resize = function ()
	{
		if (existingWidth !== window.innerWidth) {
			// Initialize canvas properties
			setCanvas();
			// Generate relative units for the canvas
			rcu = getRCU();
		}
	};


  /**
   * @property Foreground
   * @memberof SnkEnvironment
   * @return {Object} - Foreground 2D Context
	 *
   * @desc Getter for current foreground's 2D Context
   * @public
   */
  Object.defineProperty(this, 'Foreground', {
    get: function() { return glfg; },
    enumerable: true,
    configurable: true
  });

	/**
	 * @property Background
	 * @memberof SnkEnvironment
	 * @return {Object} - Background 2D Context
	 *
	 * @desc Getter for current background's 2D Context
	 * @public
	 */
	Object.defineProperty(this, 'Background', {
		get: function() { return glbg; },
		enumerable: true,
		configurable: true
	});

	/**
	 * @property MyScoreSpan
	 * @memberof SnkEnvironment
	 * @return {Object} - DOM object
	 *
	 * @desc Getter/Setter for opponent's score span DOM object
	 * @public
	 */
	Object.defineProperty(this, 'MyScoreSpan', {
		get: function() { return myScoreSpan; },
		set: function(score) { myScoreSpan.innerHTML = score; },
		enumerable: true,
		configurable: true
	});

	/**
	 * @property OppScoreSpan
	 * @memberof SnkEnvironment
	 * @return {Object} - DOM object
	 *
	 * @desc Getter/Setter for player's score span DOM object
	 * @public
	 */
	Object.defineProperty(this, 'OppScoreSpan', {
		get: function() { return oppScoreSpan; },
		set: function(score) { oppScoreSpan.innerHTML = score; },
		enumerable: true,
		configurable: true
	});

	/**
	 * @property ResetBtn
	 * @memberof SnkEnvironment
	 * @return {Object} - DOM object
	 *
	 * @desc Getter/Setter for player's score span DOM object
	 * @public
	 */
	Object.defineProperty(this, 'ResetBtn', {
		get: function() { return resetBtn; },
		enumerable: true,
		configurable: true
	});

	/**
   * @property RCU
   * @memberof SnkEnvironment
   * @return {Object} - Relative canvas units
	 *
   * @desc Getter for canvas units
   * @public
   */
  Object.defineProperty(this, 'RCU', {
    get: function() { return rcu; },
    enumerable: true,
    configurable: true
  });

	/**
   * @property DotSkin
   * @memberof SnkEnvironment
   * @return {Object} - Dot texture (skin)
	 *
   * @desc Getter for dot texture
   * @public
   */
  Object.defineProperty(this, 'DotSkin', {
    get: function() { return dotSkin; },
    enumerable: true,
    configurable: true
  });


  /**
    * @function init
    * @memberof SnkEnvironment
    *
    * @desc Initializes the client-side browser environment
  */
  SnkEnvironment.prototype.init = function (envLoadedCB)
  {
    // Get the DOM objects for the page
    getPageElements();
		// Initialize canvas properties
		setCanvas();
		// Set the initial Scoreboard
		myScoreSpan.innerHTML = 0;
		oppScoreSpan.innerHTML = 0;
		// Generate relative units for the canvas
		rcu = getRCU();
		// Load the required game assets
		loadGameAssets(function () {
			// Automatically scroll page after 1 second
			$('html,body').delay(1000).animate({
				scrollTop: $(document).height()
			}, 1000);
			envLoadedCB();
		});
  };

	// The following function inspired by:
	// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	/**
	 * @function getMousePos
	 * @memberof SnkEnvironment
	 * @param {Object} evt - Event object
	 *
	 * @desc Return the position of the mouse relative to the canvas
	 * @public
	 */
	SnkEnvironment.prototype.getMousePos = function (clientX, clientY)
	{

		var rect = canvfg.getBoundingClientRect();
		return {
			x: ( (clientX - rect.left) / canvfg.clientWidth ) * 100,
			y: ( (clientY - rect.top) / canvfg.clientHeight ) * 100
		};

	};

}
