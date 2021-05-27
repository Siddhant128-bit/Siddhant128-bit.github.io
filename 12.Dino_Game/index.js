function game_play()
{

  var collision_flag=0;
  var canvas=document.getElementById('game_canvas');
  const c=canvas.getContext('2d');
  // new canvas to get for neural network
  const canvas_Neural_Network=document.getElementById('canvas_NN')
  canvas_Neural_Network.style.display='None';

  const c_Neural_Network=canvas_Neural_Network.getContext('2d');
  let f=0;
  var generation=0
  const player_sprite=new Image();
  player_sprite.src='./Assets/dino_sprite.png'

  const decrease=new Image();
  decrease.src='./Assets/decrease_btn.png'

  const increase=new Image();
  increase.src='./Assets/increase_btn.png'

  const decrease_hover=new Image();
  decrease_hover.src='./Assets/decrease_btn_hover.png'


  const increase_hover=new Image();
  increase_hover.src='./Assets/increase_btn_hover.png'

  const sprite=new Image();
  sprite.src='./Assets/allsprite.png'

  const cactus_sprite=new Image();
  cactus_sprite.src='./Assets/cactus.png'

  var hover_flag_decrease_first=0;
  var hover_flag_decrease_second=0;
  var hover_flag_increase_first=0;
  var hover_flag_increase_second=0;
  var jump_modification=0;
  var jump_flag=0;
  var game_running=0;
  var player_flag=0; // 0 for human and 1 for AI
  var inside_information=0;
  var random_weights_flag=0;
  var inside_player=0;
  var inside_AI=0;
  var duck_flag=0;



// These weights and bias have been calcuated by various observations as the weights that wil bring out best of NN fastest//
  var w1=-0.258758212 //weight altered so modifies itself while jumping
  var w2=1.316306957
  var b=0.3296589
  var w3=-0.947508131656
  var w4=2.2871748221790544
  var b1=1.326170266108291

  var action_status='';

  const dino={
    x:10,
    y:canvas.height-100,
    w:90,
    h:100,
    gravity:0.25,
    speed:0,
    animation:[
      {s_x:0,s_y:0},
      {s_x:0,s_y:0},
      {s_x:0,s_y:0},
    ],
    frame:0,
    draw: function()
    {
      let dino=this.animation[this.frame]
      var distance=0
      c.fillStyle='Transparent',
      c.fillRect(this.x,this.y,this.w,this.h)

      if (duck_flag==1)
      {
        if (this.frame==1)
        {
          distance=2202;
        }
        else if(this.frame==2)
        {
          distance=2319;
        }
        else {
          distance=2202;
        }
        c.drawImage(sprite,dino.s_x+distance,dino.s_y,dino.s_x+116,dino.s_y+94,this.x,342.25+10,this.w,94);
      }
      else {
        if (this.frame==1)
        {
          distance=179
        }
        else if(this.frame==2)
        {
          distance=267
        }
        c.drawImage(player_sprite,dino.s_x+distance,dino.s_y,dino.s_x+85,dino.s_y+94,this.x,this.y+10,this.w,94);
      }

    },
    jump: function(){
      if (this.y==342.25)
      {
        this.speed=-7
        jump_flag=1;
        duck_flag=0;
        setTimeout(function(){jump_flag=0},1500)
      }

    },
    duck: function(){
      //c.drawImage(player_sprite,150,150+85,150+94,10,this.y+10,this.w,94);
      if(this.h==100 && this.y==342.25)
      { jump_flag=0;
        duck_flag=1
        this.h=this.h-120;
        this.y=this.y+100;
        setTimeout(function(){duck_flag=0},900)
      }
    },
    update:function(){
      this.period=5;
      this.frame+=f%this.period==0?1:0;
      this.frame=this.frame%this.animation.length
      this.speed+=this.gravity;
      this.y+=this.speed;
      this.h+=1.5;
      if(this.y+this.h/2>=canvas.height-95-background.h)
      {
        this.y=canvas.height-background.h-95-this.h/2;
        this.speed=0
      }
      if(this.h>=100)
      {
        this.h=100;
      }

      if (player_flag==0)
      {
        //prediction of actions
        z=w1*(cactus_opponenet_1.x/100)+w2*(cactus_opponenet_1.dx/10)+b; //for jump using neural network adjustments;
        z1=w3*(bird_opponenet_2.x/100)+w4*(bird_opponenet_2.dx/10)+b1; //for duck using neural network adjustments;
        if (sigmoid(z)>=0.55 || sigmoid(z1)>=0.55)
        {
          if(sigmoid(z)>sigmoid(z1))
          {
            dino.jump();
            action_status='jump'
          }
          else {
            dino.duck();
            action_status='duck'
          }
        }
        else {
          action_status='Nothing'
        }


      }
      if(this.x+this.w-20>cactus_opponenet_1.x && this.x-this.w<cactus_opponenet_1.x-cactus_opponenet_1.w && this.y+this.h>395)
      {
        collision_flag=1;
        jump_modification=1;
        cactus_opponenet_1.reset();
        bird_opponenet_2.reset();
        score.reset();
      }
      if(this.x+this.w>bird_opponenet_2.x && this.x-this.w<bird_opponenet_2.x-bird_opponenet_2.w && bird_opponenet_2.y+bird_opponenet_2.h>this.y)
      {
        collision_flag=1;
        if(jump_flag==1)
        {
          jump_modification=1;
        }
        else
        {
          jump_modification=0;
        }
        cactus_opponenet_1.reset();
        bird_opponenet_2.reset();
        score.reset();

      }
    },
  }
  const score={
    best: parseInt(localStorage.getItem('best'))||0,
    value:0,
    tracker:0,
    draw: function()
    {
      c.fillStyle='#FFF';
      c.strokeStyle='#000';
      c.lineWidth = 2;
      c.font = "35px Teko";
      c.fillText(this.value,canvas.width-100,50);
      c.strokeText(this.value,canvas.width-100,50);
      c.fillText('Hi: '+this.best,canvas.width-300,50);
      c.strokeText('Hi: '+this.best,canvas.width-300,50);
      if (player_flag==0)
      {

        //here to display the new canvas for the modification of neural network
        const canvas_Neural_Network=document.getElementById('canvas_NN')
        canvas_Neural_Network.style.display='block'


        //write the weights and bias and dynamically modify them.
        c_Neural_Network.fillStyle='#FFF';
        c_Neural_Network.strokeStyle='#000';
        c_Neural_Network.lineWidth = 2;
        c_Neural_Network.font = "25px Teko";
        //cactus display
        c_Neural_Network.strokeText('w1: '+w1,canvas_Neural_Network.width-600,30);
        c_Neural_Network.strokeText('w2: '+w2,canvas_Neural_Network.width-600,60);
        c_Neural_Network.strokeText('b1: '+b,canvas_Neural_Network.width-600,90);
        c_Neural_Network.strokeText('xc:  '+cactus_opponenet_1.x,canvas_Neural_Network.width-320,30)
        c_Neural_Network.strokeText('dxc:  '+cactus_opponenet_1.dx,canvas_Neural_Network.width-320,60)
        //bird display
        c_Neural_Network.strokeText('w3: '+w3,canvas_Neural_Network.width-600,150);
        c_Neural_Network.strokeText('w4: '+w4,canvas_Neural_Network.width-600,180);
        c_Neural_Network.strokeText('b2:  '+b1,canvas_Neural_Network.width-600,210);
        c_Neural_Network.strokeText('xb:  '+bird_opponenet_2.x,canvas_Neural_Network.width-320,150)
        c_Neural_Network.strokeText('dxb:  '+bird_opponenet_2.dx,canvas_Neural_Network.width-320,180)
        //how many gneration
        c_Neural_Network.fillText('Generation: '+generation,canvas_Neural_Network.width-1000,50);
        c_Neural_Network.strokeText('Generation: '+generation,canvas_Neural_Network.width-1000,50);
        c_Neural_Network.fillText('Times Played: '+generation,canvas_Neural_Network.width-1010,80);
        c_Neural_Network.strokeText('Times Played: '+(generation*81),canvas_Neural_Network.width-1010,80);
        //neurons and their connection establishemen
          //first layer
            //player position neurons always lit
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(80, 20, 15, 0,Math.PI*2,false);
        c_Neural_Network.fillStyle='RED'
        c_Neural_Network.fill();
        c_Neural_Network.moveTo(10,20);
        c_Neural_Network.lineTo(65,20);
        c_Neural_Network.stroke();
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(80, 20+35, 15, 0,Math.PI*2,false);
        c_Neural_Network.fillStyle='RED'
        c_Neural_Network.fill();
        c_Neural_Network.moveTo(10,20+35);
        c_Neural_Network.lineTo(65,20+35);
        c_Neural_Network.stroke();
          // cactus neurons
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(80, 20+35*2, 15, 0,Math.PI*2,false);
        if(cactus_opponenet_1.x<=1100)
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(10,20+35*2);
          c_Neural_Network.lineTo(65,20+35*2);
          c_Neural_Network.moveTo(10,20+35*3);
          c_Neural_Network.lineTo(65,20+35*3);
        }
        c_Neural_Network.stroke();
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(80, 20+35*3, 15, 0,Math.PI*2,false);
        if(cactus_opponenet_1.x<=1100)
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
        }
        c_Neural_Network.stroke();
        // Birds  neurons
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(80, 20+35*4, 15, 0,Math.PI*2,false);
        if(bird_opponenet_2.x<=1100)
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(10,20+35*4);
          c_Neural_Network.lineTo(65,20+35*4);
          c_Neural_Network.moveTo(10,20+35*5);
          c_Neural_Network.lineTo(65,20+35*5);
        }
        c_Neural_Network.stroke();
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(80, 20+35*5, 15, 0,Math.PI*2,false);
        if(bird_opponenet_2.x<=1100)
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
        }
        c_Neural_Network.stroke();
        //second layer
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(160, 40, 15, 0,Math.PI*2,false);
        if(action_status=='jump')
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(175,40)
          c_Neural_Network.lineTo(235,50);
          c_Neural_Network.moveTo(175,40+45)
          c_Neural_Network.lineTo(235,50);
        }
        c_Neural_Network.stroke();
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(160, 40+45, 15, 0,Math.PI*2,false);
        if(cactus_opponenet_1.x<=800)
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(95,20)
          c_Neural_Network.lineTo(145,40+45);
          c_Neural_Network.lineTo(145,40+45);
          c_Neural_Network.moveTo(95,20+35)
          c_Neural_Network.lineTo(145,40+45);
          c_Neural_Network.moveTo(95,20+35*2)
          c_Neural_Network.lineTo(145,40+45);
          c_Neural_Network.moveTo(95,20+35*3)
          c_Neural_Network.lineTo(145,40+45);
        }
        c_Neural_Network.stroke();
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(160, 40+45*2, 15, 0,Math.PI*2,false);
        if(action_status=='duck')
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(175,40+45*2)
          c_Neural_Network.lineTo(235,50+55*2);
          c_Neural_Network.moveTo(175,40+45*3)
          c_Neural_Network.lineTo(235,50+55*2);
        }

        c_Neural_Network.stroke();
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(160, 40+45*3, 15, 0,Math.PI*2,false);
        if(bird_opponenet_2.x<=800)
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(95,20)
          c_Neural_Network.lineTo(145,40+45*3);
          c_Neural_Network.moveTo(95,20+35)
          c_Neural_Network.lineTo(145,40+45*3);
          c_Neural_Network.moveTo(95,20+35*4)
          c_Neural_Network.lineTo(145,40+45*3);
          c_Neural_Network.moveTo(95,20+35*5)
          c_Neural_Network.lineTo(145,40+45*3);
          c_Neural_Network.moveTo(95,20+35)
          c_Neural_Network.lineTo(145,40+45*3);
        }
        c_Neural_Network.stroke();
        //3rd Layer
          //jump neuron
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(250, 50, 15, 0,Math.PI*2,false);
        if(action_status=='jump')
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.strokeText('Action: '+action_status,275,50);
        }
        c_Neural_Network.stroke();
        c_Neural_Network.stroke();

          //do nothing neuron
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(250, 50+55, 15, 0,Math.PI*2,false);
        if(action_status=='Nothing')
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.moveTo(175,40)
          c_Neural_Network.lineTo(235,50+55);
          c_Neural_Network.moveTo(175,40+45*3)
          c_Neural_Network.lineTo(235,50+55);
          c_Neural_Network.moveTo(175,40+45)
          c_Neural_Network.lineTo(235,50+55);
          c_Neural_Network.moveTo(175,40+45*2)
          c_Neural_Network.lineTo(235,50+55);

          c_Neural_Network.strokeText('Action: '+action_status,275,50+55);

        }
        c_Neural_Network.stroke();
          // duck neuron
        c_Neural_Network.beginPath();
        c_Neural_Network.arc(250, 50+55*2, 15, 0,Math.PI*2,false);
        if(action_status=='duck')
        {
          c_Neural_Network.fillStyle='RED'
          c_Neural_Network.fill();
          c_Neural_Network.strokeText('Action: '+action_status,275,50+55*2);

        }
        console.log(this.tracker)
        if(this.value>=60)
        {
              c_Neural_Network.strokeText('cactus_velocity:            '+Math.floor(cactus_opponenet_1.dx),515,120)
              if(hover_flag_decrease_first==1)
              {
                c_Neural_Network.drawImage(decrease_hover,680,90,50,50);
              }
              else {
                c_Neural_Network.drawImage(decrease,680,90,50,50);

              }
              if(hover_flag_increase_first==1)
              {

                c_Neural_Network.drawImage(increase_hover,790,90,50,50);
              }
              else {
                c_Neural_Network.drawImage(increase,790,90,50,50);
              }
        }
        if(this.tracker>=40)
        {
              c_Neural_Network.strokeText('bird_velocity:             '+Math.floor(bird_opponenet_2.dx),530,180)
              if(hover_flag_decrease_second==1)
              {
                  c_Neural_Network.drawImage(decrease_hover,680,150,50,50);
              }
              else {
                c_Neural_Network.drawImage(decrease,680,150,50,50);
              }
              if(hover_flag_increase_second==1)
              {
                c_Neural_Network.drawImage(increase_hover,790,150,50,50);
              }
              else {
                c_Neural_Network.drawImage(increase,790,150,50,50);
              }
        }
        c_Neural_Network.stroke();
        //
      }
    },
    reset: function()
    {
      this.value=0;
    }

  }
  //score part hover button
  canvas_Neural_Network.addEventListener('mousemove',function(event)
  {
    let rect = canvas_Neural_Network.getBoundingClientRect();
    let hoverx=event.clientX-rect.left;
    let hovery=event.clientY-rect.top;

    if(hoverx>=680&&hoverx<=680+50&&hovery>=90&&hovery<=90+50)
    {
      hover_flag_decrease_first=1;
    }
    else if(hoverx>=790&&hoverx<=790+50&&hovery>=90&&hovery<=90+50)
    {
      hover_flag_increase_first=1;
    }
    else if(hoverx>=680&&hoverx<=680+50&&hovery>=150&&hovery<=150+50)
    {
      hover_flag_decrease_second=1;
    }
    else if(hoverx>=790&&hoverx<=790+50&&hovery>=150&&hovery<=150+50)
    {
      hover_flag_increase_second=1;
    }
    else {
      hover_flag_decrease_first=0;
      hover_flag_decrease_second=0;
      hover_flag_increase_first=0;
      hover_flag_increase_second=0;
    }
  })
  canvas_Neural_Network.addEventListener('click',function(event){
    let rect = canvas_Neural_Network.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;
    if(clickX>=680&&clickX<=680+50&&clickY>=90&&clickY<=90+50)
    {
      console.log("pressed here decrease cactus")
      cactus_opponenet_1.dx-=1;
      if (cactus_opponenet_1.dx<5)
      {
        cactus_opponenet_1.dx=5;
      }
    }
    else if(clickX>=790&&clickX<=790+50&&clickY>=90&&clickY<=90+50)
    {
      console.log("pressed here increase cactus")
      cactus_opponenet_1.dx+=1;
    }
    else if(clickX>=680&&clickX<=680+50&&clickY>=150&&clickY<=150+50)
    {
      console.log("pressed here decrease bird")
      bird_opponenet_2.dx-=1;
      if (bird_opponenet_2.dx<5)
      {
        bird_opponenet_2.dx=5;
      }

    }
    else if(clickX>=790&&clickX<=790+50&&clickY>=150&&clickY<=150+50)
    {
      console.log("pressed here increase bird")
      bird_opponenet_2.dx+=1;
    }
  })
  window.addEventListener('keydown',function(event){
    if (player_flag==1)
    {
      const key=event.key;
      switch (event.key) {
          case "ArrowUp":
              // Space pressed
              dino.jump();
              break;
          case "ArrowDown":
              // Down pressed
              dino.duck();
              break;
            }
    }
  })

  //opponenet 1 object for ground obstacles:
  const cactus_opponenet_1={
    x:1300+Math.random()*(1220),
    y:canvas.height-198,
    w: 60+Math.random()*10,
    h: 150,
    dx:5,
    draw: function(){
      c.fillStyle='Transparent'
      c.fillRect(this.x,this.y,this.w,this.h);
      c.drawImage(cactus_sprite,this.x,this.y,this.w,this.h-100);
      c.drawImage(cactus_sprite,this.x,this.y+50,this.w,this.h-100);
      c.drawImage(cactus_sprite,this.x,this.y+100,this.w,this.h-50);
    },
    update: function(){
      this.x=(this.x-this.dx)
      if (this.x<-100)
      {
        this.x=1300+Math.random()*(1000)
        this.dx=this.dx+Math.random()*(0.9)
        score.value+=10;
        score.best=Math.max(score.value,score.best);
        //score.best=0; //reset score here
        localStorage.setItem('best',score.best)
        if (this.dx>=21)
        {
          this.dx=this.dx-Math.random()*(10)
        }
      }
    },
    reset: function(){
      this.x=1500+Math.random()*(1020);
      this.dx=5;
      //jump_modification=0;
    }
  }

  const bird_opponenet_2={
    x:2500+Math.random()*(1020),
    y: (canvas.height-300)+Math.random()*(20)+2,
    w: 60+Math.random()*10,
    h: 60,
    dx:5,
    animation:[
      {s_x:0,s_y:0},
      {s_x:0,s_y:0},
    ],
    frame:0,
    //drawing bird
    draw: function(){
      let dino=this.animation[this.frame]
      var distance=0
      if (this.frame==0)
      {
        distance=261
      }
      else if(this.frame==1)
      {
        distance=354
      }
      c.fillStyle='Transparent'
      c.fillRect(this.x,this.y,this.w,this.h)
      c.drawImage(sprite,dino.s_x+distance,dino.s_y,dino.s_x+85,dino.s_y+94,this.x,this.y+10,this.w,94);

    },
    //updating bird
    update: function(){

      this.period=10;
      this.frame+=f%this.period==0?1:0;
      this.frame=this.frame%this.animation.length
      this.x=(this.x-this.dx)
      if (this.x<-100)
      {
        this.x=1300+Math.random()*(1020)
        this.dx=this.dx+Math.random()*(0.9)
        score.value+=10;
        score.tracker+=10;
        score.best=Math.max(score.value,score.best);
        //score.best=0; //reset score here
        localStorage.setItem('best',score.best)
        if (this.dx>=21)
        {
          this.dx=this.dx-Math.random()*(10)
        }
      }
    },
    reset: function(){
      this.x=2500+Math.random()*(1020);
      this.dx=5;
    }

  }


  const background={
    x:0,
    y:canvas.height-212,
    w: 1024,
    h: 112,
    dx:5,
    x1:1200,
    draw: function(){
      const background_image=new Image();
      background_image.src='./Assets/Background.png';
      c.drawImage(background_image,this.x,this.y,this.w,this.h)
      c.drawImage(background_image,this.x+this.w,this.y,this.w,this.h)
      const background_image_cloud=new Image();
      background_image_cloud.src='./Assets/Cloud.png';
      c.drawImage(background_image_cloud,this.x1,this.y-300,this.w-800,this.h);
    },
    update:function(){
      this.x=(this.x-this.dx)%(this.w/2)
      this.x1=(this.x1-this.dx)
      if (this.x1<-500)
      {
        this.x1=1224;
      }
    }
  }
  function animate()
  {
    background.update();
    if ((score.value>=0 &&score.value<=30) || (score.value>=100 && score.value<=300) ||(score.value>400))
    {
      if(score.value>400)
      {
        if(Math.floor(score.value/10)%2==0)
        {
          cactus_opponenet_1.update();
        }
        else if (Math.floor(score.value/10)%2!=0)
        {
          bird_opponenet_2.update();
        }
      }
      else
      {
        bird_opponenet_2.update();
      }
    }
    if ((score.value>30 && score.value<100) || (score.value>300 && score.value<=400))
    {
      cactus_opponenet_1.update();
    }
    dino.update();

  }

  function draw()
  {
    c.fillStyle='#fff';
    c.fillRect(0,0,canvas.width,canvas.height);
    c_Neural_Network.fillStyle='#fff';
    c_Neural_Network.fillRect(0,0,canvas_Neural_Network.width,canvas_Neural_Network.height);
    background.draw();
    cactus_opponenet_1.draw();
    bird_opponenet_2.draw();
    dino.draw();
    score.draw();

  }
  function sigmoid(x){ //get value in between 0 and 1 also known as quantization
    var z=1/(1+Math.exp(-x));
    return z;
  }

  function game()
  {
    game_running=1;
    draw();
    animate();
    f+=1
    var id=requestAnimationFrame(game);
    if (collision_flag==1)
    {
      window.cancelAnimationFrame(id);
      if (player_flag==0)
      {
        //here for display of NN in canvas and AI play
        NeuralNetwork(jump_modification);
      }
      else
      {
        setTimeout(function(){location.reload()},1000)
      }
    }
  }
  function NeuralNetwork(jump_modification)
  {

    generation+=1;
    dataset=[
      [1727.94,5,0],[1417.94,5,0],
      [1112.94,5,0],[797.94,5,0],
      [512.94,5,0],[162.94,5,1],
      [195.67,5,1],[221.87,5,1],
      [114.45,5,1],[127.31,5,1],
      [110.4,5,0],[108.36,5,0],
      [104.4,5,1],[183.36,5,1],
      [286.08,5,0],[314.03,5,0],
      [245.15,5,1],[314.68,10,1],
      [276.91,10,1],[341.72,10,1],
      [590.42,10,1],[1241.03,10,0],
      [671.033,10,0],[1763.16,10,0],
      [1123,10,0],[119.49,10,1],
      [121.61,10,1],[104.36,10,1],
      [104.34,10,0],[103.10,10,0],
      [102.10,10,0],[100.36,10,0],
      [1851.88,15,0],[921.88,15,0],
      [1359.360,15,0],[339.36,15,1],
      [598.123,15,1],[760.884,15,1],
      [1659.4,15,0],[686.36,15,1],
      [339.06,15,1],[1251.436,15,0],
      [190.04,15,1],[155.83,15,1],
      [104.01,15,1],[103.01,15,0],
      [102.04,15,0],[100.83,15,0]
    ]

    dataset_1=[
      [1622.94,5,0],[114.302,5,1],
      [634.30,5,0],[229.30,5,0],
      [2448.394,5,0],[2148.94,5,0],
      [1985.67,5,0],[281.92,5,0],
      [170.44,5,1],[185.05,5,0],
      [144.96,5,0],[142.52,5,1],
      [134.55,5,1],[116.18,5,1],
      [199.71,5,1],[109.84,5,1],
      [126.15,5,1],[132.68,5,1],
      //5 velocity for duck till here
      [2849.91,10,0],[1999.72,10,0],
      [1129.42,10,0],[479.653,10,0],
      [1169.901,10,0],[849.90,10,0],
      [600.318,10,0],[264.816,10,1],
      [149.61,10,1],[134.478,10,1],
      [268.9,10,0],[170.5045,10,1],
      [128.10,10,1],[387.47,10,1],
      [131.88,10,1],[136.25,10,1],
      [154.17,10,1],[211.316,10,1],
      [118.374,10,1],[310.38,10,0],
      [537.4,10,0],[404.19,10,0],
      [376.06,10,1],
       //10 velocity for duck till here
      [492.26,15,0],[419.70,15,1],
      [299.93,15,1],[214.55,15,1],
      [171.04,15,1],[160.83,15,1],
      [110.16,15,1],[2150.83,15,0],
      [1100.01,15,0],[770.01,15,0],
      [665.30,15,1],[2597.83,15,0],
      [1232.04,15,0],[802.83,15,0],
      [532.14,15,0],[704.62,15,0],
      [591.04,15,1],[855.83,15,0],
      [175.01,15,1],[210.78,15,1],
      [273.64,15,1],[358.50,15,1],
      [320.36,15,1],[379.99,15,1],
      [238.02,15,1],[451.764,15,1],
      [443.40,15,1],[381.01,15,1]
      //15 velocity for duck till here
    ]

    //have all of these in single neural network funciton it will be better
    function sigmoid(x){ //get value in between 0 and 1 also known as quantization
      var z=1/(1+Math.exp(-x));
      return z;
    }

    function sigmoid_differential(x){//getting the differential to adjust the new wait in any way
      var z=sigmoid(x)*(1-sigmoid(x))
      return z;
    }

    function cost(pred,tar){ //cost function basically acts as the function that helps determine how much off the predicted value is from the real value
      var z=(pred-tar)*(pred-tar);
      return z;
    }

    function cost_differential(pred,tar){ //this gives the slope of the cost function as tangent of sorts which will help us understand which direction or in which status the current prediction is either the value is to be incerased or decreased
      var h=0.001
      var z=(cost(pred+h,tar)-cost(pred,tar))/h //differentiation of two cost function usng elementery differentiation formula
      return z;
    }

    for (var iteration=0;iteration<=80;iteration++)
    {
      var r_i=Math.floor(Math.random()*dataset.length);
      if(jump_modification==1)
      {
        var points=dataset[r_i]
        points[0]=points[0]/100;
        points[1]=points[1]/10;
        var z=points[0]*w1+points[1]*w2+b
        var pred=sigmoid(z);
        var tar=points[2];
        var slope_cost=cost_differential(pred,tar);
        var slope_prediction=sigmoid_differential(z);
        w1=w1-0.25*slope_cost*slope_prediction*points[0]; //backpropagation and self adjusting of the weight with assigned incoming variable
        w2=w2-0.25*slope_cost*slope_prediction*points[1];//backpropagation and self adjusting of the weight with assigned incoming variable
        b=b-0.25*slope_cost*slope_prediction;//backpropagation and self adjusting of the bias
      }
      else {
        var points_1=dataset_1[r_i]
        points_1[0]=points_1[0]/100;
        points_1[1]=points_1[1]/10;
        var z1=points_1[0]*w3+points_1[1]*w4+b;
        var pred1=sigmoid(z1)
        var tar1=points_1[2];
        var slope_cost1=cost_differential(pred1,tar1)
        var slope_prediction1=sigmoid_differential(z1)
        w3=w3-0.25*slope_cost1*slope_prediction1*points_1[0];
        w4=w4-0.25*slope_cost1*slope_prediction1*points_1[1];
        b1=b1-0.25*slope_cost1*slope_prediction1;

      }
    }
    //stopping condition for no overtrainning tested data.
    if(w1<=-0.60464)
    {
      w1=-0.60464
    }
    if(w2>=2.114)
    {
      w2=2.114
    }
    if(b<=-0.209)
    {
      b=-0.209
    }

    if(w3<=-0.99)
    {
      w3=-1.0347037057577537
    }
    if(w3>=-0.20)
    {
      w3=-0.65
    }
    if(w4>=2.28)
    {
      w4=2.2871748
    }
    if(b1>=1.32)
    {
      b1=1.326170266
    }

    collision_flag=0
    //there is a glitch with this timer thing i need to work on it
    setTimeout(function(){game()},3500);
  }
  function Main_Menu() //last task to do is to make this main menu page as interesting as possible.
  {
    const player_start=new Image();
    player_start.src='./Assets/startbtn.png'

    const aI_start=new Image();
    aI_start.src='./Assets/startbtn 1.png'

    const information=new Image();
    information.src='./Assets/startbtn 3.png'



    const logo=new Image();
    logo.src='./Assets/logo.png'

    c.clearRect(0,0,canvas.width,canvas.height)
    c.fillStyle='Black';
    c.fillRect(15,40,410,470)


    c.beginPath();
    c.lineWidth = 8;
    c.moveTo(15+420,40);
    c.lineTo(15+420,510);
    c.stroke();

    c.beginPath();
    c.moveTo(8,40);
    c.lineTo(8,510);
    c.stroke();

    c.beginPath();
    c.moveTo(10,520);
    c.lineTo(430,520);
    c.stroke();

    c.beginPath();
    c.moveTo(10,30);
    c.lineTo(430,30);
    c.stroke();
    /*
    //buttom animation maybe
    c.beginPath();
    c.lineWidth=2;
    c.arc(60, 565, 10, 0,Math.PI*2,false);
    //c.fillStyle='RED'
    c.stroke();

    c.beginPath();
    c.arc(60, 540, 10, 0,Math.PI*2,false);
    //c.fillStyle='RED'
    c.stroke();

    c.beginPath();
    c.arc(60, 590, 10, 0,Math.PI*2,false);
    //c.fillStyle='RED'
    c.stroke();
*/

    const startBtn = {
        x : 15,
        y : 45,
        w : 400,
        h : 100,
        draw: function(){
          player_start.onload=function()
          {
            c.drawImage(player_start,15,45,400,100)
          }
        }
    }
    const aIStartBtn={
      x : 15,
      y : 200,
      w : 400,
      h : 100,
      draw: function(){
        aI_start.onload=function(){
          c.drawImage(aI_start,15,200,400,100)
        }
      }
    }
    const  third_button={
      x: 15,
      y: 360,
      w: 400,
      h: 100,
      draw: function(){
        information.onload=function(){
          c.drawImage(information,15,360,400,100)
        }
      }
    }

    const forth_button={
      x: 550,
      y: 400,
      w: 200,
      h: 100
    }

    const fifth_button={
      x: 850,
      y: 400,
      w: 200,
      h: 100
    }
    startBtn.draw();
    aIStartBtn.draw();
    third_button.draw();
    logo.onload=function()
    {
      c.drawImage(logo,550,50,500,500);
    }

// all of the hover mechanics are present here.
    canvas.addEventListener('mousemove',function(event)
    {
      let rect = canvas.getBoundingClientRect();
      let hoverx=event.clientX-rect.left;
      let hovery=event.clientY-rect.top;
      //var state_flag=0
      if (game_running==0)
      {
        if(hoverx >= startBtn.x && hoverx <= startBtn.x + startBtn.w && hovery >= startBtn.y && hovery <= startBtn.y + startBtn.h)
        {
          const player_start_hover=new Image();
          player_start_hover.src='./Assets/startbtnhvr.png'
          player_start_hover.onload=function()
          {
            c.drawImage(player_start_hover,15,45,400,100)
          }
        }
        else if(hoverx >= aIStartBtn.x && hoverx <= aIStartBtn.x + aIStartBtn.w && hovery >= aIStartBtn.y && hovery <= aIStartBtn.y + aIStartBtn.h){
          const player_start_hover=new Image();
          player_start_hover.src='./Assets/startbtn 1hover (2).png'
          player_start_hover.onload=function()
          {
            c.drawImage(player_start_hover,15,200,400,100)
          }
        }
        else if(hoverx >= third_button.x && hoverx <= third_button.x + third_button.w && hovery >= third_button.y && hovery <= third_button.y + third_button.h)
        {
          const player_start_hover=new Image();
          player_start_hover.src='./Assets/startbtn 3hover.png'
          player_start_hover.onload=function()
          {
            c.drawImage(player_start_hover,15,360,400,100)
          }
        }
        else
        {
          const player_start=new Image();
          player_start.src='./Assets/startbtn.png'

          const aI_start=new Image();
          aI_start.src='./Assets/startbtn 1.png'

          const information=new Image();
          information.src='./Assets/startbtn 3.png'


          player_start.onload=function()
          {
            c.drawImage(player_start,15,45,400,100)
          }

          aI_start.onload=function(){
            c.drawImage(aI_start,15,200,400,100)
          }
          information.onload=function(){
            c.drawImage(information,15,360,400,100)
          }

        }
        if (inside_information==1)
        {
          if(hoverx >= forth_button.x && hoverx <= forth_button.x + forth_button.w && hovery >= forth_button.y && hovery <= forth_button.y + forth_button.h)
          {
            const player_start_hover=new Image();
            player_start_hover.src='./Assets/Random_Weights_Hover.png'
            player_start_hover.onload=function()
            {
              c.drawImage(player_start_hover,forth_button.x,forth_button.y,forth_button.w,forth_button.h)
            }
          }
          else if(hoverx >= fifth_button.x && hoverx <= fifth_button.x + fifth_button.w && hovery >= fifth_button.y && hovery <= fifth_button.y + fifth_button.h)
          {
            const player_start_hover=new Image();
            player_start_hover.src='./Assets/Initial_Weights_hover.png'
            player_start_hover.onload=function()
            {
              c.drawImage(player_start_hover,fifth_button.x,fifth_button.y,fifth_button.w,fifth_button.h)
            }
          }

          else
          {
            const random_weights=new Image();
            random_weights.src='./Assets/Random_Weights.png'

            const initial_weights=new Image();
            initial_weights.src='./Assets/Initial_Weights.png'

            random_weights.onload=function(){
              c.drawImage(random_weights,forth_button.x,forth_button.y,forth_button.w,forth_button.h)
            }
            initial_weights.onload=function(){
              c.drawImage(initial_weights,fifth_button.x,fifth_button.y,fifth_button.w,fifth_button.h)
            }
          }
        }
        if (inside_player==1 || inside_AI==1)
        {
          if(hoverx >= forth_button.x && hoverx <= forth_button.x + forth_button.w && hovery >= forth_button.y && hovery <= forth_button.y + forth_button.h)
          {
            const player_start_hover=new Image();
            player_start_hover.src='./Assets/final_button_hover.png'
            player_start_hover.onload=function()
            {
              c.drawImage(player_start_hover,forth_button.x,forth_button.y,forth_button.w,forth_button.h)
            }
          }
          else
          {
            const begin=new Image();
            begin.src='./Assets/final_button.png'

            begin.onload=function(){
              c.drawImage(begin,forth_button.x,forth_button.y,forth_button.w,forth_button.h)
            }
          }
        }
      }

    })

// all of the click and transition mechanism is here.
    canvas.addEventListener('click',function(event)
    {
          let rect = canvas.getBoundingClientRect();
          let clickX = event.clientX - rect.left;
          let clickY = event.clientY - rect.top;
          if (game_running==0)
          {
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
              player_flag=1
              const player_information=new Image();
              player_information.src='./Assets/player_information.png'

              const begin=new Image();
              begin.src='./Assets/final_button.png'
              var i=0;
              player_information.onload=function transition()
              {
                  var id=requestAnimationFrame(transition)
                  c.fillStyle='White';
                  var x=1500-i
                  c.fillRect(x-10,50,canvas.width,canvas.height)
                  c.drawImage(player_information,1500-i,50,500,400);
                  c.drawImage(begin,1500-i,400,200,100);
                  i=i+25;
                  if (x==550)
                  {
                    cancelAnimationFrame(id)
                  }
              }
              inside_player=1;
              inside_information=0;
              inside_AI=0;
            }
            else if(clickX >= aIStartBtn.x && clickX <= aIStartBtn.x + aIStartBtn.w && clickY >= aIStartBtn.y && clickY <= aIStartBtn.y + aIStartBtn.h){
              player_flag=0;
              const player_information=new Image();
              player_information.src='./Assets/AI_Information.png'

              const begin=new Image();
              begin.src='./Assets/final_button.png'
              var i=0;
              player_information.onload=function transition()
              {
                  var id=requestAnimationFrame(transition)
                  c.fillStyle='White';
                  var x=1500-i
                  c.fillRect(x-10,50,canvas.width,canvas.height)
                  c.drawImage(player_information,1500-i,50,500,400);
                  c.drawImage(begin,1500-i,400,200,100);
                  i=i+25;
                  if (x==550)
                  {
                    cancelAnimationFrame(id)
                  }
              }
              inside_player=0;
              inside_information=0;
              inside_AI=1;
            }
            else if(clickX >= third_button.x && clickX <= third_button.x + third_button.w && clickY >= third_button.y && clickY <= third_button.y + third_button.h)
            {

              const further_information=new Image();
              further_information.src='./Assets/further_information_info.png'

              const random_weights=new Image();
              random_weights.src='./Assets/Random_Weights.png'

              const initial_weights=new Image();
              initial_weights.src='./Assets/Initial_Weights.png'

              var i=0;
              further_information.onload=function transition()
              {
                  var id=requestAnimationFrame(transition)
                  c.fillStyle='White';
                  var x=1500-i
                  c.fillRect(x-10,50,canvas.width,canvas.height)
                  c.drawImage(further_information,1500-i,50,500,400);
                  c.drawImage(random_weights,1500-i,400,200,100);
                  c.drawImage(initial_weights,1800-i,400,200,100);
                  i=i+25;
                  if (x==550)
                  {
                    cancelAnimationFrame(id)
                  }
              }
              inside_information=1;
              inside_player=0;
              inside_AI=0;
            }
            if(inside_information==1)
            {
              if(clickX >= forth_button.x && clickX <= forth_button.x + forth_button.w && clickY >= forth_button.y && clickY <= forth_button.y + forth_button.h)
              {
              w1=Math.random(); //initialize random weight
              w2=Math.random();
              b=Math.random();//initialize random bias

              w3=Math.random(); //initialize random weight
              w4=Math.random();
              b1=Math.random();//initialize random bias
              inside_information=0
              }
              else if(clickX >= fifth_button.x && clickX <= fifth_button.x + fifth_button.w && clickY >= fifth_button.y && clickY <= fifth_button.y + fifth_button.h)
              {

                 w1=-0.258758212 //weight altered so modifies itself while jumping
                 w2=1.316306957
                 b=0.3296589
                 w3=-0.947508131656
                 w4=2.2871748221790544
                 b1=1.326170266108291
                 inside_information=0
              }
            }

            if(inside_player==1)
            {
              if(clickX >= forth_button.x && clickX <= forth_button.x + forth_button.w && clickY >= forth_button.y && clickY <= forth_button.y + forth_button.h)
              {
                game()
              }
            }
            if(inside_AI==1)
            {
              if(clickX >= forth_button.x && clickX <= forth_button.x + forth_button.w && clickY >= forth_button.y && clickY <= forth_button.y + forth_button.h)
              {
                game()
              }
            }
            else {
              console.log('Clicked Somewhere else')
            }
          }
    })
  }
  Main_Menu();
}

game_play();
