let size;
let canvas;
let ctx;
let darkSquareCol;
let lightSquareCol;

function init() {
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    darkSquareCol = "#B38763";
    lightSquareCol = "#EFD8B3";
    resizeCanvas();
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

    for(let i = 0; i < 64; i++) {
        ctx.fillStyle = i % 2 == 0 && i % 16 >= 8
                     || i % 2 == 1 && i % 16 < 8
                     ? darkSquareCol : lightSquareCol;
        
        let x = (i % 8) * squareSize;
        let y = Math.floor(i / 8) * squareSize;
        
        ctx.fillRect(x, y, squareSize, squareSize);
    }
    //ctx.fillRect(0, 0, squareSize, squareSize);
    //ctx.fillRect(squareSize, squareSize, squareSize, squareSize);
}

window.onload = () => {
    init();
}

window.onresize = resizeCanvas
