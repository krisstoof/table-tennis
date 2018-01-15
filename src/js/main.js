var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 5;


var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 5;

var startingScreen = true;
var showingWinScreen = false;

window.onload = () => {
    console.log("hello world");
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;
    setInterval(() => {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);
    document.getElementById("play1").addEventListener("click", playAgain);
    document.getElementById("play2").addEventListener("click", playAgain);
    document.getElementById("play3").addEventListener("click", playAgain);
    canvas.addEventListener('mousemove', evt => {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    });
}

function playAgain() {
    if(startingScreen) {
        startingScreen = false;
        document.getElementById("start").style.display = "none";  
    } else if (showingWinScreen) {
        if (player2Score >= WINNING_SCORE) {
            document.getElementById("win").style.display = "none";
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
        if (player1Score >= WINNING_SCORE) {
            document.getElementById("lost").style.display = "none";
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    }
}

function moveEverything() {
    if(startingScreen) {
        document.getElementById("start").style.display = "block";
    } else if(showingWinScreen) {
        if (player2Score >= WINNING_SCORE) {
            document.getElementById("win").style.display = "block";
        }
        if (player1Score >= WINNING_SCORE) {
            document.getElementById("lost").style.display = "block";
        }
    } else {
        computerMovement();
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY > canvas.height) {

            ballSpeedY = -ballSpeedY;
        } else if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX > canvas.width - 15) {
            if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;

            } else {
                player2Score++;
                ballReset();
            }
        } else if (ballX < 15) {
            if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++;
                ballReset();
            }
        }
    }

}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 7;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 7;
    }
}

function drawNet() {
    for(var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width/2-1 , i, 2, 20, 'white');
    }
}

function drawEverything() {
    // the game field black color
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    // net
    drawNet();
    // left player paddle
    colorRect(3, paddle1Y, PADDLE_THICKNESS, 100, 'white');
    // right computer paddle
    colorRect(canvas.width - PADDLE_THICKNESS - 3, paddle2Y, PADDLE_THICKNESS, 100, 'white');
    // the ball
    colorBall(ballX, ballY, 10, 'white');
    
    
    document.getElementById("player1").innerHTML = player2Score;
    document.getElementById("player2").innerHTML = player1Score;
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function colorBall(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}
