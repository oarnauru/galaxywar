var game = {
    // Start initializing objects, preloading assets and display start screen
    init: function(){
		// Initialize objects
		levels.init();
		loader.init();
		mouse.init();
		
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
	// Maximum panning speed per frame in pixels
	maxSpeed:3,
	// Minimum and Maximum panning offset
	minOffset:0,
	maxOffset:300,
	// Current panning offset
	offsetLeft:0,
	// The game score
	score:0,

	//Pan the screen to center on newCenter
	panTo:function(newCenter){
	    if (Math.abs(newCenter-game.offsetLeft-game.canvas.width/4) > 0
	        && game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset){

	        var deltaX = Math.round((newCenter-game.offsetLeft-game.canvas.width/4)/2);
	        if (deltaX && Math.abs(deltaX) > game.maxSpeed){
	            deltaX = game.maxSpeed*Math.abs(deltaX)/(deltaX);
	        }
	        game.offsetLeft += deltaX;
	    } else {
	        return true;
	    }
	    if (game.offsetLeft < game.minOffset){
	        game.offsetLeft = game.minOffset;
	        return true;
	    } else if (game.offsetLeft > game.maxOffset){
	        game.offsetLeft = game.maxOffset;
	        return true;
	    }
	    return false;
	},
	countHeroesAndVillains:function(){
	    game.heroes = [];
	    game.villains = [];
	    for (var body = box2d.world.GetBodyList(); body; body = body.GetNext()) {
	        var entity = body.GetUserData();
	        if(entity){
	            if(entity.type == "hero"){
	                game.heroes.push(body);
	            } else if (entity.type =="villain"){
	                game.villains.push(body);
	            }
	        }
	    }
	},
	handlePanning:function(){
	    if(game.mode=="intro"){
	        if(game.panTo(700)){
	            game.mode = "load-next-hero";
	        }
	    }
		if (game.mode=="wait-for-firing"){
		    if (mouse.dragging){
		        if (game.mouseOnCurrentHero()){
		            game.mode = "firing";
		        } else {
		            game.panTo(mouse.x + game.offsetLeft)
		        }
		    } else {
		        game.panTo(game.slingshotX);
		    }
		}
		if (game.mode == "firing"){
			    if(mouse.down){
			        game.panTo(game.slingshotX);
					game.currentHero.SetPosition({x:(mouse.x+game.offsetLeft)/box2d.scale,y:mouse.y/box2d.scale});
			    } else {
			        game.mode = "fired";
			        var impulseScaleFactor = 0.75;
			        var impulse = new b2Vec2((game.slingshotX+35-mouse.x-game.offsetLeft)*impulseScaleFactor,(game.slingshotY+25-mouse.y)*impulseScaleFactor);
			        game.currentHero.ApplyImpulse(impulse,game.currentHero.GetWorldCenter());
			    }
		}
		if (game.mode == "fired"){
		    //pan to wherever the current hero is...
		    var heroX = game.currentHero.GetPosition().x*box2d.scale;
		    game.panTo(heroX);

		    //and wait till he stops moving or is out of bounds
		    if(!game.currentHero.IsAwake() || heroX<0 || heroX >game.currentLevel.foregroundImage.width ){
		        // then delete the old hero
		        box2d.world.DestroyBody(game.currentHero);
		        game.currentHero = undefined;
		        // and load next hero
		        game.mode = "load-next-hero";
		    }
		}
	    if (game.mode=="load-next-hero"){
		
	        game.countHeroesAndVillains();

	        // Check if any villains are alive, if not, end the level (success)
	        if (game.villains.length == 0){
	             game.mode = "level-success";
	            return;
	        }

	        // Check if there are any more heroes left to load, if not end the level (failure)
	        if (game.heroes.length == 0){
	            game.mode = "level-failure"
	            return;
	        }

	        // Load the hero and set mode to wait-for-firing
	        if(!game.currentHero){
				game.currentHero = game.heroes[game.heroes.length-1];
				game.currentHero.SetPosition({x:180/box2d.scale,y:200/box2d.scale});
				game.currentHero.SetLinearVelocity({x:0,y:0});
				game.currentHero.SetAngularVelocity(0);
	            game.currentHero.SetAwake(true);
	        } else {
	            // Wait for hero to stop bouncing and fall asleep and then switch to wait-for-firing
	            game.panTo(game.slingshotX);
	            if(!game.currentHero.IsAwake()){
	                game.mode = "wait-for-firing";
	            }
	        }
	    }
	},
	animate:function(){
	    // Animate the background
	   	game.handlePanning();

	   	// Animate the characters
		var currentTime = new Date().getTime();
		var timeStep;
		if (game.lastUpdateTime){
			timeStep = (currentTime - game.lastUpdateTime)/1000;
			box2d.step(timeStep);
		}

		game.lastUpdateTime = currentTime;
		
		//  Draw the background with parallax scrolling

		game.context.drawImage(game.currentLevel.backgroundImage,game.offsetLeft/4,0,640,480,0,0,640,480);

		game.context.drawImage(game.currentLevel.foregroundImage,game.offsetLeft,0,640,480,0,0,640,480);

	    // Draw the slingshot
		game.context.drawImage(game.slingshotImage,game.slingshotX-game.offsetLeft,game.slingshotY);

		// Draw all the bodies
		game.drawAllBodies();

		// Draw the front of the slingshot
		game.context.drawImage(game.slingshotFrontImage,game.slingshotX-game.offsetLeft,game.slingshotY);

	  	if (!game.ended){
	   		game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
	    }
	},
	drawAllBodies:function(){
	    box2d.world.DrawDebugData();

	    // Iterate through all the bodies and draw them on the game canvas
	    for (var body = box2d.world.GetBodyList(); body; body = body.GetNext()) {
	        var entity = body.GetUserData();

	        if(entity){
	            entities.draw(entity,body.GetPosition(),body.GetAngle())
	        }
	    }
	},
	mouseOnCurrentHero:function(){
		if(!game.currentHero){
			return false;
		}
		var position = game.currentHero.GetPosition();
		var distanceSquared = Math.pow(position.x*box2d.scale - mouse.x-game.offsetLeft,2) + Math.pow(position.y*box2d.scale-mouse.y,2);
		var radiusSquared = Math.pow(game.currentHero.GetUserData().radius,2);
		return (distanceSquared<= radiusSquared);
	}
}

$(window).load(function() {
    game.init();
});
