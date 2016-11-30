var Game = function(canvasId){
	var canvas = document.getElementById(canvasId);
	var screen = canvas.getContext('2d');
	this.screen = screen;
	
	var screenSize = { x: canvas.width, y: canvas.height };
	this.screenSize = screenSize;

	var snake = new Snake();
	var food = new Food();
	
	var self = this;
	var animate = function(){
			self.update(snake, food);
			self.draw(screen, snake, food);
		setTimeout(function() {			
			requestAnimationFrame(animate);}, 70);
	}
	animate();

	// handling keypress event
	window.addEventListener('keypress', handler);
	
	function handler(event){
		var keyCode = event.code;
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
	// runs the game logic
	update: function(snake, food){
		// call update on each of the entities
		snake.update(snake);
		// check for collision
		snake.detectCollision(food);
	},
	
	// draws the game
	draw: function(screen, snake, food){
			screen.clearRect(0,0,600,400);
			screen.fillStyle = 'IndianRed';
			screen.fillRect(snake.head.x, snake.head.y, 10, 10);
			snake.segments.forEach(function(segment){
				screen.fillRect(segment.x, segment.y, 10, 10);
			});
			screen.fillStyle = 'OliveDrab';
			screen.fillRect(food.center.x, food.center.y, 10, 10);
	}
	
};

var Snake = function(){
	this.direction = '';
	this.head = {x: 300, y: 200, facing: ''};
	this.segments = [{}];
};

Snake.prototype = {

	update: function(snake){
	
		this.segments.unshift({x: this.head.x, y:this.head.y, facing: this.direction});
		
		if (this.direction == "e")
			this.head.x -= 10;
		if (this.direction == "w")
			this.head.x += 10;
		if (this.direction == "n")
			this.head.y -= 10;
		if (this.direction == "s")
			this.head.y += 10;
			
		this.segments.pop();
	
	},
	
	eat: function(){
		this.segments.push({}, {}, {});
		
		// a fun little feature for the title of the game
		document.getElementById("repeatA").innerHTML += "a";
	},
	
	reset: function(){
		this.direction = '';
		this.head = {x: 300, y: 200};
		this.segments = [{}];
	},
		
	detectCollision: function(food){
		if (this.head.x < 0 || this.head.x > 600 || 
			this.head.y < 0 || this.head.y > 400)
			this.reset();
		
		if (this.head.x == food.center.x && this.head.y == food.center.y){
			this.eat();
			food.placeRandom();
		}
		
		this.segments.forEach(function(segment){
			if (this.head.x == segment.x && this.head.y == segment.y)
				this.reset();
		}, this);
	}

};

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

window.addEventListener('load', function() {
    new Game("screen");
});
