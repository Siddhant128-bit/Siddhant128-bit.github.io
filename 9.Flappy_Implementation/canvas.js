//---------------------------------------------variable and constant declaration here-------------------------------------------------------------------------------------------------------

const canvas=document.getElementById('can_mine');
const c=canvas.getContext('2d');

let f=0;//for sprite animation
const DEGREE=Math.PI/180; //multiply with any number gives the degree value radian to degree conversion formula.



//Multiple assets for multiple componenets not suitable so downloaded sprite and and loadign sprite which is then used to get different required elements images
const sprite= new Image();
sprite.src='./Images/sprite.png'

//------------------------------------------------------------------------Player and all objects are below here---------------------------------------------------------------------------------------------------
//player bird and animating it between 3 images by changing the image in the player position
const player={
  animation:[
    {s_x:276,s_y:112},
    {s_x:276,s_y:139},
    {s_x:276,s_y:164},
    {s_x:276,s_y:139}
  ], //3 image for 3 frames and central image repetaed as this will give animation effect it seems.
  speed:0,
  gravity: 0.25,
  jump:4.6,
  x:50,
  y:150,
  w:34,
  h:26,
  frame: 0,
  rotation:0,//for rotation with certain angle
  radius: 12,

  draw: function()
  {
    let player=this.animation[this.frame] //chosing image from the array of animation  as shown above and selecting particlar image iterate it and we will have animation effect;
    c.save();
    c.translate(this.x,this.y);
    c.rotate(this.rotation)
    c.drawImage(sprite,player.s_x,player.s_y,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h);
    c.restore();
  },
  flap: function(){
    this.speed=-this.jump;
  },
  update: function(){
    //game in ready fap slow else fap fast bird wings
    this.period=gamestate.current==gamestate.getReady? 10:5;
    this.frame+=f%this.period==0?1:0;
    this.frame=this.frame%this.animation.length;
    if(gamestate.current==gamestate.getReady)
    {
      this.y=150;
      this.rotation=0*DEGREE
    }
    else
    {
      this.speed+=this.gravity;//speed increases by gravity gradually increasing the velocity of falling object elementary physics logic!
      this.y+=this.speed;// change y poisition with y so that it doesn't fall linerally rather speed changes depending upon time!
      if (this.y+this.h/2>=canvas.height-foreground.h) //if buttom of the player touches the ground stop there boundry condition!
      {
        this.y=canvas.height-foreground.h-this.h/2;
        if(gamestate.current==gamestate.game)
        {
          this.speed=0;
          gamestate.current=gamestate.over;
        }
      }
    }
    //if speed greater than jump
    if(this.speed>=this.jump){
      this.rotation=90*DEGREE;
      this.frame=1;
    }
    else{
      this.rotation=-25*DEGREE;
    }
  },
  speedReset : function(){
    console.log('Speed Reset')
      this.speed = 0;
  }
}

//------------------------------------------------------------------------------background object-------------------------------------------------------------------

//Background static will help animate other so keeping it static. Background Object created
const background={
  s_x: 0, //position in sprite x axis
  s_y: 0, //position in sprite y axis for background
  w: 275,
  h: 226,
  x:0,
  y: canvas.height-226,
  draw: function(){
    c.drawImage(sprite,this.s_x,this.s_y,this.w,this.h,this.x,this.y,this.w,this.h); //drawing 2 images of the background with left and right position so that it fills the canvas
    c.drawImage(sprite,this.s_x,this.s_y,this.w,this.h,this.w+this.x,this.y,this.w,this.h);
  }
}


//---------------------------------------------------------------------------foreground object for foreground--------------------------------------------------------------------------

//foreground consists of the ground and pipe and it should animate for better working
const foreground={
  s_x: 276,
  s_y: 0,
  w: 224,
  h: 112,
  x: 0,
  y: canvas.height-112,
  dx:2,
  draw: function(){
    c.drawImage(sprite,this.s_x,this.s_y,this.w,this.h,this.x,this.y,this.w,this.h);
    c.drawImage(sprite,this.s_x,this.s_y,this.w,this.h,this.w+this.x,this.y,this.w,this.h);
  },
  update: function(){
    if(gamestate.current==gamestate.game)
    {
      this.x=(this.x-this.dx)%(this.w/2)
    }
  }

}
//---------------------------------------------------------------------ready object for ready state------------------------------------------------------------------------------------

// Get Ready image co-ordinate and image defined for this with an object
const ready={
  s_x:0,
  s_y: 228,
  w:173,
  h: 152,
  x: canvas.width/2-173/2,
  y: 80,
  draw: function()
  {
    if (gamestate.current==gamestate.getReady)
    {
      //console.log('Game Ready?')
      c.drawImage(sprite,this.s_x,this.s_y,this.w,this.h,this.x,this.y,this.w,this.h);
    }

  }
}
//-----------------------------------------------------------------------Score--------------------------------------------------------------------------------------------------------
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,

    draw : function(){
        c.fillStyle = "#FFF";
        c.strokeStyle = "#000";
        if(gamestate.current == gamestate.game){
            c.lineWidth = 2;
            c.font = "35px Teko";
            //console.log(this.value,this.best);
            c.fillText(this.value, canvas.width/2, 50);
            c.strokeText(this.value, canvas.width/2, 50);

        }
    },
    reset : function(){
        this.value = 0;
    }
}


//--------------------------------------------------------------------gameover for gameover state------------------------------------------------------------------------------------------


//for Gameover msg display
const gameover={
  s_x:175,
  s_y:228,
  w: 225,
  h: 202,
  x: canvas.width/2-255/2,
  y: 90,
  draw: function(){
    if (gamestate.current==gamestate.over)
    {
      //console.log('Here lies gameover')
      c.drawImage(sprite,this.s_x,this.s_y,this.w,this.h,this.x,this.y,this.w,this.h);
      c.font = "25px Teko";
      c.fillText(score.value, 225, 186);
      c.strokeText(score.value, 225, 186);
      // BEST SCORE
      c.fillText(score.best, 225, 228);
      c.strokeText(score.best, 225, 228);
    }
  }
}
//--------------------------------------------------------------------game stats are present here--------------------------------------------------------------------------------------------


//what is state of the game is it ready state game play state or gameover state?
const gamestate={
  current:0,//current state of game
  getReady:0,
  game:1,
  over:2
}

//-----------------------------------------------------------------------Pipes objects are here -----------------------------------------------------------------------

//pipe handling by a single object
const pipes = {
    position : [],
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    w:53,
    h:400,
    gap:85,
    maxYPos:-150,
    dx:2,
    draw : function(){ //for drawing the pipes
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            //drawing  top pipe
            c.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
            // drawing the bottom pipe
            c.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },
    update: function(){ //for moving the pipes and making it dynamic
      if (gamestate.current!==gamestate.game) return;
      if(f%100==0)
      {
        this.position.push({
          x: canvas.width,
          y: this.maxYPos*(Math.random()+1)
        });
      }
      for(let i=0; i<this.position.length; i++)
      {
        let p=this.position[i]
        p.x-=this.dx;
        //fine the buttom pipe position and keep it updated
        let buttomPipeYPosition=p.y+this.h+this.gap;

        //collision between pipes and player
        if(player.x+player.radius>p.x &&  player.x-player.radius<p.x+this.w  &&  player.y+player.radius>p.y && player.y-player.radius<p.y+this.h) //check the positionand radius if it is greater then pipes x then
        {
          //console.log('Collision')
          gamestate.current=gamestate.over;
        }
        if(player.x+player.radius>p.x &&  player.x-player.radius<p.x+this.w  &&  player.y+player.radius>buttomPipeYPosition && player.y-player.radius<buttomPipeYPosition+this.h) //check the positionand radius if it is greater then pipes x then
        {
          //console.log('Collision')
          gamestate.current=gamestate.over;
        }
        //removing from array when passes beyond the canvas
        if (p.x+this.w<=0)
        {
          this.position.shift();
          score.value += 1;
          score.best=Math.max(score.value,score.best);
          localStorage.setItem('best',score.best)
        }
      }
    },
    reset : function(){
        this.position = [];
    }

}

const startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}

//---------------------------------------------------------------------Event listeners are present here-------------------------------------------------------------------------------------
//this to control the game in different clicks changing game state and even position;
canvas.addEventListener('click',function(event)
{
  //console.log(gamestate.current)
  switch(gamestate.current)
  {
    case gamestate.getReady:
      gamestate.current=gamestate.game;
      break;
    case gamestate.game:
      player.flap();
      break;
    case gamestate.over:
      gamestate.current=gamestate.getReady;
      console.log('Gameover state')
      let rect = canvas.getBoundingClientRect();
      let clickX = event.clientX - rect.left;
      let clickY = event.clientY - rect.top;

      // See if in start button
      if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
          pipes.reset();
          player.speedReset();
          score.reset();
          gamestate.current = gamestate.getReady;
      }
      else {
        console.log('Somewhere else')
        gamestate.current = gamestate.over;
      }
      break;
  }
})


//------------------------------------------------------------------functions and looping here----------------------------------------------------------------
function draw(){
  c.fillStyle='#70c5ce';
  c.fillRect(0,0,canvas.width,canvas.height);
  background.draw(); //drawing  with object background amd draw funciton calling line 16 and below
  foreground.draw();
  player.draw();
  pipes.draw();
  ready.draw();
  score.draw();
  gameover.draw();
}

function animate(){ //for animating the movign parts as the player moves up and down, foreground moves to the side and the pipes move so these are mentioned inside the animate function
  player.update();
  foreground.update();
  pipes.update();
}

function game(){ //Game will have all of the needed things and will be animating all the time hence request Animation Frame
  draw();
  animate();
  f+=1;
  requestAnimationFrame(game);
}

game();
