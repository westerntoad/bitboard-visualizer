let size;
let canvas;
let hexrep;
let lerfChoice;
let lefrChoice;
let ctx;
let darkSquareCol;
let lightSquareCol;
let squareSize;
let mappingSchema;
let mouseIsDown;
let isHighlighting;
let array;

function init() {
    size = Math.min(window.innerWidth, window.innerHeight) / 1.2;
    canvas = document.getElementById("board");
    hexrep = document.getElementById("hexrep");
    lerfChoice = document.getElementById("lerfMapChoice");
    lefrChoice = document.getElementById("lefrMapChoice");
    ctx = canvas.getContext("2d");
    darkSquareCol = "#B38763";
    lightSquareCol = "#EFD8B3";
    squareSize = size / 8;
    // overly-verbose chessboard mapping schema collapsed into:
    // Little-Endian Rank-File Mapping -> LERF
    // Little-Endian File-Rank Mapping -> LEFR
    // Big-Endian Rank-File Mapping -> BERF
    // Big-Endian File-Rank Mapping -> BEFR
    mappingSchema = "LERF";
    mouseIsDown = false;

    array = new Array(8);
    for (var i = 0; i < 8; i++) {
        array[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            array[i][j] = false;
        }
    }

    resizeCanvas();
    update();
    
    canvas.onmousedown = (e) => {
        mouseIsDown = true;
        
        vals = getRowCol(e);
        let [row, col] = vals;
        isHighlighting = array[row][col];
        array[row][col] = !isHighlighting;
        draw();
    };
    canvas.onmouseup = (e) => {
        mouseIsDown = false;
        update();
    };
    canvas.onmousemove = (e) => {
        if (!mouseIsDown) return;

        vals = getRowCol(e);
        let [row, col] = vals;
        array[row][col] = !isHighlighting;
        
        draw();
    };
    lerfChoice.onclick = (e) => {
        mappingSchema = "LERF"
        update();
    };
    lefrChoice.onclick = (e) => {
        mappingSchema = "LEFR"
        update();
    };
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

    ctx.strokeStyle = "red";
    ctx.lineWidth = "3";
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
            ctx.stroke();
        }
    }
}

function getRowCol(e) {
    let bounds = canvas.getBoundingClientRect();
    let cursorX = e.clientX - bounds.left;
    let cursorY = e.clientY - bounds.top;

    let col = Math.floor(cursorX / squareSize);
    let row = Math.floor(cursorY / squareSize);

    return [row, col];
}

function update() {
    num = 0;
    switch (mappingSchema) {
        case "LERF":
            num = littleEndianRankFile();
        case "LEFR":
            num = littleEndianFileRank();
    }
    hexrep.value = "0x" + num.toString(16).padStart(16, "0");
}

function littleEndianRankFile() {
    num = 0n;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (array[7 - i][j]) {
                num += BigInt(2**(i * 8 + j));
            }
        }
    }

    return num;
}

function littleEndianFileRank() {
    num = 0n;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (array[7 - j][i]) {
                num += BigInt(2**(i * 8 + j));
            }
        }
    }

    return num;
}

window.onload = init;
window.onresize = resizeCanvas;
