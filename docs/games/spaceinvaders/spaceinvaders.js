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
    if (Date.now() - this.lastEnemyBullet > this.enemyBulletInterval) {
      this.fireEnemyBullet();
      this.lastEnemyBullet = Date.now();
    }
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

  updateEnemies() {
    const now = Date.now();
    if (now - this.lastEnemyMove > this.enemyMoveInterval) {
      let shouldReverse = false;
      for (let enemy of this.enemies) {
        if ((enemy.x + enemy.width >= this.canvas.width && this.enemyDirection > 0) ||
            (enemy.x <= 0 && this.enemyDirection < 0)) {
          shouldReverse = true;
          break;
        }
      }
      if (shouldReverse) {
        this.enemyDirection *= -1;
        for (let enemy of this.enemies) {
          enemy.y += 10;
        }
      } else {
        for (let enemy of this.enemies) {
          enemy.x += 5 * this.enemyDirection;
        }
      }
      this.lastEnemyMove = now;
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

  checkCollisions() {
    // Completed collision detection logic
    // Check player bullets hitting enemies
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (this.collides(bullet, enemy)) {
          this.enemies.splice(j, 1);
          this.bullets.splice(i, 1);
          this.score += 10;
          break;
        }
      }
    }
    // Check enemy bullets hitting player
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      if (this.collides(bullet, this.player)) {
        this.gameOver = true;
        break;
      }
    }
  }

  draw() {
    // Completed drawing logic
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw player, enemies, player bullets and enemy bullets
    this.player.draw(this.ctx);
    this.enemies.forEach(enemy => enemy.draw(this.ctx));
    this.bullets.forEach(bullet => bullet.draw(this.ctx));
    this.enemyBullets.forEach(bullet => bullet.draw(this.ctx));
    // Draw score
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Score: ' + this.score, 8, 20);
  }

  drawGameOver() {
    // Completed game over rendering logic
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'red';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
  }

  fireEnemyBullet() {
    if (this.enemies.length === 0) return;
    const enemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
    this.enemyBullets.push(new Bullet(enemy.x + enemy.width / 2, enemy.y + enemy.height, 0, 4));
  }
  
  // Utility method for collision detection based on bounding boxes
  collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
}