
/* Game namespace */
var game = {

  // an object where to store game information
  parser : null,

  data : {
    // score
    score: 0,
  },


  // Run on page load.

  "onload" : function () {
    /* 
      0 => running
      1 => paused
      2 => finished
    */
    me.execution = {
      state : 2,
      pause : function() { this.state = 1; },
      run : function() { this.state = 0; },
      finish : function() { this.state = 2; },
      isPaused : function() { return this.state == 1; },
      hasFinished : function() { return this.state == 2; },
    };

    // Initialize the video.
    var canvasWrapperElement = $("#simulator-canvas-wrapper");
    var videoWidth = canvasWrapperElement.width();
    var videoHeight = canvasWrapperElement.height();
    var videoInitOptions = {
      wrapper : "simulator-canvas-wrapper",
      // scale : "auto",
      // scaleMethod : "fit",
      antiAlias: true
    };
    if (!me.video.init(videoWidth, videoHeight, videoInitOptions)) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    if (me.game.HASH["debug"]) {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // add our player entity in the entity pool
    me.pool.register("mainPlayer", game.PlayerEntity);

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};