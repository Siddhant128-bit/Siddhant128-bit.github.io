var canvas=document.querySelector('canvas');
canvas.width=0.98*window.innerWidth;
canvas.height=0.90*window.innerHeight;
var score=0;
var c=canvas.getContext('2d');

function rotate(vel,angle){
  const rotateVelocities={
    x: vel.x*Math.cos(angle)-vel.y*Math.sin(angle),
    y: vel.x*Math.sin(angle)+vel.y*Math.cos(angle)
  };
  return rotateVelocities;
}


function momentum_chnage_something_complex(x1,x2)
{
  const velocity_x_difference=x1.velocity.x-x2.velocity.x;
  const velocity_y_difference=x1.velocity.y-x2.velocity.y;
  const distance_x=x2.x-x1.x;
  const distance_y=x2.y-x1.y;

  if(velocity_x_difference*distance_x+velocity_y_difference*distance_y>=0)
  {
    const angle=-Math.atan2(x2.y-x1.y,x2.x-x1.x);
    const m1=x1.mass;
    const m2=x2.mass;
    const u1=rotate(x1.velocity,angle);
    const u2=rotate(x2.velocity,angle)
    const v1={x: u1.x*(m1-m2)/(m1+m2)+u2.x*2*m2/(m1+m2), y:u1.y}
    const v2={x: u2.x*(m1-m2)/(m1+m2)+u1.x*2*m2/(m1+m2), y:u2.y}
    const vFinal1=rotate(v1,-angle);
    const vFinal2=rotate(v2,-angle);
    x1.velocity.x=vFinal1.x;
    x1.velocity.y=vFinal1.y;
    x2.velocity.x=vFinal2.x;
    x2.velocity.y=vFinal2.y;

  }

}

function Circle(x,y,radius,color,mass){
  this.x=x;
  this.y=y;
  this.velocity={
    x: (Math.random()-0.5)*25,
    y: (Math.random()-0.5)*25
  };
  this.mass=mass;
  if (this.mass==0)
  {
    this.radius=20
    this.mass=1;
  }
  else if (this.mass==1)
  {
    this.radius=30
    this.mass=2;
  }
  else if (this.mass==2)
  {
    this.radius=40
    this.mass=3;
  }

  this.color=color;
  //console.log(this.color)
  this.draw=function(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.StrokeStyle='blue';
    c.fillStyle=this.color;
    c.fill();
    c.stroke();
  }

  this.clicked_button=function(a,b)
  {

    const distance=((a-this.x)*(a-this.x))+((b-this.y)*(b-this.y));
    console.log(distance)
    if (distance<=12277)
    {
      console.log('Pressed')
    //  this.x=-10000;
    //  this.y=-10000;
      return 1;
    }
    return 0;
  }


  this.distance=function(x1,y1,x2,y2)
  {
    const xDIst=x2-x1;
    const yDist=y2-y1;
    return Math.sqrt(Math.pow(xDIst,2)+Math.pow(yDist,2));
  }

  this.update=circleArray=>{
    this.draw();
    for (let i=0;i<circleArray.length;i++)
    {
      if (this===circleArray[i]) continue;
      if (this.distance(this.x,this.y,circleArray[i].x,circleArray[i].y)-this.radius*2<0)
      {
        momentum_chnage_something_complex(this,circleArray[i]);
      }
    }
    if(this.x+this.radius>canvas.width|| this.x-this.radius<0)
    {
      this.velocity.x=-this.velocity.x;
    }
    if(this.y+this.radius>canvas.height|| this.y-this.radius<0)
    {
      this.velocity.y=-this.velocity.y;
    }
    this.x+=this.velocity.x;
    this.y+=this.velocity.y;

  }
}

var circleArray=[];
for (var i=0; i<10; i++)
{
  var x=Math.random()*canvas.width;
  var y=Math.random()*canvas.height;

  var color_int=(Math.floor(Math.random()*(100-0)))
  var color=''

  if (color_int%2==0)
    color='RED';

  else if (color_int%3==0)
    color='BLACK';

  else
    color='BLUE';
    var mass=(Math.floor(Math.random()*(3-0)))
    console.log(mass);

  circleArray.push(new Circle(x,y,50,color,mass));
}



function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0,0,canvas.width,canvas.height);
  for (var i=0; i<circleArray.length; i++)
  {
    circleArray[i].update(circleArray);
  }

}

animate();


canvas.addEventListener('click',function(event){
  const rect=canvas.getBoundingClientRect();
  const x=event.clientX-rect.left;
  const y=event.clientY-rect.top;

  for (var i=0; i<circleArray.length; i++)
  {
    var flag=circleArray[i].clicked_button(x,y)
    if (flag==1)
    {
      circleArray.splice(i,1);
      score=score+10;
      score_element=document.getElementById('score').textContent="Score: "+score
    }
  }
  console.log(score);

});
