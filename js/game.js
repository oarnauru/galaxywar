var game = {
    // Start initializing objects, preloading assets and display start screen
    init: function(){
		// Initialize objects
		levels.init();
		loader.init();
		
        // Hide all game layers and display the start screen
        $('.gamelayer').hide();
        $('#gamestartscreen').show();

        //Get handler for game canvas and context
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
    },

	showLevelScreen:function(){
	    $('.gamelayer').hide();
	    $('#levelselectscreen').show('slow');
	},
	
	// Game mode
	mode:"intro",
	// X & Y Coordinates of the slingshot
	slingshotX:140,
	slingshotY:280,
	start:function(){
	    $('.gamelayer').hide();
	    // Display the game canvas and score
	    $('#gamecanvas').show();
	    $('#scorescreen').show();

	    game.mode = "intro";
	    game.offsetLeft = 0;
	    game.ended = false;
	    game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
	},
	handlePanning:function(){
	    game.offsetLeft++; // Temporary placeholder – keep panning to the right
	},
	animate:function(){
	    // Animate the background
	   	game.handlePanning();

	   	// Animate the characters
		//  Draw the background with parallax scrolling

		game.context.drawImage(game.currentLevel.backgroundImage,game.offsetLeft/4,0,640,480,0,0,640,480);

		game.context.drawImage(game.currentLevel.foregroundImage,game.offsetLeft,0,640,480,0,0,640,480);

	    // Draw the slingshot

	    game.context.drawImage(game.slingshotImage,game.slingshotX,game.slingshotY);
	    game.context.drawImage(game.slingshotFrontImage,game.slingshotX,game.slingshotY);

	  	if (!game.ended){
	   		game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
	    }
	}
}

$(window).load(function() {
    game.init();
});
