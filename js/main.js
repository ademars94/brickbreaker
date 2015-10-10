console.log("linked!")

			// ******************** VARIABLES ******************** //

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

			// ******************** FUNCTIONS ******************** //

function keyDownHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = true;
	}
	else if (e.keyCode === 37) {
		leftPressed = true;
	}
};

function keyUpHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = false;
	}
	else if (e.keyCode === 37) {
		leftPressed = false;3
	}
};

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = '#FFFFFF';
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();

			// Collision detection //

	if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		dy = -dy;
	}
	else if (y + dy > canvas.height-ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			if (y = y-paddleHeight) {
				dy = -dy;
			}
		}
		else {
			alert("You lose!");
			document.location.reload();
		}
	}
			// If the right arrow is pressed, paddle moves //
			// right, if left arrow, paddle moves left. If //
			// the paddle hits the wall, it will stop.

	if (rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 5
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= 5
	}

	x += dx;
	y += dy;
};

setInterval(draw, 10);


