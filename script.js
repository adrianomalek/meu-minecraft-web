// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Câmera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

// Controles (FPS)
const controls = new THREE.PointerLockControls(camera, document.body);

document.body.addEventListener("click", () => {
  controls.lock();
});

scene.add(controls.getObject());

// Chão de blocos
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x228B22 });

const blocos = [];

for (let x = -10; x < 10; x++) {
  for (let z = -10; z < 10; z++) {
    const bloco = new THREE.Mesh(geometry, material);
    bloco.position.set(x, 0, z);
    scene.add(bloco);
    blocos.push(bloco);
  }
}

// Movimento
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Raycaster (interação)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Clique
document.addEventListener("mousedown", (event) => {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObjects(blocos);

  if (intersects.length > 0) {
    const obj = intersects[0].object;

    if (event.button === 0) {
      // Remove bloco
      scene.remove(obj);
      blocos.splice(blocos.indexOf(obj), 1);
    }

    if (event.button === 2) {
      // Adiciona bloco
      const novo = new THREE.Mesh(geometry, material);
      novo.position.copy(obj.position).add(intersects[0].face.normal);
      scene.add(novo);
      blocos.push(novo);
    }
  }
});

// Evitar menu botão direito
window.addEventListener("contextmenu", e => e.preventDefault());

// Posição inicial
camera.position.y = 2;

// Loop
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;

  if (keys["w"]) controls.moveForward(speed);
  if (keys["s"]) controls.moveForward(-speed);
  if (keys["a"]) controls.moveRight(-speed);
  if (keys["d"]) controls.moveRight(speed);

  renderer.render(scene, camera);
}

animate();

// Responsivo
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
