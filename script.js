let size;
let canvas;
let ctx;
let darkSquareCol;
let lightSquareCol;
let squareSize;
let array;

function init() {
    size = Math.min(window.innerWidth, window.innerHeight) / 1.2;
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    darkSquareCol = "#B38763";
    lightSquareCol = "#EFD8B3";
    squareSize = size / 8;

    array = new Array(8);
    for (var i = 0; i < 8; i++) {
        array[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            array[i][j] = false;
        }
    }

    resizeCanvas();
    canvas.addEventListener("click", clickBoard);
}

function resizeCanvas() {
    size = Math.min(window.innerWidth, window.innerHeight) / 1.2;
    let pixelRatio = window.devicePixelRatio;

    // Set display size (css pixels).
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    canvas.width = Math.floor(size * devicePixelRatio);
    canvas.height = Math.floor(size * devicePixelRatio);
    ctx.scale(pixelRatio, pixelRatio);
    draw();
}

function draw() {
    let squareSize = size / 8;

    for (let i = 0; i < 64; i++) {
        ctx.fillStyle = i % 2 == 0 && i % 16 >= 8
                     || i % 2 == 1 && i % 16 < 8
                     ? darkSquareCol : lightSquareCol;
        
        let x = (i % 8) * squareSize;
        let y = Math.floor(i / 8) * squareSize;
        
        ctx.fillRect(x, y, squareSize, squareSize);
        if (array[Math.floor(i / 8)][i % 8]) {
            x += squareSize;
            y += squareSize;

            ctx.beginPath();
            ctx.arc(x - (squareSize / 2), y - (squareSize / 2), squareSize / 2 - 3, 0, 2 * Math.PI);
            ctx.strokeStyle = "red";
            ctx.lineWidth = "3";
            ctx.stroke();
        }
    }
    //ctx.fillRect(0, 0, squareSize, squareSize);
    //ctx.fillRect(squareSize, squareSize, squareSize, squareSize);
}

function clickBoard(e) {
    let bounds = canvas.getBoundingClientRect();
    let cursorX = e.clientX - bounds.left;
    let cursorY = e.clientY - bounds.top;

    let col = Math.floor(cursorX / squareSize);
    let row = Math.floor(cursorY / squareSize);
    console.log("col =", col);
    console.log("row =", row);
    array[row][col] = !array[row][col];
    draw();
}

window.onload = init;
window.onresize = resizeCanvas;
