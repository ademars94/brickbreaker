console.log("Great job!")

//*****************************************************//
//********************* VARIABLES *********************//
//*****************************************************//

// Canvas and context:
var $canvas = $("#canvas");
var $ctx = $canvas[0].getContext("2d");

// Ball and paddle settings:
var x, y, dx, dy, paddleX, paddleOneY, paddleTwoY;
var ballRadius = 10;
var paddleHeight = 12;
var paddleWidth = 100;
var rightPressed = false;
var leftPressed = false;

// Brickfield settings:
var brickRowCount = 4;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

// Starting game parameters:
var currentLevel = 1;
var totalScore = 0;
var currentRoundScore = 0;
var lives = 3;
var playerOneLives, playerTwoLives;
var frameDuration = 6;
var run;
var gamePaused = false;
var spacePressed = false;

//*****************************************************//
//****************** EVENT LISTENERS ******************//
//*****************************************************//

$(document).keydown(function(key) {
// Detect when the user has pressed an arrow key.
	if (key.which === 39) {
		rightPressed = true;
	}
	else if (key.which === 37) {
		leftPressed = true;
	}
});

$(document).keyup(function(key) {
// Detect when the user has released an arrow key.
	if (key.which === 39) {
		rightPressed = false;
	}
	else if (key.which === 37) {
		leftPressed = false;
	}
});

$(document).keydown(function(key) {
// Detect when the user has pressed the A or D keys.
	if (key.which === 68) {
		dPressed = true;
	}
	else if (key.which === 65) {
		aPressed = true;
	}
});

$(document).keyup(function(key) {
// Detect when the user has released the A or D keys.
	if (key.which === 68) {
		dPressed = false;
	}
	else if (key.which === 65) {
		aPressed = false;
	}
});

$(document).keydown(function(key) {
// The pauseGame function runs when spacebar is pressed.
	if (key.which === 32) {
		onePlayerMode.pauseGame();
	}
}); 

$('#onePlayerMode').click(function() {
// Button starts a one player game when clicked.
	onePlayerMode.draw();
	$('#display').fadeOut(1000, onePlayerMode.init);
});

$('#twoPlayerMode').click(function() {
// Button starts a two player game when clicked.
	setTimeout(twoPlayerMode, 1000);
	$('#display').fadeOut(1000);
});


//*****************************************************//
//****************** ONE PLAYER MODE ******************//
//*****************************************************//

var onePlayerMode = {

	init: function() {
// Initializes the canvas for a new game or level. 
// The canvas will load with the game paused.
		for (var i = 0; i < brickColumnCount; i++) {
			bricks[i] = [];
			for (var j = 0; j < brickRowCount; j++) {
				bricks[i][j] = {
					x: 0,
					y: 0,
					status: 1
				}
			}
		}
		onePlayerMode.endGame();
		dx = 2;
		dy = -2;
		x = $canvas[0].width/2;
		y = $canvas[0].height-30;
		paddleX = ($canvas[0].width-paddleWidth)/2;
		onePlayerMode.runGame();
		onePlayerMode.draw();
	},

	runGame: function() {
// Sets the interval at which to run the draw function.
		run = window.setInterval(onePlayerMode.draw, frameDuration);
	},

	endGame: function() {
// Stops the game in it's current frame.
		window.clearInterval(run);
	},

	pauseGame: function() {
// If the game is running and spacebar is pressed,
// pause the game.  If the game is already paused
// and spacebar is pressed, run the game.
		if (gamePaused === false) {
			window.clearInterval(run);
			gamePaused = true;
			$('#buttons').hide();
			$('#display').fadeIn(100);
			$('#display').css("backgroundColor", "none")
			$('#messageScreen').text("Pause");
		}
		else if (gamePaused) {
			run = window.setInterval(onePlayerMode.draw, frameDuration);
			gamePaused = false;
			$('#buttons').hide();
			$('#display').fadeOut(100);
		}
	},

	levelUp: function() {
// If the user breaks all of the bricks, they will
// advance in level, adding a new row of bricks and 
// increasing the game's speed with each level.
// The display will fade in, showing the next level
// instead of the menu buttons.
		onePlayerMode.endGame();
		$ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
		currentLevel++;
		$('#buttons').hide();
		$('#display').fadeToggle(500);
		$('#messageScreen').text("Level " + currentLevel);
		$('#display').fadeToggle(2000, onePlayerMode.init);
		brickRowCount++;
		lives++;
		frameDuration = frameDuration/1.2;
		currentRoundScore = 0;
	},

	gameOver: function() {
// End the animation, clear the canvas, reset all
// values to their initial state, reinitialize the game.
		onePlayerMode.endGame();
		$ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
		$('#buttons').hide();
		$('#messageScreen').hide();
		$('#display').show();
		$('#messageScreen').text("Game Over");
		$('#messageScreen').fadeIn(500)
		$('#display').fadeToggle(2000, onePlayerMode.init);
		currentLevel = 1;
		frameDuration = 6;
		brickRowCount = 4
		lives = 3;
		currentRoundScore = 0;
		totalScore = 0;
	},

	detectCollision: function() {
	// Check for brick index and position. If the ball hits 
	// a brick: Change ball direction, add a point to the total 
	// score/round score, set the brick's status to 0.
		for (var i = 0; i < bricks.length; i++) {
			for (var j = 0; j < bricks[i].length; j++) {
				var b = bricks[i][j];
				if (b.status === 1) {
					if (x > b.x && x < b.x + brickWidth
						&& y > b.y && y < b.y + brickHeight) {
						dy = -dy;
						b.status = 0;
						currentRoundScore++;
						totalScore += 10;
					// If you break all of the bricks, you advance to the next round.
						if (currentRoundScore === brickRowCount*brickColumnCount) {
							onePlayerMode.levelUp();
						}
					}
				}
			}
		}
	},
	
//***************** CANVAS FUNCTIONS *****************//

// Draw the current round score in the top left of the canvas
	drawScore: function () {
		$ctx.font = "18px Veranda, Geneva, sans-serif";
		$ctx.fillStyle = "#bdc3c7";
		$ctx.fillText("Score: " + totalScore, 8, 22);
	},
// Draw the remaining lives in the top right of the canvas
	drawLives: function () {
		$ctx.font = "18px Veranda, Geneva, sans-serif";
		$ctx.fillStyle = "#bdc3c7";
		$ctx.fillText("Lives: " + lives, $canvas[0].width - 75, 22);
	},
// Draw the current level in the top-middle of the screen
	drawLevel: function() {
		$ctx.font = "18px Veranda, Geneva, sans-serif";
		$ctx.fillStyle = "#bdc3c7";
		$ctx.fillText("Level: " + currentLevel, $canvas[0].width/2 - 28, 22);
	},
// Create the ball
	drawBall: function () {
		$ctx.beginPath();
		$ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		$ctx.fillStyle = '#1abc9c';
		$ctx.fill();
		$ctx.closePath();
	},
// Create the paddle
	drawPaddle: function () {
		$ctx.beginPath();
		$ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		$ctx.fillStyle = "#1abc9c";
		$ctx.fill();
		$ctx.closePath();
	},
// Draw the brick field
	drawBricks: function () {
	    for(var i = 0; i < bricks.length; i++) {
	        for(var j = 0; j < bricks[i].length; j++) {
	        	if (bricks[i][j].status === 1) {
	            	var brickX = (i*(brickWidth + brickPadding)) + brickOffsetLeft;
	            	var brickY = (j*(brickHeight + brickPadding)) + brickOffsetTop;
	            	bricks[i][j].x = brickX;
	            	bricks[i][j].y = brickY;
	            	$ctx.beginPath();
	            	$ctx.rect(brickX, brickY, brickWidth, brickHeight);
	            	$ctx.fillStyle = "#1abc9c";
	            	$ctx.fill();
	            	$ctx.closePath();
	            }
	        }
	    }
	},
// Main game function; runs at a set interval 
// determined by the frameDuration variable
	draw: function () {
		$ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
		onePlayerMode.drawBricks();
		onePlayerMode.drawBall();
		onePlayerMode.drawPaddle();
		onePlayerMode.drawScore();
		onePlayerMode.drawLives();
		onePlayerMode.drawLevel();
		onePlayerMode.detectCollision();
	
	// ********** COLLISION DETECTION ********** //
	
	// If the ball hits the side, reverse the direction of travel
	// on the x-axis.
		if (x + dx > $canvas[0].width-ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}
	// If the ball hits the top, reverse the direction of travel on the 
	// y-axis
		if (y + dy < ballRadius) {
			dy = -dy;
		}
	// If the ball hits the paddle, reverse the direction of travel
	// on the Y-axis. Else if the ball hits the bottom, lose a life.
		if ((x > paddleX && x < paddleX + paddleWidth)
		&& (y === $canvas[0].height - ballRadius)) {
				dy = -dy;
		}
		else if (y + dy > $canvas[0].height - ballRadius) {
			lives --;
	// Reloads the game if you lose all of your lives.
			if (lives < 1) {
				dy = -dy;
				onePlayerMode.gameOver();
			}
	// Returns ball and paddle to the starting point.
			else {
				x = $canvas[0].width/2;
				y = $canvas[0].height - 30;
				dx = 2;
				dy = -2;
				paddleX = ($canvas[0].width - paddleWidth)/2;
			}
		}
	// If the right arrow is pressed, paddle moves right, if 
	// left arrow, paddle moves left. If the paddle hits the 
	// wall, it will stop. 
		if (rightPressed && paddleX < $canvas[0].width-paddleWidth) {
			paddleX += 5;
		}
		else if (leftPressed && paddleX > 0) {
			paddleX -= 5;
		}
	// Pause the game (wip)
		if (gamePaused === false && spacePressed) {
			window.clearInterval(run);
			gamePaused === true;
		}
		else if (gamePaused === true && spacePressed) {
			window.setInterval(onePlayerMode.draw, frameDuration);
			gamePaused === false;
		}
	
		x += dx;
		y += dy;
	}	
	// window.setInterval(draw, frameDuration)
}












//***********************************************************************//
//*************************** TWO PLAYER MODE ***************************//
//***********************************************************************//
var twoPlayerMode = {

	var dPressed = false;
	var aPressed = false;

	var x = $canvas[0].width/2;
	var y = $canvas[0].height-30;

	playerOneLives = 3;
	playerTwoLives = 3;

//********** LISTENERS **********//

	var x = $canvas[0].width/2;
	var y = $canvas[0].height/2;
	var paddleOneY = ($canvas[0].height-paddleWidth)/2;
	var paddleTwoY = ($canvas[0].height-paddleWidth)/2;


//***** CANVAS FUNCTIONS *****//
	function drawLives() {
		$ctx.font = "18px Veranda, Geneva, sans-serif";
		$ctx.fillStyle = "#d35400";
		$ctx.fillText("Lives: " + playerOneLives, $canvas[0].width - 80, 30);
		$ctx.fillText("Lives: " + playerTwoLives, 50, 30);
	}
	function drawHalf() {
		$ctx.beginPath();
		$ctx.rect($canvas[0].width/2, 0, 2, $canvas[0].height);
		$ctx.fillStyle = '#d35400';
		$ctx.fill();
		$ctx.closePath();
	}
	function drawBall() {
		$ctx.beginPath();
		$ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		$ctx.fillStyle = '#d35400';
		$ctx.fill();
		$ctx.closePath();
	}
	function drawPaddleOne() {
		$ctx.beginPath();
		$ctx.rect($canvas[0].width - paddleHeight, paddleOneY, paddleHeight, paddleWidth);
		$ctx.fillStyle = '#d35400';
		$ctx.fill();
		$ctx.closePath();
	}
	function drawPaddleTwo() {
		$ctx.beginPath();
		$ctx.rect(0, paddleTwoY, paddleHeight, paddleWidth);
		$ctx.fillStyle = '#d35400';
		$ctx.fill();
		$ctx.closePath();
	}

	function draw() {
		$ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
		drawHalf();
		drawBall();
		drawPaddleOne();
		drawPaddleTwo();
		drawLives();


//***** COLLISION DETECTION *****//
//*******************************//

//***** WALL COLLISION DETECTION *****//
		if (y + dy > $canvas[0].height - ballRadius || y + dy < ballRadius) {
			dy = -dy;
		}
		if ((x + dx > $canvas[0].width - ballRadius) || (x + dx < ballRadius)) {
			dx = -dx;
		}

//***** PADDLE ONE COLLISION DETECTION *****//
		if (y + dy > paddleOneY 
			&& y + dy < paddleOneY + paddleWidth
			&& x === $canvas[0].width - ballRadius - paddleHeight) {
			console.log('paddleOne hit');
			dx = -dx;
		}
		else if (x === $canvas[0].width - ballRadius) {
			playerOneLives--;
			if (playerOneLives < 1) {
				dx = -dx;
				$('#display').fadeIn(1000);
				$('#messageScreen').text("Player Two wins!");
				setTimeout(reloadPage, 3000);
			}
		}

//***** PADDLE TWO COLLISION DETECTION *****//
		if (y + dy > paddleTwoY 
			&& y + dy < paddleTwoY + paddleWidth
			&& x === 0 + ballRadius + paddleHeight) {
			console.log('paddleTwo hit');
			dx = -dx;
		}
		else if (x === 0 + ballRadius) {
			playerTwoLives--;
			if (playerTwoLives < 1) {
				dx = -dx;
				$('#display').fadeIn(1000);
				$('#messageScreen').text("Player One wins!");
				setTimeout(reloadPage, 3000);
			}
		}

//***** PLAYER ONE CONTROLS *****//
		if (leftPressed && paddleOneY > 0) {
			paddleOneY -= 5;
		}
		else if (rightPressed && paddleOneY < $canvas[0].height-paddleWidth) {
			paddleOneY += 5;
		}

//***** PLAYER TWO CONTROLS *****//
		if (aPressed && paddleTwoY > 0) {
			paddleTwoY -= 5;
		}
		else if (dPressed && paddleTwoY < $canvas[0].height-paddleWidth) {
			paddleTwoY += 5;
		}

//***** ANIMATE BALL *****//
		x += dx;
		y += dy;
	}


	window.setInterval(draw, frameDuration);
}












