function init(){

    // CANVAS SELECTORS
    var container = document.querySelector(".container");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // SCORE KEEPING
    var p1Score = 0;
    var p2Score = 0;

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
            btnReset.classList.remove('d-none');
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

    // SPRITE PLACEHOLDER
    var containerArr = [];
    var player = new Image();

    // PLAYER VARIABLES
    // PARAMETERS
    var P1width = 10;
    var P1height = 100;
    var P1color = 'black';

    // START POSITION
    var P1startPositionX = 20;
    var P1startPositionY = canvas.height/2-50;

    // DRAW PLAYER
    function basePlayer(){
        ctx.fillStyle = P1color;
        ctx.fillRect(0, 0, P1width, P1height);
        player = ctx.getImageData(0, 0, P1width, P1height);
        void ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    basePlayer();
    containerArr.push(new Player(P1startPositionX,P1startPositionY));

    // PLAYER OBJECT
    function Player(x,y){
        this.x = x;
        this.y = y;

        this.drawPlayer = function(){
            ctx.putImageData(player, this.x, this.y);
        };

        this.update = function(direction){
            void ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(direction == 'up'){
                this.y -= 40;
            }else if (direction == 'down'){
                this.y += 40;
            }
            this.drawPlayer();
        }
    }

    // PLAYER MOVEMENT CONTROL
    document.addEventListener('keydown', function(event){
        let direction;
        if(event.key == 'ArrowUp'){
            direction = 'up';
            containerArr[0].update(direction);
        }else if(event.key == 'ArrowDown'){
            direction = 'down';
            containerArr[0].update(direction);
        }
    });


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

        let radius = 10;
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

            if(this.x > canvas.width){
                dx = -dx;
            }else if(this.x < 0){
                dx = -dx;
                p1Score += 1;
                radius += 10;
                document.querySelector("#p1Score").innerHTML = p1Score;
            }else if(this.x <= containerArr[0].x+10 && containerArr[0].y <= this.y && containerArr[0].y+100 >= this.y){
                console.log("REBOUND");
                dx = -dx;
            }

            this.x += dx;

            if(this.y > canvas.height){
                dy = -dy;
            }else if(this.y < 0){
                dy = -dy;
            };
            this.y += dy;

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
