// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  `models/scene.gltf`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);

    // Position the camera to view the loaded object
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Set camera position and target to zoom into the model and focus towards the right side
    camera.position.copy(center);
    camera.position.x += size.x * 2; // Zoom a little bit more towards the right side
    camera.lookAt(center);

    // Zoom the whole scene by two
    // camera.position.multiplyScalar();

object.traverse((node) => {
  if (node.isMesh && node.material && node.material.color) {
    // Set the color to shades of black (HSL: Hue, Saturation, Lightness)
    const lightness = Math.random() * 1.7; // Random lightness between 0 and 0.4 for shades of black
    node.material.color.setHSL(0, 0, lightness);
  }
});




    // Pan into the right side of the model slowly
    const target = new THREE.Vector3(center.x, center.y, center.z); // Pan to the right side
    controls.target.copy(target);
    controls.update();
    object.position.y += 6;
    object.position.z += 7;
    object.position.x += 82;
    object.rotateY(Math.PI / 2);

    // Animation function to rotate the model from left to right for 2 seconds
    let rotateStartTime = Date.now();
    let rotationCompleted = false;
    function animateRotation() {
      if (!rotationCompleted) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - rotateStartTime;
        const rotationSpeed = Math.PI / 2; // Rotate 90 degrees per second
        const rotationAngle = (elapsedTime / 1000) * rotationSpeed;
        object.rotation.y = -Math.PI / 2 + rotationAngle; // Rotate from left to right
        if (elapsedTime < 2000) {
          requestAnimationFrame(animateRotation);
        } else {
          rotationCompleted = true;
          // Go back to the main frame
          camera.position.copy(center);
          camera.position.x += size.x * 2; // Zoom towards the right side
          camera.lookAt(center);
        }
      } else {
        // Start zoom animation after rotating back to the main frame
        animateZoom();
      }
    }

    // Animation function to zoom into the right side of the model
    function animateZoom() {
      // Move the camera towards the right side of the model
      camera.position.x -= 0.06;
    }

    // Render the scene with animation
    function render() {
      requestAnimationFrame(render);
      animateRotation();
      renderer.render(scene, camera);
    }

    // Start the animation
    render();

    // Redirect to the index file after 7 seconds
    setTimeout(function () {
      window.location.href = "sachi.html"; // Redirect to the index file
    }, 4000); 
  },

  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);





// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increase the brightness
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0); // from above
scene.add(directionalLight);

// This adds controls to the camera, so we can rotate / zoom it with the mouse
// OrbitControls allow the camera to move around the scene
controls = new OrbitControls(camera, renderer.domElement);

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  // Here we could add some code to update the scene, adding some automatic movement
  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();
