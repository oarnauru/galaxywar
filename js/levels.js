var levels = {
    // Level data
    data:[
        {   // First level
            foreground:'desert',
            background:'red-sun',
            entities:[]
        },
        {   // Second level
            foreground:'desert',
            background:'black-moon',
            entities:[]
        }
    ],
    // Initialize level selection screen
    init:function(){
        var html = "";
        for (var i = 0; i < levels.data.length; i++) {
            var level = levels.data[i];
            html += '<input type = "button" value = "' + (i + 1) + '">';
        };
        $('#levelselectscreen').html(html);
        // Set the button click event handlers to load level
        $('#levelselectscreen input').click(function(){
            levels.load(this.value-1);
            $('#levelselectscreen').hide();
        });
    },

    // Load all data and images for a specific level
    load:function(number){
		// declare a new currentLevel object
		// declare a new currentLevel object
		game.currentLevel = {number:number,hero:[]};
		game.score= 0;
		$('#score').html('Score: ' + game.score);
      	var level = levels.data[number];

      	//load the background, foreground, and slingshot images
      	game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
      	game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
      	game.slingshotImage = loader.loadImage("images/slingshot.png");
      	game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");

      	//Call game.start() once the assets have loaded
      	if(loader.loaded){
          	game.start()
  		} else {
          	loader.onload = game.start;
		}
    }
}