class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.body = [{x: 10, y: 10}];
        this.direction = 'right';
        this.score = 0;
    }

    move(food) {
        const head = {...this.body[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        this.body.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            this.score += 10;
            return true;
        }

        this.body.pop();
        return false;
    }

    checkCollision(gridSize) {
        const head = this.body[0];
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }

        // 检查是否撞到自己
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileSize = canvas.width / gridSize;

let snake = new Snake();
let food = generateFood();
let gameLoop;
let gameRunning = false;
let lives = 3;

// 添加更新生命值显示的函数
function updateLivesDisplay() {
    document.getElementById('livesText').textContent = lives;
}

// 初始化时显示生命值
updateLivesDisplay();

function generateFood() {
    return {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
}

function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.body.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 1, tileSize - 1);
    });

    // 绘制食物
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 1, tileSize - 1);
}

function update() {
    if (snake.move(food)) {
        food = generateFood();
        document.getElementById('scoreText').textContent = snake.score;
    }

    if (snake.checkCollision(gridSize)) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    lives--;
    updateLivesDisplay(); // 更新生命值显示
    
    if (lives > 0) {
        alert(`还剩 ${lives} 条命！当前得分：${snake.score}`);
        document.getElementById('startBtn').textContent = '继续游戏';
    } else {
        alert(`游戏结束！最终得分：${snake.score}\n生命值已耗尽！`);
        document.getElementById('startBtn').textContent = '游戏结束';
        document.getElementById('startBtn').disabled = true;
    }
}

function startGame() {
    if (gameRunning) return;
    
    if (lives === 0) {
        alert('游戏已结束，请刷新页面重新开始！');
        return;
    }
    
    snake.reset();
    food = generateFood();
    document.getElementById('scoreText').textContent = '0';
    gameRunning = true;
    
    gameLoop = setInterval(() => {
        update();
        draw();
    }, 150);
}

document.getElementById('startBtn').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;

    switch(event.key) {
        case 'ArrowUp':
            if (snake.direction !== 'down') snake.direction = 'up';
            break;
        case 'ArrowDown':
            if (snake.direction !== 'up') snake.direction = 'down';
            break;
        case 'ArrowLeft':
            if (snake.direction !== 'right') snake.direction = 'left';
            break;
        case 'ArrowRight':
            if (snake.direction !== 'left') snake.direction = 'right';
            break;
    }
}); 