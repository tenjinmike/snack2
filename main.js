document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const finalScoreElement = document.getElementById('final-score');
    const gameOverOverlay = document.getElementById('game-over');
    const gameStartOverlay = document.getElementById('game-start');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Theme logic
    let isDarkMode = localStorage.getItem('snack2-theme') !== 'light';
    updateTheme();

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('snack2-theme', isDarkMode ? 'dark' : 'light');
        updateTheme();
    });

    function updateTheme() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeIcon.textContent = '🌙';
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeIcon.textContent = '☀️';
        }
        if (gameRunning) draw(); // Redraw once to update colors
    }

    // Canvas size
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    // Game state
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let nextDx = 0;
    let nextDy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snack2-highScore') || 0;
    let gameLoop;
    let gameRunning = false;
    let speed = 150;

    highScoreElement.textContent = highScore;

    function startGame() {
        snake = [{ x: 10, y: 10 }];
        generateFood();
        nextDx = 1;
        nextDy = 0;
        dx = 1;
        dy = 0;
        score = 0;
        speed = 150;
        scoreElement.textContent = score;
        gameRunning = true;
        gameStartOverlay.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, speed);
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    function draw() {
        update();
        if (!gameRunning) return;

        // Get colors from CSS variables
        const canvasBg = getComputedStyle(document.body).getPropertyValue('--canvas-bg').trim();
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary-color').trim();
        const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim();

        // Clear canvas
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw food
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = accentColor;
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw snake
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? primaryColor : secondaryColor;
            if (isHead) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = primaryColor;
            }
            
            ctx.beginPath();
            const r = 5;
            const x = segment.x * gridSize + 1;
            const y = segment.y * gridSize + 1;
            const w = gridSize - 2;
            const h = gridSize - 2;
            ctx.roundRect(x, y, w, h, r);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    function update() {
        dx = nextDx;
        dy = nextDy;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            endGame();
            return;
        }

        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snack2-highScore', highScore);
            }
            generateFood();
            
            if (speed > 60) {
                speed -= 2;
                clearInterval(gameLoop);
                gameLoop = setInterval(draw, speed);
            }
        } else {
            snake.pop();
        }
    }

    function endGame() {
        gameRunning = false;
        clearInterval(gameLoop);
        finalScoreElement.textContent = score;
        gameOverOverlay.classList.remove('hidden');
    }

    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (dy === 0) { nextDx = 0; nextDy = -1; }
                break;
            case 'ArrowDown':
                if (dy === 0) { nextDx = 0; nextDy = 1; }
                break;
            case 'ArrowLeft':
                if (dx === 0) { nextDx = -1; nextDy = 0; }
                break;
            case 'ArrowRight':
                if (dx === 0) { nextDx = 1; nextDy = 0; }
                break;
        }
    });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    // Initial clear
    const initialBg = getComputedStyle(document.body).getPropertyValue('--canvas-bg').trim();
    ctx.fillStyle = initialBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

if (!Path2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    }
}
