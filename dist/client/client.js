import * as THREE from '/build/three.module.js';
import { PointerLockControls } from '/jsm/controls/PointerLockControls';
import Stats from '/jsm/libs/stats.module';
import { Reflector } from '/jsm/objects/Reflector';
const scene = new THREE.Scene();
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
const light = new THREE.AmbientLight();
scene.add(light);
const ballMaterial = new THREE.MeshMatcapMaterial();
const matcapTexture = new THREE.TextureLoader().load('img/matcap.png');
ballMaterial.matcap = matcapTexture;
const ballMaterial2 = new THREE.MeshMatcapMaterial();
const matcapTexture2 = new THREE.TextureLoader().load('img/crystal-matcap.png');
ballMaterial2.matcap = matcapTexture2;
const ballMaterial3 = new THREE.MeshMatcapMaterial();
const matcapTexture3 = new THREE.TextureLoader().load('img/chrome.png');
ballMaterial3.matcap = matcapTexture3;
const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 0), ballMaterial2);
crystal.position.x = 0;
crystal.position.y = 20;
crystal.position.z = 0;
scene.add(crystal);
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8), ballMaterial);
ball.position.z = -1.5;
ball.position.y = -0.5;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);
camera.add(ball);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const menuPanel = document.getElementById('menuPanel');
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
    menuPanel.style.display = 'none';
    controls.lock();
}, false);
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
const backGroundTexture = new THREE.CubeTextureLoader().load([
    'img/lights.png',
    'img/lights.png',
    'img/nightsky.png',
    'img/lights.png',
    'img/lights.png',
    'img/lights.png',
]);
scene.background = backGroundTexture;
let spheres = new Array();
for (let i = 0; i < 80; i++) {
    const geo = new THREE.SphereGeometry(Math.random() * 4);
    const orb = new THREE.Mesh(geo, ballMaterial);
    spheres.push(orb);
}
spheres.forEach((s) => {
    s.position.x = Math.random() * 100 - 50;
    s.position.z = Math.random() * 100 - 50;
    s.position.y = Math.random() * 5;
    scene.add(s);
});
let knots = new Array();
for (let i = 0; i < 80; i++) {
    const geo = new THREE.TorusGeometry(Math.random() * 2);
    const knot = new THREE.Mesh(geo, ballMaterial3);
    knots.push(knot);
}
knots.forEach((kn) => {
    kn.position.x = Math.random() * 100 - 50;
    kn.position.z = Math.random() * 100 - 50;
    kn.position.y = Math.random() * 15;
    scene.add(kn);
});
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
    ball.rotation.x += 0.01;
    ball.rotation.y += 0.01;
    knots.forEach((kn) => {
        kn.rotation.x += 0.01;
        kn.rotation.y += 0.01;
    });
    crystal.rotation.x += 0.01;
    crystal.rotation.y += 0.01;
    render();
    stats.update();
};
function render() {
    renderer.render(scene, camera);
}
animate();
