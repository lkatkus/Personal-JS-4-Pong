function init(){

    // SELECTORS
    var container = document.querySelector(".container");
    var p1Score = 0;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // SETTING CANVAS SIZE
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // SPRITES PLACEHOLDER
    var containerArr = [];


    var player = new Image();

    // DRAW RECTANGLE
    function drawRectangle(){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 10, 100);
        player = ctx.getImageData(0, 0, 10, 100);
        void ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawRectangle();

    containerArr.push(new Rec(50,(canvas.height/2-50)));

    function Rec(x,y){
        this.x = x;
        this.y = y;

        this.drawRec = function(){
            ctx.putImageData(player, this.x, this.y);
        };

        this.update = function(direction){
            void ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(direction == 'up'){
                this.y -= 40;
            }else if (direction == 'down'){
                this.y += 40;
            }
            this.drawRec();
        }
    }

    // PLAYER MOVEMENT CONTROL
    document.addEventListener('keypress',function(event){
        let direction;
        if(event.keyCode == 56){
            direction = 'up';
            containerArr[0].update(direction);
        }else if(event.keyCode == 53){
            direction = 'down';
            containerArr[0].update(direction);
        }
    });

    // CREATE BALL
    containerArr.push(new Ball(canvas.width/2,canvas.height/2,10));

    function Ball(x,y){

        this.x = x;
        this.y = y;
        let dx = 10;
        let dy = 10;

        this.drawBall = function(){
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
            ctx.fillStyle = "blue";
            ctx.fill();
        }

        this.update = function(){

            if(this.x > canvas.width){
                dx = -dx;
            }else if(this.x < 0){
                dx = -dx;
                p1Score += 1;
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
        var myAnimationRequest = requestAnimationFrame(animate);

        function stopAnim(){
            console.log("stop animation");
            // cancelAnimationFrame(myAnimationRequest);
        }

        canvas.addEventListener('click',stopAnim);

        // LOOP FOR UPDATING CIRCLE POSITION
        for(var i = 0; i < containerArr.length; i++){
            // containerArr[0].update();
            containerArr[i].update();
        };
    }


    animate();

}
