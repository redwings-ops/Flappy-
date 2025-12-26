const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load sounds
const jumpSound = new Audio("assets/jump.mp3");
const hitSound = new Audio("assets/hit.mp3");
const selectSound = new Audio("assets/select.mp3");

// Load images
const bgImg = new Image();
bgImg.src = "assets/vtu.jpeg";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png.jpg";

let playerImg = new Image();

// Player setup
let player = {
    x: 120,
    y: 200,
    width: 60,
    height: 60,
    velocity: 0
};

let gravity = 0.4;
let pipes = [];
let gap = 240;
let bgX = 0; // For background movement

// Character selection
document.querySelectorAll(".char").forEach(img => {
    img.onclick = () => {
        let id = img.dataset.id;
        playerImg.src = `assets/char${id}.png`;
        selectSound.play();

        document.getElementById("charSelect").style.display = "none";
        canvas.style.display = "block";

        startGame();
    }
});

function startGame() {
    document.addEventListener("keydown", jump);
    document.addEventListener("touchstart", jump);

    setInterval(() => {
        let topHeight = Math.random() * (canvas.height - gap - 200) + 80;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap
        });
    }, 1600);

    requestAnimationFrame(update);
}

function jump() {
    player.velocity = -9;
    jumpSound.play();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scroll background
    bgX -= 2;
    if (bgX <= -canvas.width) bgX = 0;

    ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

    // Player animation
    player.velocity += gravity;
    player.y += player.velocity;
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Pipes movement and collision
    pipes.forEach(p => {
        p.x -= 4;
        ctx.drawImage(pipeImg, p.x, 0, 100, p.top);
        ctx.drawImage(pipeImg, p.x, p.bottom, 100, canvas.height - p.bottom);

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

    if (player.y + player.height > canvas.height) {
        hitSound.play();
        alert("Game Over!");
        location.reload();
    }

    requestAnimationFrame(update);
                  }
