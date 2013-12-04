var levels = {
    // Level data
    data:[
	 {   // First level
	    foreground:'desert',
	    background:'red-sun',
	    entities:[
	        {type:"ground", name:"dirt", x:500,y:440,width:1000,height:20,isStatic:true},
	        {type:"ground", name:"wood", x:180,y:390,width:40,height:80,isStatic:true},

	        {type:"block", name:"wood", x:500,y:375,angle:90,width:100,height:25},
	        {type:"block", name:"ice", x:500,y:275,angle:90,width:100,height:25},
	        {type:"villain", name:"soldier",x:500,y:200,milicronians:590},

	        {type:"block", name:"wood", x:600,y:375,angle:90,width:100,height:25},
	        {type:"block", name:"ice", x:600,y:275,angle:90,width:100,height:25},
	        {type:"villain", name:"vader", x:600,y:200,milicronians:420},

	        {type:"hero", name:"c3po",x:90,y:410},
	        {type:"hero", name:"skywalker",x:150,y:410},
	    ]
	 },
	    {   // Second level
	        foreground:'desert',
	        background:'black-moon',
	        entities:[
	            {type:"ground", name:"dirt", x:500,y:440,width:1000,height:20,isStatic:true},
	            {type:"ground", name:"wood", x:180,y:390,width:40,height:80,isStatic:true},
	            {type:"block", name:"wood", x:820,y:375,angle:90,width:100,height:25},
	            {type:"block", name:"wood", x:720,y:375,angle:90,width:100,height:25},
	            {type:"block", name:"wood", x:620,y:375,angle:90,width:100,height:25},
	            {type:"block", name:"ice", x:670,y:310,width:100,height:25},
	            {type:"block", name:"ice", x:770,y:310,width:100,height:25},

	            {type:"block", name:"ice", x:670,y:248,angle:90,width:100,height:25},
	            {type:"block", name:"ice", x:770,y:248,angle:90,width:100,height:25},
	            {type:"block", name:"wood", x:720,y:180,width:100,height:25},
	            {type:"villain", name:"soldier",x:715,y:160,milicronians:590},
	            {type:"villain", name:"vader",x:670,y:400,milicronians:420},
	            {type:"villain", name:"soldier_2",x:765,y:395,milicronians:150},

	            {type:"hero", name:"yoda",x:40,y:420},
	            {type:"hero", name:"c3po",x:90,y:410},
	            {type:"hero", name:"skywalker",x:150,y:410},
	        ]
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
		//Initialize Box2D world whenever a level is loaded
		box2d.init();
		
		// declare a new currentLevel object
		game.currentLevel = {number:number,hero:[]};
		game.score= 0;
		$('#score').html('Score: ' + game.score);
		game.currentHero = undefined;
      	var level = levels.data[number];

      	//load the background, foreground, and slingshot images
      	game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
      	game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
      	game.slingshotImage = loader.loadImage("images/slingshot.png");
      	game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");

		// Load all the entities
		for (var i = level.entities.length - 1; i >= 0; i--){
		    var entity = level.entities[i];
		    entities.create(entity);
		};

      	//Call game.start() once the assets have loaded
      	if(loader.loaded){
          	game.start()
  		} else {
          	loader.onload = game.start;
		}
    }
}