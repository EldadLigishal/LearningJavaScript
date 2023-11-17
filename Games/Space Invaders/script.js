class Missiles {
  constructor() {
    // missiles size
    this.width = 5;
    this.height = 30;
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      context.save();
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.restore();
    }
  }

  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) {
        this.reset();
      }
    }
  }

  start(x, y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
}

class Enemy {
  constructor(game, positionX, positionY) {
    this.game = game;
    this.width = this.game.enemySize;
    this.height = this.game.enemySize;
    this.x = 0;
    this.y = 0;
    this.posX = positionX;
    this.posY = positionY;
    this.markedForDeletion = false;
  }
  draw(context) {
    //context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(x, y) {
    this.x = x + this.posX;
    this.y = y + this.posY;
    //check if missile hits enemy
    this.game.missilesPool.forEach((missle) => {
      if (
        !missle.free &&
        this.game.checkCollisions(this, missle) &&
        this.lives > 0
      ) {
        //(enemy, missle)
        this.hit(1);
        missle.reset();
        if (!this.game.gameOver) {
          this.game.score++;
        }
      }
    });
    if (this.lives < 1) {
      if (this.game.flagUpdate) this.frameX++;
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true;
        if (!this.game.gameOver) {
          this.game.score += this.maxLives;
        }
      }
    }
    //colliosn between player & enemies
    if (this.game.checkCollisions(this, this.game.player) && this.lives > 0) {
      this.lives = 0;
      this.game.player.lives--;
      if (this.game.player.lives < 1) {
        this.game.gameOver = true;
      }
    }
    // player losing
    if (this.y + this.height > this.game.height) {
      this.game.gameOver = true;
      this.markedForDeletion = true;
    }
  }
  hit(damage) {
    this.lives -= damage;
  }
}

class Beetlejuice extends Enemy {
  constructor(game, posX, posY) {
    super(game, posX, posY);
    this.image = document.getElementById("beetlemorph");
    this.frameX = 0;
    this.maxFrame = 2;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 1;
    this.maxLives = this.lives;
  }
}

class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height; //strating off screen
    this.speedX = Math.random() > 0.5 ? 1 : -1;
    this.speedY = 0;
    this.enemies = [];
    this.newWaveFlag = false;
    this.create();
  }

  render(context) {
    if (this.y < 0) {
      this.y += 5;
    }
    this.speedY = 0;

    //moving left to right every time it hits the edges
    //and going down by one row
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.enemies.forEach((enemy) => {
      enemy.update(this.x, this.y);
      enemy.draw(context);
    });
    this.enemies = this.enemies.filter((object) => !object.markedForDeletion);
  }

  create() {
    for (let row = 0; row < this.game.rows; row++) {
      for (let column = 0; column < this.game.columns; column++) {
        let enemyX = column * this.game.enemySize;
        let enemyY = row * this.game.enemySize;
        this.enemies.push(new Beetlejuice(this.game, enemyX, enemyY));
      }
    }
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 140;
    this.height = 120;
    this.x = this.game.width * 0.5 - this.width * 0.5; //center of the window
    this.y = this.game.height - this.height; //bottom of the window
    this.speed = 5; //game speed
    this.lives = 3;
    this.image = document.getElementById("player");
    this.image_jest = document.getElementById("player_jets");
    this.frameX = 0;
    this.jetsFrame = 0;
  }
  draw(context) {
    if (this.game.keys.indexOf("1") > -1) {
      this.frameX = 1;
    } else {
      this.frameX = 0;
    }

    context.drawImage(
      this.image_jest,
      this.jetsFrame * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    // Moving left to right
    if (this.game.keys.indexOf("ArrowLeft") > -1) {
      this.x -= this.speed;
      this.jetsFrame = 0;
    } else if (this.game.keys.indexOf("ArrowRight") > -1) {
      this.x += this.speed;
      this.jetsFrame = 2;
    } else {
      this.jetsFrame = 1;
    }
    //Boundries
    if (this.x < -this.width * 0.5) {
      this.x = -this.width * 0.5;
    } else if (this.x > this.game.width - this.width * 0.5) {
      this.x = this.game.width - this.width * 0.5;
    }
  }

  shoot() {
    const missle = this.game.getMissiles();
    if (missle) {
      missle.start(this.x + this.width * 0.5, this.y);
    }
  }

  restart() {
    this.x = this.game.width * 0.5 - this.width * 0.5; //center of the window
    this.y = this.game.height - this.height; //bottom of the window
    this.lives = 3;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.keys = [];
    this.player = new Player(this);

    this.missilesPool = [];
    this.numOfMissiles = 15;
    this.createMissiles();

    this.columns = 2;
    this.rows = 2;
    this.enemySize = 80;
    this.score = 0;
    this.gameOver = false;
    this.fire = false;

    this.waves = [];
    this.waves.push(new Wave(this));
    this.waveCount = 1;
    this.flagUpdate = false;
    this.flagTimer = 0;
    this.flagInterval = 80; //120ms

    window.addEventListener("keydown", (e) => {
      if (e.key === "1" && !this.fire) {
        this.player.shoot();
      }
      this.fire = true;
      if (this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
      if (e.key === "r" && this.gameOver) {
        this.restart();
      }
    });
    window.addEventListener("keyup", (e) => {
      this.fire = false;
      const index = this.keys.indexOf(e.key);
      if (index > -1) {
        this.keys.splice(index, 1);
      }
    });
  }
  render(context, deltaTime) {
    //console.log(deltaTime)
    if (this.flagTimer > this.flagInterval) {
      this.flagUpdate = true;
      this.flagTimer = 0;
    } else {
      this.flagUpdate = false;
      this.flagTimer += deltaTime;
    }

    this.drawStatusText(context);
    this.player.draw(context);
    this.player.update();
    this.missilesPool.forEach((missle) => {
      missle.update();
      missle.draw(context);
    });
    this.waves.forEach((wave) => {
      wave.render(context);
      if (wave.enemies.length < 1 && !wave.newWaveFlag && !this.gameOver) {
        this.newWave();
        this.waveCount++;
        wave.newWaveFlag = true;
        this.player.lives++;
      }
    });
  }

  createMissiles() {
    for (let i = 0; i < this.numOfMissiles; i++) {
      this.missilesPool.push(new Missiles());
    }
  }

  getMissiles() {
    for (let i = 0; i < this.missilesPool.length; i++) {
      if (this.missilesPool[i].free) {
        return this.missilesPool[i];
      }
    }
  }

  checkCollisions(a, b) {
    return (
      //we have collision if:
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  drawStatusText(context) {
    context.save();
    context.fillText("score: " + this.score, 20, 40);
    context.fillText("waves: " + this.waveCount, 20, 80);
    for (let i = 0; i < this.player.lives; i++) {
      context.fillRect(20 + 10 * i, 100, 5, 20);
    }
    if (this.gameOver) {
      context.textAlign = "center";
      context.font = "100px Impact";
      context.fillText("GAME OVER!", this.width * 0.5, this.height * 0.5);
      context.font = "20px Impact";
      context.fillText(
        "Press R to restart",
        this.width * 0.5,
        this.height * 0.5 + 30
      );
    }
    context.restore();
  }

  newWave() {
    if (
      Math.random() < 0.5 &&
      this.columns * this.enemySize < this.width * 0.8
    ) {
      this.columns++;
    } else if (this.rows * this.enemySize < this.height * 0.6) {
      this.rows++;
    }
    this.waves.push(new Wave(this));
  }
  restart() {
    this.player.restart();
    this.columns = 2;
    this.rows = 2;
    this.score = 0;
    this.gameOver = false;
    this.waves = [];
    this.waves.push(new Wave(this));
    this.waveCount = 1;
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 800;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.font = "30px Impact";

  const game = new Game(canvas);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    window.requestAnimationFrame(animate);
  }
  animate(0);
});
