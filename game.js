const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Sounds
const jumpSound = new Audio("assets/jump.mp3");
const hitSound = new Audio("assets/hit.mp3");
const selectSound = new Audio("assets/select.mp3");

// Background
const bg = new Image();
bg.src = "assets/bg.png";

// Pipes
const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";

// Player image (selected later)
let playerImg = new Image();

// Player
let player = {
    x: 120,
    y: 220,
    width: 60,
    height: 60,
    velocity: 0
};

let gravity = 0.4;
let pipes = [];
let gap = 230;
let bgX = 0;

// Select character
document.querySelectorAll(".char").forEach(ch => {
    ch.onclick = () => {
        let id = ch.dataset.id;
        playerImg.src = `assets/char${id}.png`;

        selectSound.play();

        document.getElementById("charSelect").style.display = "none";
        canvas.style.display = "block";

        startGame();
    };
});

function startGame() {
    document.addEventListener("touchstart", flap);
    document.addEventListener("keydown", flap);

    // Spawn pipes
    setInterval(() => {
        let topHeight = Math.random() * (canvas.height - gap - 200) + 80;

        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap
        });
    }, 1600);

    update();
}

function flap() {
    player.velocity = -8.5;
    jumpSound.play();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // MOVE BACKGROUND
    bgX -= 2;
    if (bgX <= -canvas.width) bgX = 0;

    ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);

    // PLAYER
    player.velocity += gravity;
    player.y += player.velocity;

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // PIPES
    pipes.forEach((p, i) => {
        p.x -= 4;

        ctx.drawImage(pipeImg, p.x, 0, 100, p.top);
        ctx.drawImage(pipeImg, p.x, p.bottom, 100, canvas.height - p.bottom);

        // COLLISION
        if (
            player.x + player.width > p.x &&
            player.x < p.x + 100 &&
            (player.y < p.top || player.y + player.height > p.bottom)
        ) {
            hitSound.play();
            alert("Game Over!");
            location.reload();
        }
    });

    // Ground hit
    if (player.y + player.height > canvas.height) {
        hitSound.play();
        alert("Game Over!");
        location.reload();
    }

    requestAnimationFrame(update);
          }
