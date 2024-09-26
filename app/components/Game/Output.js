import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import Ammo from '@/app/utils/ammo';

export default class Output {
  constructor(_options = {}) {
    // Basic setup
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.targetElement = _options.targetElement;

    this.clock = new THREE.Clock();

    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createLights();
    // this.createGeometry();
    this.createOrbitControls();
    this.loadModel();

    this.render();

    // events
    window.addEventListener('resize', this.onResize.bind(this));
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.targetElement.appendChild(this.renderer.domElement);
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfd1e5);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.2,
      2000
    );
    this.camera.position.set(0, 0, 5);
  }

  createLights() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-3, 2.5, 1);
    dirLight.position.multiplyScalar(100);
    this.scene.add(dirLight);

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    let d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 20000;
  }

  createGeometry() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      '/models/giulia.glb', // Update this path to the correct location of your model
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // Adjust position as needed
        model.scale.set(2, 2, 2); // Adjust scale as needed
        this.scene.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
      }
    );
  }

  /**
   * EVENTS
   */
  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  onMouseDown(e) {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1) for both components
    this.mouseStart = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    // Update the raycaster with the camera and mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouseStart, this.camera);

    // Find intersections
    const intersects = raycaster.intersectObject(this.softBodies[0]); // Assuming softBodies[0] is your soft body

    if (intersects.length > 0) {
      this.isDragging = true;
      this.dragStartPoint = intersects[0].point;
    }
  }

  onMouseMove(e) {
    if (this.isDragging) {
      // Convert mouse coordinates to normalized device coordinates (-1 to +1) for both components
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate the movement vector
      const deltaX = mouse.x - this.mouseStart.x;
      const deltaY = mouse.y - this.mouseStart.y;

      // Update the starting point for the next move
      this.mouseStart.copy(mouse);

      // Update the raycaster with the camera and mouse position
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      // Find intersections
      const intersects = raycaster.intersectObject(this.softBodies[0]); // Assuming softBodies[0] is your soft body

      if (intersects.length > 0) {
        const point = intersects[0].point;
        this.applyForceToSoftBody(this.ammoClone, point, deltaX, deltaY);
      }
    }
  }

  onMouseUp() {
    if (this.isDragging) {
      // Reset the soft body to its initial shape
      //this.resetSoftBody();
      this.isDragging = false;
      this.startReset();
    }
  }

  /**
   * LOOP
   */

  updatePhysics(delta) {
    this.physicsWorld.stepSimulation(delta, 10);

    // update softbodies
    for (let i = 0, il = this.softBodies.length; i < il; i++) {
      const volume = this.softBodies[i];
      const geometry = volume.geometry;
      const softBody = volume.userData.physicsBody;
      const volumePositions = geometry.attributes.position.array;
      const volumeNormals = geometry.attributes.normal.array;
      const association = geometry.ammoIndexAssociation;
      const numVerts = association.length;
      const nodes = softBody.get_m_nodes();
      for (let j = 0; j < numVerts; j++) {
        const node = nodes.at(j);
        const nodePos = node.get_m_x();
        const x = nodePos.x();
        const y = nodePos.y();
        const z = nodePos.z();
        const nodeNormal = node.get_m_n();
        const nx = nodeNormal.x();
        const ny = nodeNormal.y();
        const nz = nodeNormal.z();

        const assocVertex = association[j];

        for (let k = 0, kl = assocVertex.length; k < kl; k++) {
          let indexVertex = assocVertex[k];
          volumePositions[indexVertex] = x;
          volumeNormals[indexVertex] = nx;
          indexVertex++;
          volumePositions[indexVertex] = y;
          volumeNormals[indexVertex] = ny;
          indexVertex++;
          volumePositions[indexVertex] = z;
          volumeNormals[indexVertex] = nz;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.normal.needsUpdate = true;
    }
    // update rigidbodies
    for (let i = 0; i < this.rigidBodies.length; i++) {
      let threeObject = this.rigidBodies[i];
      let ammoObject = threeObject.userData.physicsBody;
      let ms = ammoObject.getMotionState();
      if (ms) {
        ms.getWorldTransform(this.tempTransform);
        let pos = this.tempTransform.getOrigin();
        let quat = this.tempTransform.getRotation();
        threeObject.position.set(pos.x(), pos.y(), pos.z());
        threeObject.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
      }
    }
  }

  render() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.delta = this.clock.getDelta();

      this.renderer.render(this.scene, this.camera);
      this.controls.update();

      if (this.controls) this.controls.update();
    };
    animate();
  }
}
