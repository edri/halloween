import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Timer } from "three/addons/misc/Timer.js";

/**
 * Loaders
 */
const objLoader = new OBJLoader();

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
const skullGroup = new THREE.Group();

// Receive this event from the three house script.
document.addEventListener("skull-object", (e) => {
  const obj = e.detail;
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

  skullGroup.scale.set(0, 0, 0);

  scene.add(skullGroup);
});

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#fff", 0.7);
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
let loadSkullStepNumber = 0;

const rotateSkullByClientXAndY = (clientX, clientY) => {
  // Only move the skull if it has properly been initialized.
  if (loadSkullStepNumber === 4) {
    // We want values to go from -1 to 1
    const mouseX = (clientX / sizes.width) * 2 - 1;
    const mouseY = (-clientY / sizes.height) * 2 + 1;

    skullGroup.rotation.y = mouseX * 0.5;
    skullGroup.rotation.x = -mouseY * 0.5;
  }
};

window.addEventListener("mousemove", (event) => {
  rotateSkullByClientXAndY(event.clientX, event.clientY);
});

window.addEventListener("touchstart", (event) => {
  rotateSkullByClientXAndY(event.changedTouches['0'].clientX, event.changedTouches['0'].clientY);
});

window.addEventListener("touchmove", (event) => {
  rotateSkullByClientXAndY(event.changedTouches['0'].clientX, event.changedTouches['0'].clientY);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Set background color
renderer.setClearColor( 0x000000, 1);

/**
 * Animate
 */
const timer = new Timer();
let previousTime = 0;
let skullGroupScaleValue = 0;
let backgroundAlphaValue = 1;
let isTextShowing = false;

// Receive this event from the three house script.
document.addEventListener("start-skull-steps-event", (e) => {
  loadSkullStepNumber = 1;
});

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  switch (loadSkullStepNumber) {
    case 1:
      // Make the skull bigger and make it rotate.
      skullGroupScaleValue += deltaTime * 0.5;

      skullGroup.scale.set(skullGroupScaleValue, skullGroupScaleValue, skullGroupScaleValue);
      skullGroup.rotation.y = 2 * Math.PI * skullGroupScaleValue;

      if (skullGroupScaleValue >= 1) {
        skullGroup.scale.set(1, 1, 1);
        skullGroup.rotation.y = 2 * Math.PI;
        loadSkullStepNumber = 2;
      }

      break;
      case 2:
        // Show the bloody background.
        backgroundAlphaValue -= deltaTime;
        renderer.setClearColor( 0x000000, backgroundAlphaValue);
  
        if (backgroundAlphaValue <= 0) {
          loadSkullStepNumber = 3;
        }
  
        break;
    case 3:
      // Show the text
      document.querySelector(".skull-description").classList.add('visible');

      if (!isTextShowing) {
        isTextShowing = true;

        setTimeout(() => {
          loadSkullStepNumber = 4;
        }, 1500);
      }

      break;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
