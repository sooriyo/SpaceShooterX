const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

window.addEventListener('resize', resizeCanvas, false);

const invaderImage = new Image();
invaderImage.src = 'alienShip.svg';


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


const player    = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

let spaceshipImage = new Image();
spaceshipImage.src = 'battleShip.svg';

spaceshipImage.onload = function() {
    draw();
};

let score = 0;
let level = 1;
let gameOver = false;
let maxBullets = 5; // Limit of bullets on screen

const invaders = [];
const bulletWidth = 4;
const bulletHeight = 10;
const bulletSpeed = 4;
const bullets = [];
let invaderSpeed = 1; // Starting speed of invaders

function createInvaders() {
    invaders.length = 0; // Clear existing invaders
    invaderSpeed = 1 + 0.5 * (level - 1); // Increase speed with each level

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) { // Keep a constant number of rows
            invaders.push({
                x: i * 80,
                y: j * 40,
                width: 40,
                height: 30,
                dx: invaderSpeed, // Speed in the x-direction
                dy: 10 // Downward step size
            });
        }
    }
}

function drawPlayer() {
    ctx.drawImage(spaceshipImage, player.x, player.y, player.width, player.height);
}


function drawInvaders() {
    invaders.forEach(invader => {
        ctx.drawImage(invaderImage, invader.x, invader.y, invader.width, invader.height);
    });
}

function drawBullets() {
    ctx.fillStyle = 'white';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Level: ${level}`, 20, 30);
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y + bulletHeight < 0) {
            bullets.splice(index, 1);
        }
    });
}

function moveInvaders() {
    let edgeReached = false;

    invaders.forEach(invader => {
        invader.x += invader.dx;
        if (invader.x <= 0 || invader.x + invader.width >= canvas.width) {
            edgeReached = true;
        }
    });

    if (edgeReached) {
        invaders.forEach(invader => {
            invader.dx *= -1; // Change horizontal direction
            invader.y += invader.dy; // Move down
        });
    }
}

function checkCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((invader, invaderIndex) => {
            if (bullet.x < invader.x + invader.width &&
                bullet.x + bulletWidth > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bulletHeight > invader.y) {
                invaders.splice(invaderIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;

                if (invaders.length === 0) {
                    levelUp();
                }
            }
        });
    });
}

function levelUp() {
    level++;
    maxBullets += 1; // Increase the bullet limit with each level
    createInvaders();
}

function update() {
    movePlayer();
    moveBullets();
    moveInvaders();
    checkCollision();

    if (gameOver) return;

    requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawInvaders();
    drawBullets();
    drawScore();
    drawLevel();
    update();
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
        if (bullets.length < maxBullets) {
            bullets.push({ x: player.x + player.width / 2 - bulletWidth / 2, y: player.y - bulletHeight });
        }
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

createInvaders();
draw();
