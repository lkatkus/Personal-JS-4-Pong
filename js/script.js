function init(){

    // CANVAS SELECTORS
    var container = document.querySelector(".container");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // SETTING STARTING CANVAS SIZE
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // SCORE KEEPING
    var p1Score = document.querySelector("#p1Score");
    var p2Score = document.querySelector("#p2Score");
    var p1Result = 0;
    var p2Result = 0;

    // START AND RESET BUTTON SELECTORS
    var btnStart = document.querySelector('#btn-start');
    var title = document.querySelector('#title');
    btnStart.addEventListener('click',function(){
        startGame('start');
    });

    var btnReset = document.querySelector('#btn-reset');
    btnReset.addEventListener('click',function(){
        startGame('reset');
    });

    // ANIMATION REQUEST
    var myAnimationRequest;

    // MAIN FUNCTION FOR STARTING GAME
    function startGame(state){
        if(state == 'start'){
            btnStart.classList.add('d-none');
            title.classList.add('d-none');
            canvas.classList.add('d-cursor-none');
            p1Score.classList.remove('d-none');
            p2Score.classList.remove('d-none');
            // btnReset.classList.remove('d-none');
            animate();
        }else{
            btnReset.classList.add('d-none');
            btnStart.classList.remove('d-none');
            cancelAnimationFrame(myAnimationRequest);
        }
    };

    // CANVAS ON RESIZE EVENT
    window.addEventListener('resize',function(){
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });

    // ADDING MOUSE CONTROLS
    var mouseNewY; /*MOUSE POSITION TRACKER */
    canvas.addEventListener('mousemove',function(event){
        mouseNewY = event.y - this.offsetTop;
    });

    // FOR COMPUTER PLAYER
    var ballNewY;
    var ballDirection = 'right'; /*DEFAULT VALUE */

    // SPRITE PLACEHOLDER
    var containerArr = [];
    var player = new Image();
    var computer = new Image();

    // PLAYER VARIABLES
    // PARAMETERS
    var p1Width = 20;
    var p1Height = 100;
    var playerColor = 'white';

    // START POSITION
    var p1StartPositionX = 20;
    var p1StartPositionY = canvas.height/2-p1Height/2;

    var computerStartPositionX = canvas.width - 20 - p1Width;
    var computerStartPositionY = canvas.height/2-p1Height/2;

    // DRAW PLAYER
    function basePlayer(){
        ctx.fillStyle = playerColor;
        ctx.fillRect(0, 0, p1Width, p1Height);
        player = ctx.getImageData(0, 0, p1Width, p1Height);
        void ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    basePlayer();

    // CREATE PLAYER
    containerArr.push(new Player(p1StartPositionX,p1StartPositionY));
    containerArr.push(new Computer(computerStartPositionX,computerStartPositionY));

    // PLAYER OBJECT
    function Player(x, y){

        this.x = x;
        this.y = y;

        this.drawPlayer = function(){
            ctx.putImageData(player, this.x, this.y);
        };

        // // FOR MOUSE CONTROLS
        this.update = function(){
            void ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(mouseNewY - p1Height/2 < 0){
                this.y = 0;
            }else if(mouseNewY > canvas.height - p1Height/2){
                this.y = canvas.height - p1Height;
            }else{
                this.y = mouseNewY - p1Height/2;
            }
            this.drawPlayer();
        }
    }

    // COMPUTER OBJECT
    function Computer(x, y){

        this.x = x;
        this.y = y;
        let computerSpeed = 10;

        this.drawComputer = function(){
            ctx.putImageData(player, this.x, this.y);

            // DRAWING FIELD MIDDLE LINE
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.setLineDash([20,10]);
            ctx.lineWidth = 5;
            ctx.moveTo(canvas.width/2, 20);
            ctx.lineTo(canvas.width/2, canvas.height-20);
            ctx.stroke();
        };

        this.update = function(){
            if(ballNewY < this.y && ballDirection == 'right' && this.y > 0){
                this.y -= computerSpeed;
            }else if(ballNewY > this.y && ballDirection == 'right' && this.y < canvas.height-p1Height){
                this.y += computerSpeed;
            }else if(ballDirection == 'left' && ballNewY > this.y && this.y < canvas.height-p1Height){
                this.y += 1;
            }else if(ballDirection == 'left' && ballNewY < this.y && this.y > 0){
                this.y -= 1;
            }
            this.drawComputer();
        }
    }

    // BALL PARAMETERS
    // PARAMETERS
    var ballSize = 10;
    var ballColor = 'white';

    // START POSITION
    var ballPositionX = canvas.width/2;
    var ballPositionY = canvas.height/2;

    // CREATE BALL
    containerArr.push(new Ball(ballPositionX, ballPositionY, ballSize, ballColor));

    function Ball(x, y, color){

        radius = ballSize;
        this.x = x;
        this.y = y;
        let dx = 11;
        let dy = 11;

        this.drawBall = function(){
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(this.x, this.y, radius, 0, Math.PI*2, true);
            ctx.fill();
        }

        this.update = function(){

            // RIGHT SIDE COLISION DETECTION AND SCORING
            if(this.x + radius >= canvas.width){
                dx = -dx;
                p2Result += 1;
                ballDirection = 'left';
                p2Score.innerHTML = p2Result;

            // LEFT SIDE COLLISION DETECTION AND SCORING
            }else if(this.x < 0){
                dx = -dx;
                p1Result += 1;
                ballDirection = 'right';
                p1Score.innerHTML = p1Result;

                // ADD GAME RESET ON SCORE !

            // REBOUND LEFT
            }else if(this.x - radius <= containerArr[0].x + p1Width && containerArr[0].y <= this.y + radius && containerArr[0].y + p1Height >= this.y - radius && ballDirection == 'left'){
                dx = -dx;
                ballDirection = 'right';

            // REBOUND RIGHT
            }else if(this.x + radius >= containerArr[1].x  && containerArr[1].y <= this.y + radius && containerArr[1].y + p1Height >= this.y - radius && ballDirection == 'right'){
                dx = -dx;
                ballDirection = 'left';
            }

            // VERTICAL BALL MOVEMENT
            if(this.y + radius > canvas.height){
                dy = -dy;
            }else if(this.y - radius < 0){
                dy = -dy;
            };

            // COLOR SCORING INDICATOR
            if(ballDirection == 'right' && this.x < 40){
                color = 'coral';
            }else if(ballDirection == 'right' && this.x > 40){
                color = 'white';
            }else if(ballDirection == 'left' && this.x > canvas.width - 40){
                color = 'coral';
            }else if(ballDirection == 'left' && this.x > 40){
                color = 'white';
            }

            // UPDATING BALL POSITION
            this.x += dx;
            this.y += dy;

            // BALLPOSITION PLACEHOLDER FOR COMPUTER
            ballNewY = this.y;

            this.drawBall();
        }
    }

    function animate(){
        myAnimationRequest = requestAnimationFrame(animate);

        // LOOP FOR UPDATING POSITION
        for(var i = 0; i < containerArr.length; i++){
            containerArr[i].update();
        };
    };

}
