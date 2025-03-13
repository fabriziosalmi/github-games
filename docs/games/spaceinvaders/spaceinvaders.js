class SpaceInvaders {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 320;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 30);
    this.enemies = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.score = 0;
    this.gameOver = false;
    this.createEnemies();
    this.lastEnemyMove = Date.now();
    this.enemyMoveInterval = 1000;
    this.enemyDirection = 1;
    this.enemyMoveDown = false;
    this.enemyBulletInterval = 2000;
    this.lastEnemyBullet = Date.now();
    this.gameLoop();
  }

  createEnemies() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        this.enemies.push(new Enemy(j * 40 + 30, i * 30 + 30));
      }
    }
  }

  gameLoop() {
    if (this.gameOver) {
      this.drawGameOver();
      return;
    }
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    this.player.update();
    this.updateBullets();
    this.updateEnemies();
    this.updateEnemyBullets();
    this.checkCollisions();
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      if (this.bullets[i].y < 0) {
        this.bullets.splice(i, 1);
      }
    }
  }

  updateEnemyBullets() {
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
          this.enemyBullets[i].update();
          if (this.enemyBullets[i].y > this.canvas.height) {
            this.enemyBullets.splice(i, 1);
          }
        }
      }
    }