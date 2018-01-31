function init(){

    // CANVAS SELECTORS
    var container = document.querySelector(".container");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // SCORE KEEPING
    var p1Score = document.querySelector("#p1Score");
    var p2Score = document.querySelector("#p2Score");
    var p1Result = 0;
    var p2Result = 0;

    // BUTTONS
    var btnStart = document.querySelector('#btn-start');
    btnStart.addEventListener('click',function(){
        startGame('start');
    });

    var btnReset = document.querySelector('#btn-reset');
    btnReset.addEventListener('click',function(){
        startGame('reset');
    });

    // ANIMATION REQUEST
    var myAnimationRequest;

    function startGame(state){
        if(state == 'start'){
            btnStart.classList.add('d-none');
            canvas.classList.add('d-cursor-none');
            // btnReset.classList.remove('d-none');
            p1Score.classList.remove('d-none');
            p2Score.classList.remove('d-none');
            animate();
        }else{
            btnReset.classList.add('d-none');
            btnStart.classList.remove('d-none');
            cancelAnimationFrame(myAnimationRequest);
        }
    };

    // SETTING STARTING CANVAS SIZE
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // CANVAS ON RESIZE
    window.addEventListener('resize',function(){
        console.log('resize');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });

    // ADDING MOUSE CONTROLS
    var mouseNewY; /*MOUSE POSITION TRACKER */
    canvas.addEventListener('mousemove',function(event){
        mouseNewY = event.y - this.offsetTop;
    });

    var ballNewY;
    var ballDirection = 'right';

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

    function Computer(x, y){

        this.x = x;
        this.y = y;
        let computerSpeed = 9;

        this.drawComputer = function(){
            ctx.putImageData(player, this.x, this.y);

            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.setLineDash([20,10]);
            ctx.lineWidth = 5;
            ctx.moveTo(canvas.width/2, 10);
            ctx.lineTo(canvas.width/2, canvas.height-10);
            ctx.stroke();
        };

        this.update = function(){
            if(ballNewY < this.y  && ballDirection == 'right'){
                this.y -= computerSpeed;
            }else if(ballNewY > this.y && ballDirection == 'right'){
                this.y += computerSpeed;
            }
            this.drawComputer();
        }
    }

    // BALL PARAMETERS
    // PARAMETERS
    var ballSize = 10;
    var ballColor = 'black';

    // START POSITION
    var ballPositionX = canvas.width/2;
    var ballPositionY = canvas.height/2;

    // CREATE BALL
    containerArr.push(new Ball(ballPositionX, ballPositionY, ballSize, ballColor));

    function Ball(x, y, color){

        radius = ballSize;
        this.x = x;
        this.y = y;
        let dx = 10;
        let dy = 10;

        this.drawBall = function(){
            ctx.beginPath();
            // ctx.strokeStyle = "blue";
            ctx.arc(this.x, this.y, radius, 0, Math.PI*2, true);
            ctx.fillStyle = color;
            ctx.fill();
        }

        this.update = function(){
            if(this.x + radius >= canvas.width){
                dx = -dx;
                p2Result += 1;
                ballDirection = 'left';
                p2Score.innerHTML = p2Result;
            }else if(this.x < 0){
                // CHANGE BALL DIRECTION
                dx = -dx;

                // ADD PLAYER SCORE
                p1Result += 1;
                ballDirection = 'right';
                p1Score.innerHTML = p1Result;

                // ADD GAME RESET ON SCORE
            }else if(this.x - radius <= containerArr[0].x + p1Width && containerArr[0].y <= this.y + radius && containerArr[0].y + p1Height >= this.y - radius){
                dx = -dx;
                ballDirection = 'right';
            }else if(this.x - radius >= containerArr[1].x  && containerArr[1].y <= this.y + radius && containerArr[1].y + p1Height >= this.y - radius){
                dx = -dx;
                ballDirection = 'left';
            }

            this.x += dx;

            if(this.y > canvas.height){
                dy = -dy;
            }else if(this.y < 0){
                dy = -dy;
            };
            this.y += dy;
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
