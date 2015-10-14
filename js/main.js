
console.log("linked!")

//********** VARIABLES **********//

var $canvas = $("#canvas");
var $ctx = $canvas[0].getContext("2d");

var ballRadius = 10;
var paddleHeight = 12;
var paddleWidth = 75;
var paddleX = ($canvas[0].width-paddleWidth)/2;

var x, y, paddleOneY, paddleTwoY;
var dx = 2;
var dy = -2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 4;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

var score = 0;
var lives = 3;
var playerOneLives, playerTwoLives;
var frameRate = 6;

//********** GLOBAL LISTENERS **********//


// $ctx.font = "36px Arial";
// $ctx.fillStyle = "#1abc9c";
// $ctx.fillText = "Select a mode!";

$(document).keydown(function(key) {
	if (key.which === 39) {
		rightPressed = true;
	}
	else if (key.which === 37) {
		leftPressed = true;
	}
});

$(document).keyup(function(key) {
	if (key.which === 39) {
		rightPressed = false;
	}
	else if (key.which === 37) {
		leftPressed = false;
	}
});

$('#onePlayerMode').click(onePlayerMode);
$('#twoPlayerMode').click(twoPlayerMode);

//***********************************************************************//
//*************************** ONE PLAYER MODE ***************************//
//***********************************************************************//

function onePlayerMode() {

	var x = $canvas[0].width/2;
	var y = $canvas[0].height-30;

	//********** Loop through bricks **********//

	for (i=0; i < brickColumnCount; i++) {
		bricks[i] = [];
		for (j=0; j < brickRowCount; j++) {
			bricks[i][j] = {
				x: 0,
				y: 0,
				status: 1
			};
		}
	}

	function collisionDetection() {
			// Check for brick index and position. If the ball hits 
			// a brick, change its direction, add a point to the score
			// and set the brick's status to 0.
		for (i=0; i < brickColumnCount; i++) {
			for (j=0; j < brickRowCount; j++) {
				var b = bricks[i][j];
				if (b. status === 1) {
					if (x > b.x && x < b.x + brickWidth
						&& y > b.y && y < b.y + brickHeight) {
							dy = -dy;
							b.status = 0;
							score++;
							if (score === brickRowCount*brickColumnCount) {
								alert("You win!");
								document.location.reload();
							}
					}
				}
			}
		}
	}
	
//***** CANVAS FUNCTIONS *****//
	function drawScore() {
		$ctx.font = "16px Arial";
		$ctx.fillStyle = "#1abc9c";
		$ctx.fillText("Score: " + score, 8, 20);
	}

	function drawLives() {
		$ctx.font = "16px Arial";
		$ctx.fillStyle = "#1abc9c";
		$ctx.fillText("Lives: " + lives, $canvas[0].width - 65, 20);
	}
	
	function drawBall() {
		$ctx.beginPath();
		$ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		$ctx.fillStyle = '#1abc9c';
		$ctx.fill();
		$ctx.closePath();
	}
	function drawPaddle() {
		$ctx.beginPath();
		$ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		$ctx.fillStyle = "#1abc9c";
		$ctx.fill();
		$ctx.closePath();
	}
	function drawBricks() {
	    for(i=0; i < brickColumnCount; i++) {
	        for(j=0; j < brickRowCount; j++) {
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
	}
	
	function draw() {
		$ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
		drawBricks();
		drawBall();
		drawPaddle();
		drawScore();
		drawLives();
		collisionDetection();
	
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
	
		// If the ball hits the bottom, lose a life.  Else if the ball 
		// hits the paddle, reverse the direction of travel on the y-axis.
		if ((x > paddleX && x < paddleX + paddleWidth)
		&& (y === $canvas[0].height - ballRadius - paddleHeight)) {
			dy = -dy;
		}
	
		else if (y + dy > $canvas[0].height - ballRadius) {
			lives --;
	
			if (lives < 1) {
				alert("You lose!");
				document.location.reload();
			}
			else {
				x = $canvas[0].width/2;
				y = $canvas[0].height - 30;
				dx = 2;
				dy = -2;
				paddleX = ($canvas[0].width - paddleWidth)/2;
			}
		}
		
				// If the right arrow is pressed, paddle moves //
				// right, if left arrow, paddle moves left. If //
				// the paddle hits the wall, it will stop.
	
		if (rightPressed && paddleX < $canvas[0].width-paddleWidth) {
			paddleX += 5;
		}
		else if (leftPressed && paddleX > 0) {
			paddleX -= 5;
		}
	
		x += dx;
		y += dy;
	};
	window.setInterval(draw, frameRate)
}

//***********************************************************************//
//*************************** TWO PLAYER MODE ***************************//
//***********************************************************************//

function twoPlayerMode() {

	var dPressed = false;
	var aPressed = false;

	var x = $canvas[0].width/2;
	var y = $canvas[0].height-30;

	playerOneLives = 3;
	playerTwoLives = 3;

//********** LISTENERS **********//

	$(document).keydown(function(key) {
		if (key.which === 68) {
			dPressed = true;
		}
		else if (key.which === 65) {
			aPressed = true;
		}
	});

	$(document).keyup(function(key) {
		if (key.which === 68) {
			dPressed = false;
		}
		else if (key.which === 65) {
			aPressed = false;
		}
	});

	var x = $canvas[0].width/2;
	var y = $canvas[0].height/2;
	var paddleOneY = ($canvas[0].height-paddleWidth)/2;
	var paddleTwoY = ($canvas[0].height-paddleWidth)/2;


//***** CANVAS FUNCTIONS *****//
	function drawLives() {
		$ctx.font = "16px Arial";
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
				alert('Player Two wins!');
				document.location.reload();
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
				alert('Player One wins!')
				document.location.reload();
			}

		}

//***** PLAYER ONE CONTROLS *****//
		if (leftPressed && paddleOneY > 0) {
			paddleOneY -= 7;
		}
		else if (rightPressed && paddleOneY < $canvas[0].height-paddleWidth) {
			paddleOneY += 7;
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

	window.setInterval(draw, frameRate);
}












