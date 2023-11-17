let foxState = "ko";
const dropdown = document.getElementById("animations");
dropdown.addEventListener("change", function (e) {
  foxState = e.target.value;
});

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "shadow_dog.png";
const sWidth = 575;
const sHeight = 523;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 2;
const spriteAnimations = [];
const animationStates = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let i = 0; i < state.frames; i++) {
    let posX = i * sWidth;
    let posY = index * sHeight;
    frames.loc.push({ x: posX, y: posY });
  }
  spriteAnimations[state.name] = frames;
});

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let pos =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[foxState].loc.length;
  frameX = sWidth * pos;
  frameY = spriteAnimations[foxState].loc[pos].y;
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    sWidth,
    sHeight,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
