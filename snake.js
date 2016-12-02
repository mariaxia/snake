;(function(){

	// Game module will initiate all parts of the game, and then only handle canvas repainting
	var Game = function(canvasId){
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');

		var snake = new Snake();
		var food = new Food();
	
		var self = this;
		var animate = function(){
				snake.update(snake, food); // Snake module handles snake behavior
				self.draw(screen, snake, food); // Game module handles drawing
			setTimeout(function() {			
				requestAnimationFrame(animate);}, 70);
		}
		animate();

		// handling keypress event
		// we must use 'keydown' because 'keypress' does not detect arrow presses in chrome
		// reference: http://unixpapa.com/js/key.html
		window.addEventListener('keydown', handler);
	
		function handler(event){
			var keyCode = event.code;
			// handle keypress AND make sure snake isn't able to go directly backwards
			if (keyCode == 'ArrowLeft' && snake.segments[0].facing != "w")
				snake.direction = 'e';
			if (keyCode == 'ArrowRight' && snake.segments[0].facing != "e")
				snake.direction = 'w';
			if (keyCode == 'ArrowDown' && snake.segments[0].facing != "n")
				snake.direction = 's';
			if (keyCode == 'ArrowUp' && snake.segments[0].facing != "s")
				snake.direction = 'n';
		}
	
	};

	Game.prototype = {
		// draws the game
		draw: function(screen, snake, food){
			// clear for repainting
			screen.clearRect(0,0,600,400);
			
			// draw snake and its segments
			screen.fillStyle = 'IndianRed';
			screen.fillRect(snake.head.x, snake.head.y, 10, 10);
			snake.segments.forEach(function(segment){
				screen.fillRect(segment.x, segment.y, 10, 10);
			});
			
			// drawing food
			screen.fillStyle = 'OliveDrab';
			screen.fillRect(food.center.x, food.center.y, 10, 10);
		}
	
	};

	// Snake module handles all snake behavior:
	// Moving, eating, collision detection, and resetting
	var Snake = function(){
		this.direction = '';
		this.head = {x: 300, y: 200, facing: ''};
		this.segments = [{}];
	};

	Snake.prototype = {
		// handles snake behavior (gets called on every animation frame)
		update: function(snake, food){
	
			// with each animation frame, the snake:
			// first adds its current head to its body...
			this.segments.unshift({x: this.head.x, y:this.head.y, facing: this.direction});
			
			// then pushes out a new head...
			if (this.direction == "e")
				this.head.x -= 10;
			if (this.direction == "w")
				this.head.x += 10;
			if (this.direction == "n")
				this.head.y -= 10;
			if (this.direction == "s")
				this.head.y += 10;
			
			// and then discards from its tail.
			this.segments.pop();
			
			// then checks if it's colliding with something
			this.detectCollision(food);
	
		},
	
		eat: function(){
			// upon eating, snake grows by 3 segments. These segments can be empty because they quickly get swept up by the update function and acquire information.
			this.segments.push({}, {}, {});
		
			// bonus feature for the title of the game
			document.getElementById("repeatA").innerHTML += "a";
		},
	
		reset: function(){
			this.direction = '';
			this.head = {x: 300, y: 200};
			this.segments = [{}];
			
			// bonus feature (continued) for title of game
			document.getElementById("repeatA").innerHTML = "a";
		},
		
		detectCollision: function(food){
			// detect wall collision
			if (this.head.x < 0 || this.head.x > 600 || 
				this.head.y < 0 || this.head.y > 400)
				this.reset();
			// detect food collision
			if (this.head.x == food.center.x && this.head.y == food.center.y){
				this.eat();
				food.placeRandom();
			}
			// detect collision with self
			this.segments.forEach(function(segment){
				if (this.head.x == segment.x && this.head.y == segment.y)
					this.reset();
			}, this);
		}

	};

	// Food module handles food placement
	var Food = function(){
		this.center = {x: 300, y: 300};
	};

	Food.prototype = {
		// randomly place yourself somewhere
		placeRandom: function(){
			this.center.x = Math.floor(Math.random() * 60) * 10;
			this.center.y = Math.floor(Math.random() * 40) * 10;
		}
	};

	// Start the game when everything's loaded!
	window.addEventListener('load', function() {
		new Game("screen");
	});
})();
