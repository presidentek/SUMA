
// Variables para ThreeJS
var container;
var camera, controls, scene, renderer;

var raycaster;
var mouse;

var PI2 = Math.PI * 2;

// Memorias
var memories;
var audioContext;

var INTERSECTED;

var programFill = function ( context ) {
  context.beginPath();
  context.arc( 0, 0, 0.3, 0, PI2, true );
  context.fill();
};

var programStroke = function ( context ) {
  context.lineWidth = 0.03;
  context.beginPath();
  context.arc( 0, 0, 0.3, 0, PI2, true );
  context.stroke();
};

function init() {

  // Inicia las memorias
  memories = [];
  loadMemories();

  if ('AudioContext' in window) {
    audioContext = new AudioContext();
  } else {
    alert('Your browser does not yet support the Web Audio API');
    return;
  }

  // Inicia ThreeJS
  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 800;

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.noZoom = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.addEventListener('change', render);

  scene = new THREE.Scene();
  
  //
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Renderer
  renderer = new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor("rgb(251, 251, 249)");
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild(renderer.domElement);

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );

  render();
}

function loadMemories() {
  
  // Carga el JSON
  $.ajax({
    url: "http://localhost:8888/SUMA/example.jso",
    method: "GET",
    dataType: "json",
    success: function (data) {
      for (var i = 0; i < data.memories.length; i++) {
        var dataMemory = data.memories[i];

        // Distincion del bpm
        var memory = new Memory(dataMemory);
        memories.push(memory);

        scene.add(memory.particle);
      }
    }
  });
}

//animacion
function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function onDocumentMouseDown( event ) {
  event.preventDefault();

  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

    var particle = new THREE.Sprite( particleMaterial );
    particle.position.copy( intersects[ 0 ].point );
    particle.scale.x = particle.scale.y = 16;
    scene.add( particle );

        }
      }


// rotacion camara
function render() { 

  // raycaster
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects( scene.children );
  if (intersects.length > 0) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) INTERSECTED.material.program = programStroke;
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.material.program = programFill;
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.program = programStroke;
      INTERSECTED = null;
  }

  renderer.render(scene, camera);
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

  render();
}

init();
animate();