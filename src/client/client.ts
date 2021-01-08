import * as THREE from '/build/three.module.js';
import { PointerLockControls } from '/jsm/controls/PointerLockControls';
import Stats from '/jsm/libs/stats.module';
import { Reflector } from '/jsm/objects/Reflector';

const scene: THREE.Scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const light = new THREE.AmbientLight();
scene.add(light);

// const boxGeometry: THREE.BoxGeometry = new THREE.BoxGeometry();
// const sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry()
// const icosahedronGeometry: THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
// const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry()
// const torusKnotGeometry: THREE.TorusKnotGeometry = new THREE.TorusKnotGeometry()

// const cubeMaterial: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();

// const cube: THREE.Mesh = new THREE.Mesh(boxGeometry, cubeMaterial);
// cube.position.x = 5;
// scene.add(cube);

const ballMaterial: THREE.MeshMatcapMaterial = new THREE.MeshMatcapMaterial();
const matcapTexture = new THREE.TextureLoader().load('img/matcap.png');
ballMaterial.matcap = matcapTexture;
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8), ballMaterial);
ball.position.z = -1.5;
ball.position.y = -0.5;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.add(camera);
camera.add(ball);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const menuPanel = document.getElementById('menuPanel');
const startButton = document.getElementById('startButton');
startButton.addEventListener(
  'click',
  function () {
    menuPanel.style.display = 'none';
    controls.lock();
  },
  false
);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'));
controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'));

const groundMirror = new Reflector(new THREE.PlaneBufferGeometry(50, 50), {
  color: new THREE.Color(0x222222),
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
});
groundMirror.position.y = -0.05;
groundMirror.rotateX(-Math.PI / 2);
scene.add(groundMirror);

const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
  100,
  100,
  50,
  50
);
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true,
});
const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

const backGroundTexture: THREE.CubeTexture = new THREE.CubeTextureLoader().load(
  [
    'img/lights.png',
    'img/lights.png',
    'img/greensky.png',
    'img/lights.png',
    'img/lights.png',
    'img/lights.png',
  ]
);
scene.background = backGroundTexture;

// let cubes: THREE.Mesh[] = new Array();
// for (let i = 0; i < 100; i++) {
//   const geo: THREE.BoxGeometry = new THREE.BoxGeometry(
//     Math.random() * 4,
//     Math.random() * 16,
//     Math.random() * 4
//   );
//   const mat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
//     wireframe: true,
//   });
//   switch (i % 3) {
//     case 0:
//       mat.color = new THREE.Color(0xff0000);
//       break;
//     case 1:
//       mat.color = new THREE.Color(0xffff00);
//       break;
//     case 2:
//       mat.color = new THREE.Color(0x0000ff);
//       break;
//   }
//   const cube = new THREE.Mesh(geo, mat);
//   cubes.push(cube);
// }
// cubes.forEach((c) => {
//   c.position.x = Math.random() * 100 - 50;
//   c.position.z = Math.random() * 100 - 50;
//   c.geometry.computeBoundingBox();
//   c.position.y =
//     ((c.geometry.boundingBox as THREE.Box3).max.y -
//       (c.geometry.boundingBox as THREE.Box3).min.y) /
//     2;
//   scene.add(c);
// });

camera.position.y = 1;
camera.position.z = 2;

const onKeyDown = function (event) {
  switch (event.keyCode) {
    case 87: // w
      controls.moveForward(0.25);
      break;
    case 65: // a
      controls.moveRight(-0.25);
      break;
    case 83: // s
      controls.moveForward(-0.25);
      break;
    case 68: // d
      controls.moveRight(0.25);
      break;
  }
};
document.addEventListener('keydown', onKeyDown, false);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

var animate = function () {
  requestAnimationFrame(animate);

  //controls.update()

  ball.rotation.x += 0.01;
  ball.rotation.y += 0.01;

  render();

  stats.update();
};

function render() {
  renderer.render(scene, camera);
}
animate();
