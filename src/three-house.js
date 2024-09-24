import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Timer } from "three/addons/misc/Timer.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass, GammaCorrectionShader } from "three/examples/jsm/Addons.js";

/**
 * Base
 */
// Debug
// const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl-house");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorColorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
);
const floorARMTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallColorTexture = textureLoader.load(
  "./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_diff_1k.webp"
);
const wallARMTexture = textureLoader.load(
  "./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_arm_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_nor_gl_1k.webp"
);
const wallDisplacementTexture = textureLoader.load(
  "./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_disp_1k.webp"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
  "./roof/roof_3_1k/roof_3_diff_1k.webp"
);
const roofARMTexture = textureLoader.load(
  "./roof/roof_3_1k/roof_3_arm_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "./roof/roof_3_1k/roof_3_nor_gl_1k.webp"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/forest_leaves_03_diff_1k.webp"
);
const bushARMTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/forest_leaves_03_arm_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.webp"
);
const bushDisplacementTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/static/bush/forest_leaves_03_1k/forest_leaves_03_disp_1k.webp"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

// Grave
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load("./door/color.webp");
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Temporary sphere
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.45,
    displacementBias: -0.2,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// House continer
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4, 100, 100),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
    displacementMap: wallDisplacementTexture,
    displacementScale: 0.1,
    displacementBias: -0.08,
  })
);
walls.position.y += 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.75;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.019;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
  displacementMap: bushDisplacementTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(2.2, 0.2, 0.8);
bush1.rotation.z = 0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(2.1, 0.1, 1.4);
bush2.rotation.z = 0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(2.2, 0.1, -0.8);
bush3.rotation.z = 0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(2.6, 0.05, -1);
bush4.rotation.z = 0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.16);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 4 + 3;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;

  // Add to graves group
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ffffff", 6);
const ghost2 = new THREE.PointLight("#ffffff", 6);
const ghost3 = new THREE.PointLight("#ffffff", 6);
scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post processing
 */
// Render target (only works on modern browsers)
// Used for fixing the antialiasing of the effect composer; sizes will update automatically later so we can use random numbers.
const renderTarget = new THREE.WebGLRenderTarget(
  800,
  600,
  { samples: renderer.getPixelRatio() === 1 ? 2 : 0 } // the more samples, the better the antialias, but the lower the performance; 0 will deactivate the anti-aliasing.
);

// Effect composer
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

// First pass, which represents the current scene and camera.
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// Displacement pass
const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null }, // EffectComposer will update this value by putting the previous path texture on it.
    uTexture: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
        vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse; // Contains the last pass texture.
    uniform sampler2D uTexture;

    varying vec2 vUv;

    void main() {
        vec4 textureColor = texture2D(uTexture, vUv);
        vec4 lastColor = texture2D(tDiffuse, vUv);

        // Mix the texture color and the last color, according to the alpha value of the texture.
        vec4 color = mix(lastColor, textureColor, textureColor.a);

        gl_FragColor += color;
    }
  `,
};
const displacementPass = new ShaderPass(DisplacementShader);
// displacementPass.material.uniforms.uTime.value = 0;
displacementPass.material.uniforms.uTexture.value = textureLoader.load(
  "/frame/AdobeStock_582431478.png"
);
effectComposer.addPass(displacementPass);

// Gamma Correction pass
// This pass must be the last one (except for the anti-aliasing one); it converts the linear encoding to a sRGB enconding in order to fix the darkness of the colors.
const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionShader);

/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 1;
sky.material.uniforms["rayleigh"].value = 0;
sky.material.uniforms["mieCoefficient"].value = 0.001;
sky.material.uniforms["mieDirectionalG"].value = 0.3;
sky.material.uniforms["sunPosition"].value.set(0.3, 0.05, -0.95);

/**
 * Animate
 */
const timer = new Timer();
let enterInHouseStepNumber = 0;

document.getElementById('enterButton').onclick = () => {
  enterInHouseStepNumber = 1;
}

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  switch (enterInHouseStepNumber) {
    case 1:
      // Face the door
      const finalCameraPosition = new THREE.Vector3( 0, 1, 8 );
      camera.position.lerp(finalCameraPosition, 0.1);

      if (camera.position.z > 7.8) {
        enterInHouseStepNumber = 2;
      }

      break;
    case 2:
      // Open the door
      console.log('open the door');
      enterInHouseStepNumber = 3;

      break;
    case 3:
      // Enter the house
      const finalCameraPosition2 = new THREE.Vector3( 0, 1, 1 );
      camera.position.lerp(finalCameraPosition2, 0.1);

      camera.rotation.x = Math.PI * 0.5;

      if (camera.position.z < 2) {
        enterInHouseStepNumber = 4;
      }

      break;
    case 4:
      // Hide the house scene.
      document.querySelector(".webgl-container").classList.add('hidden');

      setTimeout(() => {
        enterInHouseStepNumber = 5;
      }, 1500);

      break;
    case 5:
      // Send an event to the three skull script in order for it to take control.
      var event = new CustomEvent("start-skull-steps-event", {});
      document.dispatchEvent(event);
      enterInHouseStepNumber = 6;

      break;
  }

  // Ghost
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = -elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  // renderer.render(scene, camera);
  // Render the effectComposer instead of the renderer.
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
