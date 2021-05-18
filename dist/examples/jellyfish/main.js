import * as THREE from '../../build/three.module.js';
import { OrbitControls } from '../../build/OrbitControls.js';

import vertexShader from './vertex.js';
import fragmentShader from './fragment.js';

const TextureLoader = new THREE.TextureLoader();
const spotTexture = TextureLoader.load('../../assets/spot.png');

const parameters = {
    width: 1.0,  // size of geometry
    speed: 0.3,  // progress speed
    size: 5,     // particle size
    counts: 60,  // particles number along one side
}

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
scene.add(camera);

// RWD
camera.position.set(0.7, 0.7, 0.7);
if (window.innerWidth < 768) camera.position.multiplyScalar(1.3);

// Renderer
const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const particlesMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime:    { value: 0 },
        uSize:    { value: parameters.size * renderer.getPixelRatio() },
        uTexture: { value: spotTexture },
    }
});

const { width, counts } = parameters;
const particlesGeometry = new THREE.BufferGeometry();
const cube = new THREE.BoxGeometry(width, width, width, counts, counts, counts);
particlesGeometry.attributes.position = cube.attributes.position;
particlesGeometry.attributes.uv = cube.attributes.uv;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target = new THREE.Vector3();
controls.enableDamping = true;

// Tick
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    particlesMaterial.uniforms.uTime.value = (elapsedTime + 98) * parameters.speed / Math.PI;
    particles.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
