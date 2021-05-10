main_wrapper=document.getElementById('wrapper_main');
main_wrapper.id='wrapper_main';

//left_button
var left_btn = document.createElement("BUTTON");
left_btn.innerHTML = "<";
left_btn.classList.add('left-btn');
main_wrapper.appendChild(left_btn);
document.body.appendChild(main_wrapper);
//==============================================================================

//slide object loaded
const carouselImages=document.querySelectorAll('.carousel-slide img')
const size=carouselImages[0].clientWidth;
let counter=0;
var poe=0
//------------------------------------------------------------------------------

//right_button
var right_btn=document.createElement('BUTTON');
right_btn.innerHTML='>';
right_btn.classList.add('right-btn');
main_wrapper.appendChild(right_btn)
document.body.appendChild(main_wrapper);
//------------------------------------------------------------------------------


//dots assigned
var dot_left=document.createElement('div')
var dot_middle=document.createElement('div')
var dot_right=document.createElement('div')
document.body.appendChild(dot_left);
document.body.appendChild(dot_middle);
document.body.appendChild(dot_right);
dot_left.classList.add('dot');
dot_middle.classList.add('dot');
dot_right.classList.add('dot');
//==============================================================================


//dots new or initial assign
dot_left.style.backgroundColor='red'
dot_middle.style.backgroundColor='GRAY';
dot_right.style.backgroundColor='GRAY';
//=============================================================================

//button Listener
left_btn.addEventListener('click',function left_transition(){
  var element_val=document.getElementById("container_main")
  var transition=setInterval(animate,10)
  function animate(){
    poe=poe+5;
    element_val.style.left=poe+'px'
    if (counter==1)
    {
      dot_middle.style.backgroundColor='red';
      dot_left.style.backgroundColor='GRAY';
      dot_right.style.backgroundColor='GRAY';
    }
    else if (counter==2)
    {
      dot_left.style.backgroundColor='GRAY';
      dot_middle.style.backgroundColor='GRAY';
      dot_right.style.backgroundColor='red';
    }
    else if (counter==0)
    {
      dot_left.style.backgroundColor='red'
      dot_middle.style.backgroundColor='GRAY';
      dot_right.style.backgroundColor='GRAY';
    }

    if (poe>=(-size*counter))
    {
      console.log(poe,(-size*counter))
      clearInterval(transition)
    }
  }
  counter=counter-1
  if (counter<0)
  {
    poe=-1785;
    counter=2;
  }
})


right_btn.addEventListener('click',function right_transition(){
  var element_val=document.getElementById("container_main")
  var transition=setInterval(animate,10)
  if (counter==0)
  {
    dot_middle.style.backgroundColor='red';
    dot_left.style.backgroundColor='GRAY';
    dot_right.style.backgroundColor='GRAY';
  }
  else if (counter==1)
  {
    dot_left.style.backgroundColor='GRAY';
    dot_middle.style.backgroundColor='GRAY';
    dot_right.style.backgroundColor='red';
  }
  else if (counter==2)
  {
    dot_left.style.backgroundColor='red'
    dot_middle.style.backgroundColor='GRAY';
    dot_right.style.backgroundColor='GRAY';
  }


  function animate(){
    poe=poe-5;
    element_val.style.left=poe+'px'
    if (poe<=(-size*counter))
    {
      console.log(poe,(-size*counter))
      clearInterval(transition)
    }
  }
  counter=counter+1
  if(counter>=3)
  {
      poe=100;
      counter=0;
  }
})



dot_left.addEventListener('click', function select_first(){
  console.log('First')
  dot_left.style.backgroundColor='red'
  dot_middle.style.backgroundColor='GRAY';
  dot_right.style.backgroundColor='GRAY';
  if (counter>=2)
  {
    console.log(poe,(-size*counter))
    var element_val=document.getElementById("container_main")
    var transition=setInterval(animate,10)
    poe=-1560;
    counter=0;
    function animate(){
      poe=poe+5;
      element_val.style.left=poe+'px'
      if (poe>=(-size*counter))
      {
        clearInterval(transition)
      }
    }
  }
  else if (counter==1)
  {
    var element_val=document.getElementById("container_main")
    var transition=setInterval(animate,10)
    poe=-750;
    counter=0;
    function animate(){
      poe=poe+5;
      element_val.style.left=poe+'px'
      if (poe>=(-size*counter))
      {

        clearInterval(transition)
      }
    }

  }

})


dot_middle.addEventListener('click', function select_first(){
  console.log('Second')
  dot_left.style.backgroundColor='GRAY'
  dot_middle.style.backgroundColor='RED';
  dot_right.style.backgroundColor='GRAY';
  if (counter>=2)
  {
    var element_val=document.getElementById("container_main")
    var transition=setInterval(animate,10)
    poe=-1560;
    counter=1;
    function animate(){
      poe=poe+5;
      element_val.style.left=poe+'px'
      if (poe>=(-size*counter))
      {
        clearInterval(transition)
      }
    }
  }
  else if (counter<=1)
  {
    var element_val=document.getElementById("container_main")
    var transition=setInterval(animate,10)
    poe=-200;
    counter=1;
    function animate(){
      poe=poe-5;
      element_val.style.left=poe+'px'
      if (poe<=(-size*counter))
      {
        clearInterval(transition)
      }
    }

  }

})


dot_right.addEventListener('click', function select_first(){
  console.log('Third')
  dot_left.style.backgroundColor='GRAY'
  dot_middle.style.backgroundColor='GRAY';
  dot_right.style.backgroundColor='RED';
  if (counter<1)
  {
    console.log('Hey Ya')
    var element_val=document.getElementById("container_main")
    var transition=setInterval(animate,10)
    poe=-200;
    counter=2;
    function animate(){
      poe=poe-5;
      element_val.style.left=poe+'px'
      if (poe<=(-size*counter))
      {
        clearInterval(transition)
      }
    }
  }
  else if (counter==1)
  {

    var element_val=document.getElementById("container_main")
    var transition=setInterval(animate,10)
    poe=-720;
    counter=2;
    function animate(){
      poe=poe-5;
      element_val.style.left=poe+'px'
      if (poe<=(-size*counter))
      {
        clearInterval(transition)
      }
    }
  }

})
