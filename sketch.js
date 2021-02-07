var trex,trex_running,trex_collided 
var ground,groundImage

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY
var count=0
var jump,die,checkpoint
var invisibleGround,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,cloudsGroup,obstaclesGroup,cloudImage
function preload(){
  jump=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  checkpoint=loadSound("checkPoint.mp3")
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")
  trex_collided=loadAnimation("trex_collided.png")
  
  groundImage=loadImage("ground2.png")
  obstacle1=loadImage("obstacle1.png")
    obstacle2=loadImage("obstacle2.png")
  obstacle3=loadImage("obstacle3.png")
  obstacle4=loadImage("obstacle4.png")
  obstacle5=loadImage("obstacle5.png")
  obstacle6=loadImage("obstacle6.png")
  cloudImage=loadImage("cloud.png")
  gameoverImage=loadImage("gameOver.png")
  restartImage=loadImage("restart.png")
}



function setup() {
  createCanvas(600, 200);
  trex=createSprite(50,160,10,10)
  trex.addAnimation("running",trex_running)
  trex.addAnimation("collided",trex_collided)
  trex.scale=0.6
  
  ground=createSprite(300,180,600,10)
  ground.addImage(groundImage)
ground.x=ground.width/2
  invisibleGround=createSprite(300,190,600,10)
  invisibleGround.visible=false
  cloudsGroup=createGroup()
  obstaclesGroup=createGroup()
  
  //place gameOver and restart icon on the screen
 gameOver = createSprite(300,100);
 restart = createSprite(300,140);
gameOver.addImage(gameoverImage);
gameOver.scale = 0.5;
restart.addImage(restartImage);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
  trex.setCollider("circle",0,0,40)
}
function draw() {
  background(255);
  
    text("Score: "+ count, 500, 50); 
  if(gameState===PLAY){
    
    
   count =count+ Math.round(getFrameRate()/60);
    if(count>0&&count%100===0){
      checkpoint.play()
    }
  ground.velocityX=-(4+count/100)
  
  if(ground.x<0){
    ground.x=ground.width/2
  }
  
  if(keyDown ("space") && trex.y>150  ){
    jump.play()
    trex.velocityY=-10
  }
  trex.velocityY=trex.velocityY+0.5
  trex.collide(invisibleGround)
  spawnObstacles()
  
  spawnClouds()
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play()
    }
  }
  else if(gameState===END){
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex. changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1); 
       if(mousePressedOver(restart)) {
    reset();
  }
  }

  drawSprites()
}

function reset(){
 gameState=PLAY;
 gameOver.visible=false;
 restart.visible=false;
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 trex.changeAnimation("running");
 count=0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX =-(6+count/100)
    
    //generate random obstacles
    var rand=Math.round( random(1,6));
    
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
        break;
          case 2:obstacle.addImage(obstacle2);
        break;
          case 3:obstacle.addImage(obstacle3);
        break;
          case 4:obstacle.addImage(obstacle4);
        break;
          case 5:obstacle.addImage(obstacle5);
        break;
          case 6:obstacle.addImage(obstacle6);
        break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if ( frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}