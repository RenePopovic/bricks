function drawIt() {
    var x = 300;
    var y = 350;
    var dx = 3;
    var dy = 5;
    var r = 25;
    var ctx;
    var paddlex;
    var paddleh;
    var paddlew;
    var canvasMinX;
    var canvasMaxX;
    var rightDown = false;
    var leftDown = false;
    var bricks;
    var WIDTH;
    var HEIGHT;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;
    var rowheight;
    var colwidth;
    var row;
    var col;
    var score;
    var lives;
    var sekunde;
    var sekundeI;
    var minuteI;
    var izpisTimer;
    var start = true;



    function initbricks() {
        NROWS = 6;
        NCOLS = 4;
        BRICKWIDTH = (WIDTH / NCOLS) - 4;
        BRICKHEIGHT = 25;
        PADDING = 3.3;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                if (i == 0 || i == 1)
                    bricks[i][j] = 3;
                else if (i == 2 || i == 3)
                    bricks[i][j] = 2;
                else
                    bricks[i][j] = 1;
            }
        }
    }

    function init_mouse() {
        canvasMinX = $("#canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH;
    }

    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            paddlex = evt.pageX - canvasMinX - paddlew / 2;
        }
    }
    $(document).mousemove(onMouseMove);

    function onKeyDown(evt) {
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 85;
    }

    function init() {
        score = 0;
        $("#score").html(score);
        lives = 3;
        $("#lives").html(lives);
        sekunde = 0;
        izpisTimer = "00:00";
        intTimer = setInterval(timer, 1000);
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        return setInterval(draw, 10);
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function zmaga() {
        clear();
        ctx.fillStyle = "black";
        ctx.font = "bold 72px Georgia";
        ctx.fillText("VICTORY!", WIDTH / 2 - 200, HEIGHT / 2);
        ctx.font = "bold 45px Georgia";
        ctx.fillText("Score: " + tocke, WIDTH / 2 - 200, HEIGHT / 2 + 100);
        ctx.fillText("Time: " + izpisTimer, WIDTH / 2 - 200, HEIGHT / 2 + 150);
    }

    function konec() {
        clear();
        ctx.fillStyle = "black";
        ctx.font = "bold 72px Georgia";
        ctx.fillText("YOU DIED", WIDTH / 2 - 200, HEIGHT / 2);
        ctx.font = "bold 45px Georgia";
        ctx.fillText("Score: " + score, WIDTH / 2 - 200, HEIGHT / 2 + 100);
        ctx.fillText("Time: " + izpisTimer, WIDTH / 2 - 200, HEIGHT / 2 + 150);

    }


    function draw() {
        clear();
        ctx.fillStyle = "#000";
        circle(x, y, 10);
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        } else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        } else {
            if (paddlex < 0)
                paddlex = 0;
            else if (paddlex + paddlew > WIDTH)
                paddlex = WIDTH - paddlew;
        }

        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 3) {
                    ctx.fillStyle = "#1a1a1a";
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING, BRICKWIDTH, BRICKHEIGHT);
                } else if (bricks[i][j] == 2) {
                    ctx.fillStyle = "#262626";
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING, BRICKWIDTH, BRICKHEIGHT);
                } else if (bricks[i][j] == 1) {
                    ctx.fillStyle = "#404040";
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING, BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }

        rowheight = BRICKHEIGHT + PADDING + paddleh / 2;
        colwidth = BRICKWIDTH + PADDING + paddleh / 2;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] >= 1) {
            dy = -dy;
            bricks[row][col]--;
            score += 1;
            $("#score").html(score);
        }

        if (x + dx > WIDTH - r || x + dx < r)
            dx = -dx;
        if (y + dy < r)
            dy = -dy;
        else if (y + dy > HEIGHT - (paddleh + (r / 2))) {
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
            } else if (y + dy > HEIGHT - r && lives == 0) {
                start = false;
                clearInterval(intervalId);
            } else if (y + dy > HEIGHT - r) {
                lives -= 1;
                $("#lives").html(lives);
                dy = -dy;
            }
        }
        x += dx;
        y += dy;

        if (score >= 48) {
            clearInterval(intTimer);
            zmaga();
            window.setTimeout(function() { location.reload() }, 3000);
            $(document).off("timer");
            $(document).off("init");
            $(document).off("init_paddle");
            $(document).off("initbricks");
            $(document).off("init_mouse");
            dx = 0;
            dy = 0;
        }


        if (lives == 0) {
            clearInterval(intTimer);
            konec();
            $(document).off("timer");
            $(document).off("init");
            $(document).off("init_paddle");
            $(document).off("initbricks");
            $(document).off("init_mouse");
            dx = 0;
            dy = 0;
            window.setTimeout(function() { location.reload() }, 3000);
        }
    }

    function timer() {
        if (start == true) {
            sekunde++;
            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;
            $("#cas").html(izpisTimer);
        } else {
            sekunde = 0;
            izpisTimer = "00:00";
            $("#cas").html(izpisTimer);
        }
    }

    init();
    init_paddle();
    init_mouse();
    initbricks();
}