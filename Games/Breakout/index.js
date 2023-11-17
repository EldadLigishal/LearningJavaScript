const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

let timerID;
let xDirection = -2;
let yDirection = 2;
let score = 0;

const userStart = [230, 10];
let currentPos = userStart;

const ballStart = [270, 30];
let ballPos = ballStart;

//create a block
class Block {
  constructor(xAxix, yAxis) {
    this.bottomLeft = [xAxix, yAxis];
    this.bottomRight = [xAxix + blockWidth, yAxis];
    this.topLeft = [xAxix, yAxis + blockHeight];
    this.topRight = [xAxix + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  //first row
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  //second row
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  //second row
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

//draw a block
function addBlock() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlock();

//draw user
function drawUser() {
  user.style.left = currentPos[0] + "px";
  user.style.bottom = currentPos[1] + "px";
}

//draw ball
function drawBall() {
  ball.style.left = ballPos[0] + "px";
  ball.style.bottom = ballPos[1] + "px";
}

//add user
const user = document.createElement("div");
drawUser();
user.classList.add("user");

grid.appendChild(user);

//user movment
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPos[0] > 0) {
        currentPos[0] -= 10;
        drawUser();
      }
      break;

    case "ArrowRight":
      if (currentPos[0] < boardWidth - blockWidth) {
        currentPos[0] += 10;
        drawUser();
      }
      break;
  }
}

//add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

//ball movement
function moveBall() {
  ballPos[0] += xDirection;
  ballPos[1] += yDirection;
  drawBall();
  checkCollisions();
}

timerID = setInterval(moveBall, 30);

//collisions
function checkCollisions() {
  //check if ball hit a block
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballPos[0] > blocks[i].bottomLeft[0] &&
      ballPos[0] < blocks[i].bottomRight[0] &&
      ballPos[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballPos[1] < blocks[i].bottomRight[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      //check for a win
      if (blocks.length === 0) {
        clearInterval(timerID);
        scoreDisplay.innerHTML = "You won!!!";
        document.removeEventListener("keydown", moveUser);
      }
    }
  }
  if (
    ballPos[0] >= boardWidth - ballDiameter ||
    ballPos[1] >= boardHeight - ballDiameter ||
    ballPos[0] <= 0
  ) {
    changeDirection();
  }

  //check if ball hit user
  if (
    ballPos[0] > currentPos[0] &&
    ballPos[0] < currentPos[0] + blockWidth &&
    ballPos[1] > currentPos[1] &&
    ballPos[1] < currentPos[1] + blockHeight
  ) {
    changeDirection();
  }

  if (ballPos[1] <= 0) {
    clearInterval(timerID);
    scoreDisplay.innerHTML = "You lost :(";
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}

document.addEventListener("keydown", moveUser);
