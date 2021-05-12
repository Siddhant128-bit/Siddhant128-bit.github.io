var canvas=document.querySelector('canvas');
canvas.width=0.98*window.innerWidth;
canvas.height=0.90*window.innerHeight;
var score=0;
var c=canvas.getContext('2d');
const position_y=canvas.height-295;
var position_x=(canvas.width/2)-25;
var flag=0
var random_position_1=0
var random_position_2=0
var id=null;
localStorage.setItem('high_score',0);
var high_score=localStorage.getItem('high_score');
function begin_game()
{
//  c.clearRect(0,0,canvas.width,canvas.height);
  this.y=0
  this.opponenet_x1=0
  this.opponenet_x2=0

  this.animation=function(){
    id=requestAnimationFrame(animation);
    c.beginPath();
    c.clearRect(0,0,canvas.width,canvas.height);
    const img = new Image();
    img.src='./assets/background-1_0.png';

    const img2= new Image();
    img2.src='./assets/opponent_car.png'

    c.fillStyle='transparent'
    c.fillRect(0,this.y,canvas.width/3,canvas.height);
    c.drawImage(img,0,this.y,canvas.width/3,canvas.height);

    c.fillStyle='transparent'
    c.fillRect(0,-canvas.height+this.y,canvas.width/3,canvas.height);
    c.drawImage(img,0,-canvas.height+this.y,canvas.width/3,canvas.height);

    c.fillStyle='transparent'
    c.fillRect(0+canvas.width/3,this.y,canvas.width/3,canvas.height);
    c.drawImage(img,0+canvas.width/3,this.y,canvas.width/3,canvas.height);
    c.fillRect(0+canvas.width/3,-canvas.height+this.y,canvas.width/3,canvas.height)
    c.drawImage(img,0+canvas.width/3,-canvas.height+this.y,canvas.width/3,canvas.height);


    c.fillStyle='transparent'
    c.fillRect(0+2*canvas.width/3,this.y,canvas.width/3,canvas.height);
    c.drawImage(img,0+2*canvas.width/3,this.y,canvas.width/3,canvas.height);
    c.fillRect(0+2*canvas.width/3,-canvas.height+this.y,canvas.width/3,canvas.height)
    c.drawImage(img,0+2*canvas.width/3,-canvas.height+this.y,canvas.width/3,canvas.height);


    //opponenet 1
    c.fillStyle='transparent'
    c.fillRect(random_position_1,this.y,120,250);
    c.drawImage(img2,random_position_1,this.y,120,250);

    //opponnent 2
    c.fillStyle='transparent'
    c.fillRect(2850,this.y,120,250)
    c.drawImage(img2,2850,this.y,120,250);


    c.stroke();
    this.y=this.y+25;
    if (this.y>=canvas.height)
    {
      this.y=0
      random_position_1=Math.floor(Math.random()*3)
      random_position_2=Math.floor(Math.random()*3)
      score=score+2;
      score_element=document.getElementById('score').textContent="Score: "+score
      highscore_element=document.getElementById('highscore').textContent="highscore: "+high_score;
      switch (random_position_1)
      {
        case 1:
          random_position_1=position_x;
          break;

        case 2:
          random_position_1=position_x+canvas.width/3
          break;

        case 3:
          random_position_1=position_x-canvas.width/2;
          break;
      }
      switch (random_position_2)
      {
        case 1:
          random_position_2=position_x;
          break;

        case 2:
          random_position_2=position_x+canvas.width/3
          break;

        case 3:
          random_position_2=canvas.width/2;
          break;
      }
    }

    this.check_collision=function(){
      if ((Math.abs(position_x-random_position_1)<=60 && Math.abs(position_y-y)<=25))
      {
        if (high_score<=score)
        {
          high_score=score;
          localStorage.setItem('high_score',high_score);
          high_score=localStorage.getItem('high_score');
          console.log('New High Score')
          console.log(high_score)
        }

        cancelAnimationFrame(id);
        Main_Menu();

      }


    }

    this.player=function(){
      c.beginPath();
      const img1= new Image();
      img1.src='./assets/Player_Car.png'
      c.fillStyle='transparent'
      c.fillRect(position_x,position_y,250,250);
      c.drawImage(img1,position_x,position_y,250,250);
      c.stroke();
      if (flag==1)
      {
        position_x=position_x-canvas.width/3;
        flag=3;
      }
      if (flag==2)
      {
        position_x=position_x+canvas.width/3;
        flag=3;
      }



      if (position_x<=0)
      {
        position_x=position_x+canvas.width/3;
      }
      else if(position_x>canvas.width)
      {
        position_x=position_x-canvas.width/3;
      }

      window.addEventListener('keydown',function(event)
      {
        const key=event.key;
        switch (event.key) {
            case "ArrowLeft":
                flag=1
                break;
            case "ArrowRight":
                flag=2
                break;
        }
      })
    }

    character_hero=new player;
    see_collison= new check_collision;
  }

  animation()
}



function Main_Menu(){
  score=0;
  score_element=document.getElementById('score').textContent="Score: "+score
  highscore_element=document.getElementById('highscore').textContent="highscore: "+high_score;
  c.clearRect(0,0,canvas.width,canvas.height)
  c.beginPath();
  const img = new Image();
  img.src='./assets/Main_Menu.png';
  img.onload=function(){
    c.drawImage(img,innerWidth/4,innerHeight/10,innerWidth/2,innerHeight/2);
  }
  c.stroke();
  this.button=function(){
    this.x=innerWidth/2;
    this.y=innerHeight/2+300;
    c.beginPath();
    c.arc(this.x,this.y,innerWidth/50,0,Math.PI*2,false);
    c.fillStyle='RED';
    c.fill();
    c.stroke();
    this.clicked_button=function(x,y)
    {
      const distance=((x-this.x)*(x-this.x))+((y-this.y)*(y-this.y));
      console.log(distance);
      if (distance<=40007)
      {
        begin_game()
      }
    }
  }

  button=new button;
}

Main_Menu();

window.addEventListener('keydown',function(event)
{
  const key=event.key;
  switch (event.key)
  {
    case "Enter":
        begin_game();
        break;
  }
})

window.addEventListener('click',function(event){
  const rect=canvas.getBoundingClientRect();
  const x=event.clientX-rect.left;
  const y=event.clientY-rect.top;
  button.clicked_button(x,y);
})
