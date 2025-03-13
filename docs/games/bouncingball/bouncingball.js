const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ball; // Declare ball outside resizeCanvas so it's accessible globally

function initBall() {
  ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    dx: 5,
    dy: -5,
    gravity: 0.5,
    damping: 0.8,
    color: '#4CAF50'
  };
}


function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    canvas.width = Math.min(800, containerWidth * 0.95);
    canvas.height = window.innerWidth <= 768 ? canvas.width : canvas.width / 1.5;

    //Reinitialize the ball after resize to maintain proportions
    initBall();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  draw(); // Redraw after resize to visually update
});

resizeCanvas();
initBall(); // Initialize the ball after the initial canvas resize

function update() {
    // Apply gravity
    ball.dy += ball.gravity;

    // Update position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off walls
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx *= -ball.damping;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.dx *= -ball.damping;
    }

    // Bounce off floor and ceiling
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy *= -ball.damping;
    } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy *= -ball.damping;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();