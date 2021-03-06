var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1score = 0;
var player2score = 0;
var showingWinScreen = false;

//height for paddle
var paddle1Y = 250;
var paddle2Y = 250;

const WINNING_SCORE = 3 ;
const PADDLE_HEIGHT = 100;
const PADDLE_THINKNESS = 10;


/* main function */
window.onload = function(params){

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function(){
        moveEverythink();
        drawEverything();
    },1000/framesPerSecond);

    canvas.addEventListener('mousemove',
    function(evt){
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });
}

/* reset the ball position when goal */
function ballReset()
{
    if(player1score>=WINNING_SCORE || player2score>=WINNING_SCORE)
    {
        player1score=0;
        player2score=0;
        showingWinScreen=true;
    }

    ballSpeedX = -ballSpeedX;

    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement(){
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

    if(paddle2YCenter < ballY-35){
        paddle2Y = paddle2Y+6;
    }
    else if(paddle2YCenter > ballY+35){
        paddle2Y = paddle2Y-6;
    }
}

function moveEverythink(){
    if(showingWinScreen){
        return;
    }

    computerMovement();

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;
    
    if(ballX < 0)
    {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY -(paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }
        else{
            player2score++;
            ballReset();
        }
    }
    
    if(ballX > canvas.width)
    {
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY -(paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }
        else{ 
            player1score ++;
            ballReset();
        }
    }

    if(ballY < 0) ballSpeedY = -ballSpeedY;
    if(ballY > canvas.height) ballSpeedY = -ballSpeedY;
}

function drawEverything(){   
    
    //background black
    colorRect(0,0,canvas.width,canvas.height,'black'); 

    if(showingWinScreen)
    {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("click to continue", 100, 100);
        return;
    }   
    
    //left player
    colorRect(0,paddle1Y,PADDLE_THINKNESS,PADDLE_HEIGHT,'white');

    //right computer player
    colorRect(canvas.width-PADDLE_THINKNESS,paddle2Y,PADDLE_THINKNESS,PADDLE_HEIGHT,'white');
    
    //ball
    colorCircle(ballX,ballY,10,'white');

    canvasContext.fillText(player1score,100,100);
    canvasContext.fillText(player2score,canvas.width-100,100);
}

function colorRect(leftX,topY,width,height,drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}

function colorCircle(centerX,centerY,radius,drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
    canvasContext.fill();
}

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return{
        x:mouseX,
        y:mouseY
    };
}