import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/**
 * Base
 */
// Debug
// const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl-skull");

// Scene
const scene = new THREE.Scene();

/**
 * Model
 */
// instantiate a loader
const loader = new OBJLoader();
const skullGroup = new THREE.Group();

// load a resource
loader.load(
	// resource URL
	'skull/skull.obj',
	// called when resource is loaded
	function (obj) {
    // Success
    const childrenLength = obj.children.length;
    for (let i = 0; i < childrenLength; i++) {
      obj.children[0].scale.set(0.17, 0.15, 0.17);
      obj.children[0].rotation.x = -Math.PI * 0.5;
      obj.children[0].position.set(0, -1.5, 0);

      // if (i === 0) {
      //   obj.children[0].rotation.x = Math.PI;
      // }

      skullGroup.add(obj.children[0]);
    }

    new THREE.Box3().setFromObject( skullGroup ).getCenter( skullGroup.position ).multiplyScalar( - 1 );
    scene.add(skullGroup);
	},
	/* // called when loading is in progresses
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	} */
);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#fff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#fff", 1);
directionalLight.position.set(0, 0, 3);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 8;
scene.add(camera);

/**
 * Mouse
 */
window.addEventListener("mousemove", (event) => {
  // We want values to go from -1 to 1
  const mouseX = (event.clientX / sizes.width) * 2 - 1;
  const mouseY = (-event.clientY / sizes.height) * 2 + 1;

  skullGroup.rotation.y = mouseX * 0.5;
  skullGroup.rotation.x = -mouseY * 0.5;
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
