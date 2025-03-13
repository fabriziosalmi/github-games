const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval; // Store the interval ID to clear it on game over

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const size = Math.min(800, containerWidth * 0.95);
    canvas.width = size;
    canvas.height = window.innerWidth <= 768 ? size : size / 1.5;

    // Adjust food position to stay within the new boundaries.
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
     drawGame(); // Redraw the game after resize.
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;
    let newDirection = { ...direction }; // Copy the current direction
    if (key === "ArrowUp" && direction.y === 0) newDirection = { x: 0, y: -1 };
    else if (key === "ArrowDown" && direction.y === 0) newDirection = { x: 0, y: 1 };
    else if (key === "ArrowLeft" && direction.x === 0) newDirection = { x: -1, y: 0 };
    else if (key === "ArrowRight" && direction.x === 0) newDirection = { x: 1, y: 0 };

    // Prevent the snake from reversing direction on itself.
    if(newDirection.x !== -direction.x || newDirection.y !== -direction.y){
        direction = newDirection;
    }
}

function updateGame() {
    // If no movement, do not update the game state.
    if (direction.x === 0 && direction.y === 0) {
        return;
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        endGame();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));
}

function gameLoop() {
    updateGame();
    drawGame();
}

function startGame() {
  // Reset game state
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
  score = 0;

  if(gameInterval) {
      clearInterval(gameInterval); // Clear any existing interval
  }

  gameInterval = setInterval(gameLoop, 150);
}

function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your Score: " + score);
    startGame();  // restart the game.
}

startGame(); // Start the game initially