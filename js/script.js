function init(){

    var container = document.querySelector(".container");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");


    var player = new Image();

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    var containerArr = [];

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
            console.log("UPDATE");
            void ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(direction == 'up'){
                this.y -= 10;
                this.drawRec();
            }else if (direction == 'down'){
                this.y += 10;
                this.drawRec();
            }
        }
    }

    // document.addEventListener('click',function(){
    //     console.log("CLICK");
    //     ctx.putImageData(player, 50, 50);
    // });

    document.addEventListener('keypress',function(event){
        console.log("KEYPRESS");
        let direction;
        if(event.keyCode == 56){
            direction = 'up';
            containerArr[0].update(direction);
        }else if(event.keyCode == 53){
            direction = 'down';
            containerArr[0].update(direction);
        }
    });

}
