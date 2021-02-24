var trex, trex_running, collidedAni;
var invisibleGround;
var backgroundImage;
var cloud, cloudImage, cloudGroup;
var c1, c2, c3, c4, c5, c6, cactus, cactiGroup;
var PLAY = 1, END = 0, gameState = PLAY;
var game_over, restart, goimage, rimage;
var die, checkpoint, jump;
var s;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  collidedAni = loadAnimation("trex_collided.png");
  backgroundImage = loadImage("desert.jpg");
  cloudImage = loadImage("cloud.png");
  goimage = loadImage("game_over.png");
  rimage = loadImage("restart.png");
  c1 = loadImage("obstacle1.png");
  c2 = loadImage("obstacle2.png");
  c3 = loadImage("obstacle3.png");
  c4 = loadImage("obstacle4.png");
  c5 = loadImage("obstacle5.png");
  c6 = loadImage("obstacle6.png");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  s = 0;
  trex = createSprite(50, height-30, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("Dead T-Rex", collidedAni);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40);
  invisibleGround = createSprite(200, height-15, width-200, 10);
  invisibleGround.visible = false;
  cloudGroup = new Group();
  cactiGroup = new Group();
  game_over = createSprite(width/2,height/2-60,30,30);
  game_over.addImage("Game Over", goimage);
  game_over.visible = false;
  restart = createSprite(width/2,height/2,0,0);
  restart.addImage("restart",rimage);
  restart.visible = false;
}

function draw() {
  background(backgroundImage);
  //stop trex from falling down//
  trex.collide(invisibleGround);
  if (gameState == PLAY) {
    play();
  } else if (gameState == END) {
    end();
  }
  score();
  drawSprites();
  //console.warn("out");console.info("Hello");console.log(trex.y);//
}

function play() {
  trex.changeAnimation("running");
  trex.velocityY = trex.velocityY + 1;
  s = Math.round(frameCount / 10);
  Spawn_Clouds();
  Spawn_Cacti();
  if (touches.length > 0 || keyDown("space") && trex.y >= height-110) {
    trex.velocityY = -12;//space pressed - jump//
    jump.play();
    touches = [];
  }
  if (s%150 == 0) {
    checkpoint.play();
  }
  if (trex.isTouching(cactiGroup)) {
    die.play();
    gameState = END;
  }
}

function end() {
  game_over.visible = true;
  trex.velocityY = 0;
  cloudGroup.setVelocityXEach(0);
  cactiGroup.setVelocityXEach(0);
  cactiGroup.setLifetimeEach(-1);
  cloudGroup.setLifetimeEach(-1);
  trex.changeAnimation("Dead T-Rex");
  restart.visible = true;
  if(mousePressedOver(restart)) {
    reset();
  }
}

function reset() {
  gameState = PLAY;
  game_over.visible = false;
  restart.visible = false;
  cloudGroup.destroyEach();
  cactiGroup.destroyEach();
  s = 0;
  frameCount = 0;
  trex.y = height - 30;
}

function score() {
  textSize(13);
  textFont("Comic Sans MS");
  text("Score: " + s + " meters", width-160, 20);
}

function Spawn_Clouds() {
  if (frameCount % 50 == 0) {
    cloud = createSprite(width, Math.round(random(40,height/4)), 0, 0);
    cloud.addImage("running", cloudImage);
    cloud.velocityX = -6;
    trex.depth = cloud.depth + 1;
    cloud.lifetime = width / cloud.velocityX;
    cloudGroup.add(cloud);
  }
}

function Spawn_Cacti() {
  if (frameCount % Math.round(random(40, 80)) == 0) {
    cactus = createSprite(width, invisibleGround.y - 30, 10, 10);
    cactus.velocityX = -6;
    cactus.scale = 0.75;
    switch (Math.round(random(1, 6))) {
      case 1:
        cactus.addImage(c1);
        break;
      case 2:
        cactus.addImage(c2);
        break;
      case 3:
        cactus.addImage(c3);
        break;
      case 4:
        cactus.addImage(c4);
        break;
      case 5:
        cactus.addImage(c5);
        break;
      case 6:
        cactus.addImage(c6);
        break;
    }
    cactus.lifetime = width / cactus.velocityX;
    cactiGroup.add(cactus);
  }
}