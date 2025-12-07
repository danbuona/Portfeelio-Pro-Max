import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===========================
// Scene Setup
// ===========================
let scene, camera, renderer, diploma, controls;

const canvas = document.getElementById('education-canvas');
const container = document.querySelector('.education-canvas-container');

// Create scene
scene = new THREE.Scene();

// Create camera
camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 3.2); // Zoomed out to prevent clipping at rotation extents
camera.lookAt(0, 0, 0);

// Create renderer with transparent background
renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
// Force canvas to match container dimensions
const width = container.clientWidth;
const height = container.clientHeight;
renderer.setSize(width, height, false); // false prevents setting style
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

// Add OrbitControls for interactive rotation
controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false; // Disable zoom
controls.enablePan = false; // Disable panning, only rotation

// Restrict rotation to 25 degrees in all directions
const maxAngle = THREE.MathUtils.degToRad(25);
controls.minPolarAngle = Math.PI / 2 - maxAngle; // 90° - 25° = 65°
controls.maxPolarAngle = Math.PI / 2 + maxAngle; // 90° + 25° = 115°
controls.minAzimuthAngle = -maxAngle; // -25°
controls.maxAzimuthAngle = maxAngle;  // +25°

// ===========================
// Dramatic Lighting Setup
// ===========================

// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Key light - main dramatic spotlight from upper right
const keyLight = new THREE.SpotLight(0xffffff, 90);
keyLight.position.set(3, 4, 3);
keyLight.angle = Math.PI / 6;
keyLight.penumbra = 0.5;
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 20;
scene.add(keyLight);

// Fill light - softer light from left side
const fillLight = new THREE.SpotLight(0x88ccff, 5);
fillLight.position.set(-3, 2, 2);
fillLight.angle = Math.PI / 4;
fillLight.penumbra = 0.7;
scene.add(fillLight);

// Rim light - dramatic backlighting
const rimLight = new THREE.SpotLight(0xffaa44, 40);
rimLight.position.set(0, 2, -3);
rimLight.angle = Math.PI / 5;
rimLight.penumbra = 0.6;
scene.add(rimLight);

// Accent point lights for extra drama
const accentLight1 = new THREE.PointLight(0xffd700, 22);
accentLight1.position.set(2, 1, 2);
scene.add(accentLight1);

// ===========================
// Diploma Creation
// ===========================

// Create procedural paper bump map
function createPaperBumpMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fill with base gray
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise for paper texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Generate random noise
        const noise = (Math.random() - 0.5) * 30;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }

    ctx.putImageData(imageData, 0, 0);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); // Tile the texture for finer detail

    return texture;
}

const paperBumpMap = createPaperBumpMap();

const diplomaGeometry = new THREE.PlaneGeometry(2.4, 1.6); // Landscape orientation
const diplomaMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    roughness: 0.8,        // Paper is quite rough
    metalness: 0.0,        // Paper is non-metallic
    emissive: 0x111111,
    emissiveIntensity: 0.2,
    bumpMap: paperBumpMap,
    bumpScale: 0.02,       // Subtle paper texture
});

// Load diploma texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    'diploma.png',
    (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        diplomaMaterial.map = texture;
        diplomaMaterial.needsUpdate = true;
    },
    undefined,
    () => {
        console.log('Diploma texture not loaded yet - add diploma.png to your project');
    }
);

diploma = new THREE.Mesh(diplomaGeometry, diplomaMaterial);
diploma.castShadow = true;
diploma.receiveShadow = true;
scene.add(diploma);

// ===========================
// Animation Loop
// ===========================
function animate() {
    requestAnimationFrame(animate);

    // Gentle side-to-side rotation
    const time = Date.now() * 0.0008;
    diploma.rotation.y = Math.sin(time) * 0.15; // ±8.6 degrees
    diploma.rotation.x = Math.sin(time * 0.7) * 0.05; // Slight tilt

    // Gentle floating motion
    diploma.position.y = Math.sin(time * 1.2) * 0.08;

    // Update controls
    controls.update();

    // Render scene
    renderer.render(scene, camera);
}

animate();

// ===========================
// Music Toggle
// ===========================
const musicToggle = document.getElementById('music-toggle');
const educationMusic = document.getElementById('education-music');
const iconMuted = document.querySelector('.icon-muted');
const iconUnmuted = document.querySelector('.icon-unmuted');

let isMuted = true;

musicToggle.addEventListener('click', () => {
    isMuted = !isMuted;

    if (isMuted) {
        educationMusic.pause();
        iconMuted.style.display = 'block';
        iconUnmuted.style.display = 'none';
    } else {
        educationMusic.play();
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = 'block';
    }
});

// ===========================
// Window Resize Handler
// ===========================
function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false); // false prevents setting style
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);

// Call once on load to ensure proper initial sizing
handleResize();
