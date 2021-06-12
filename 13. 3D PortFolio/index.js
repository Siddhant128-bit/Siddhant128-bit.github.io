import * as THREE from './node_modules/three/build/three.module.js' //importing three.js as THREE

var xc=window.innerWidth/2;
var yc=window.innerWidth/2;
var scene = new THREE.Scene();
var stop_flag=0;
var hover_flag=0;
var mic_click_flag=0;
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);



window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
})


//defining all the important parts upto here it is predefined upto an extend lol
//3d Text for creating my title screen maybe
const loader = new THREE.FontLoader();

loader.load( '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

	const geometry = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
} );
//adding voice feature;
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition =new SpeechRecognition();
recognition.interimResults=true;

let p=document.createElement('p');

//Text addign End
//setting up the cube on the screen
var geometry = new THREE.BoxGeometry(3,3,3);
var textureAll=[];
var texture=new THREE.TextureLoader().load('Sides of Cube/1.png')
var texture1=new THREE.TextureLoader().load('Sides of Cube/2.png')
var texture2=new THREE.TextureLoader().load('Sides of Cube/3.png')
var texture3=new THREE.TextureLoader().load('Sides of Cube/4.png')
textureAll.push(new THREE.MeshBasicMaterial({map: texture}));
textureAll.push(new THREE.MeshBasicMaterial({map: texture1}));
textureAll.push(new THREE.MeshBasicMaterial({map: texture2}));
textureAll.push(new THREE.MeshBasicMaterial({map: texture3}));
textureAll.push(new THREE.MeshBasicMaterial({map: texture2}));
textureAll.push(new THREE.MeshBasicMaterial({map: texture3}));
//geomoetry of cube
var material = new THREE.MeshLambertMaterial( {map: texture3} ); //outting image instead of material
console.log(textureAll)
//material of cube
var cube = new THREE.Mesh( geometry, textureAll );
cube.position.set(0,0,0);
scene.add( cube );
//adding cube on the scene

//adding the light
var light= new THREE.PointLight(0xFFFFFF,1,300);
light.position.set(10,0,25);
scene.add(light);
//light added

//background rotating circle is here
const geometry1 = new THREE.CircleGeometry( 4, 32 );
const edges = new THREE.EdgesGeometry( geometry1 );
const material2= new THREE.LineBasicMaterial( { color: 0x00ffff} )
const line = new THREE.LineSegments( edges,material2)
scene.add( line );
const material1 = new THREE.MeshPhongMaterial( {opacity: 0.5,color: 0x000030, transparent: true } );
const circle = new THREE.Mesh( geometry1, material1 );
scene.add( circle );

//microphone for communication.
const geometry2 = new THREE.CircleGeometry( 0.25, 32 );
const edges2 = new THREE.EdgesGeometry( geometry2 );
const material4= new THREE.LineDashedMaterial( { color: 0xffffff} )
const line1 = new THREE.LineSegments( edges2,material4)
line1.position.set(3.74,2)
scene.add( line1 );
const texturemic=new THREE.TextureLoader().load('Sides of Cube/mic.png')
const texturemichover=new THREE.TextureLoader().load('Sides of Cube/mic_hover.png')
const material3= new THREE.MeshLambertMaterial( {map: texturemic} );
const circle2 = new THREE.Mesh( geometry2, material3 );
circle2.position.set(3.74,2)

scene.add( circle2 );

//animating the rotatin effect
var render=function(){
  requestAnimationFrame(render);
  renderer.render(scene,camera);
  if (hover_flag==1)
  {
    circle2.material=new THREE.MeshLambertMaterial( {map: texturemic} );
  }
  else {
    circle2.material=new THREE.MeshLambertMaterial( {map: texturemichover} );
  }
  if (stop_flag==0)
  {
    cube.rotation.y+=0.007;
    circle.rotation.z+=0.008;
    line1.rotation.z+=0.008;
  }

}
//calling render function

var clicked_flag=0;
var i=0;


window.addEventListener("mousedown", event=>{
  clicked_flag=1;
  console.log(window.innerWidth,window.innerHeight)
  let clickX=event.clientX-100;
  let clickY=event.clientY-110;
  if(clickX>=1800 && clickX<=1950 && clickY>120 && clickY<=120+150)
  {
    console.log("Talk now ")
    mic_click_flag=1;
    recognition.start();
  }
  //stop_flag=1;
});

window.addEventListener('mouseup', event=>{
  clicked_flag=0;
})

recognition.addEventListener('result',e=>{
  const transcript=Array.from(e.results)
    .map(result=>result[0])
    .map(result=>result.transcript)
    .join('')
  p.textContent=transcript;
  console.log(transcript);
})
window.addEventListener('mousemove',event=>{
  stop_flag=1;
  let hoverx=event.clientX-100;
  let hovery=event.clientY-110;
  if (hovery>25 && hovery<1050 && hoverx>150 && hoverx<=2000 )
  {
    stop_flag=1;

    if(hoverx>=1800 && hoverx<=1950 && hovery>120 && hovery<=120+150 )
     {
       hover_flag=1;
     }
     else {
       hover_flag=0;
     }
     //
  }
  else {
    stop_flag=0;
  }
  if (clicked_flag==1)
  {
    //(event.offsetX,event.offsetY)
    if(xc>event.offsetX+40)
    {
      ('Left')
      xc=event.offsetX
      cube.rotation.y-=0.2;
    }
    else if(xc<event.offsetX-40)
    {
      ('Right')
      xc=event.offsetX
      cube.rotation.y+=0.2;
    }
  }
})





//voice feature till here


//zoom adjusting one way or the other
if(window.innerWidth>=4080 && window.innerHeight>=1971)
{
  document.body.style.zoom="117%"
}
else if(window.innerWidth<=2040 && window.innerHeight<=985)
{
  document.body.style.zoom="100-17%"
}
else if(window.innerWidth<=1813 && window.innerHeight<=876)
{
  document.body.style.zoom="100-17*2%"
}
else {

  document.body.style.zoom = "100%";
}
window.innerWidth=2720;
window.innerHeight=1314;
render();
