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

    this.textureLoader = new THREE.TextureLoader();

    this.rigidBodies = [];
    this.softBodies = [];

    this.clock = new THREE.Clock();

    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createLights();
    this.createGeometry();
    // this.createOrbitControls();
    this.startAmmo();
    this.render();

    // Initialization for smooth reset
    this.isDragging = false;
    this.resetInProgress = false;
    this.resetDuration = 1.0; // Duration of reset animation in seconds
    this.resetStartTime = 0;

    // events
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
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
    this.camera.position.set(0, 10, 80);
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
    // this.scene.add(this.mesh);
  }

  startAmmo() {
    Ammo().then((Ammo) => {
      Ammo = Ammo;
      this.ammoClone = Ammo;
      this.createAmmo(Ammo);
    });
  }

  createAmmo(Ammo = this.ammoClone) {
    this.softBodyHelpers = new Ammo.btSoftBodyHelpers();
    this.tempTransform = new Ammo.btTransform();
    this.setupPhysicsWorld(Ammo);
    this.createPlane(Ammo);
    // this.createBall(Ammo);
    this.createSoftVolume(Ammo);
  }

  setupPhysicsWorld(Ammo = this.ammoClone) {
    let collisionCondiguration =
      new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionCondiguration);
    let overlappingPairCache = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    let softBodySolver = new Ammo.btDefaultSoftBodySolver();

    this.physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionCondiguration,
      softBodySolver
    );
    //this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
    this.physicsWorld.setGravity(new Ammo.btVector3(0, 10, 0));
  }

  createPlane(Ammo = this.ammoClone) {
    let pos = { x: 0, y: 0, z: 0 };
    let scale = { x: 30, y: 2, z: 30 };
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 0;

    // plane in threejs
    let blockPlane = new THREE.Mesh(
      new THREE.BoxGeometry(scale.x, scale.y, scale.z),
      new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0 })
    );
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.material.transparent = true;
    this.scene.add(blockPlane);
    // physics in ammojs
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );

    let motionState = new Ammo.btDefaultMotionState(transform);

    let localInertia = new Ammo.btVector3(0, 0, 0);

    let shape = new Ammo.btBoxShape(
      new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
    );
    shape.setMargin(0.05);
    shape.calculateLocalInertia(mass, localInertia);

    let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      shape,
      localInertia
    );

    let rBody = new Ammo.btRigidBody(rigidBodyInfo);

    this.physicsWorld.addRigidBody(rBody);
  }

  createBall(Ammo = this.ammoClone) {
    console.log('create ball');
    let pos = { x: 0, y: 20, z: 0 };
    let radius = 2;
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 1;

    // ball in threejs
    let ball = new THREE.Mesh(
      new THREE.SphereGeometry(radius),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    ball.position.set(pos.x, pos.y, pos.z);
    ball.castShadow = true;
    ball.receiveShadow = true;

    this.scene.add(ball);

    // physics in ammojs
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );

    let motionState = new Ammo.btDefaultMotionState(transform);

    let localInertia = new Ammo.btVector3(0, 0, 0);

    let shape = new Ammo.btSphereShape(radius);
    shape.setMargin(0.05);
    shape.calculateLocalInertia(mass, localInertia);

    let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      shape,
      localInertia
    );
    let rBody = new Ammo.btRigidBody(rigidBodyInfo);
    this.physicsWorld.addRigidBody(rBody);

    ball.userData.physicsBody = rBody;
    this.rigidBodies.push(ball);
  }

  createSoftVolume(Ammo = this.ammoClone) {
    let radius = 20;
    let pressure = 250;
    let mass = 1;

    let sphereGeometry = new THREE.SphereGeometry(radius, 64, 40);
    sphereGeometry.translate(0, 0, 0);

    // Ony consider the position values when merging the vertices
    const posOnlyBufGeometry = new THREE.BufferGeometry();
    posOnlyBufGeometry.setAttribute(
      'position',
      sphereGeometry.getAttribute('position')
    );
    posOnlyBufGeometry.setIndex(sphereGeometry.getIndex());

    // Merge the vertices so the triangle soup is converted to indexed triangles
    const indexedBufferGeom =
      BufferGeometryUtils.mergeVertices(posOnlyBufGeometry);

    // Create index arrays mapping the indexed vertices to bufGeometry vertices
    this.mapIndices(sphereGeometry, indexedBufferGeom);

    const volume = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    volume.castShadow = true;
    volume.receiveShadow = true;
    volume.frustumCulled = false;
    this.scene.add(volume);

    this.textureLoader.load('./textures/colors.png', (texture) => {
      volume.material.map = texture;
      volume.material.needsUpdate = true;
    });

    // Volume physic object

    const volumeSoftBody = this.softBodyHelpers.CreateFromTriMesh(
      this.physicsWorld.getWorldInfo(),
      sphereGeometry.ammoVertices,
      sphereGeometry.ammoIndices,
      sphereGeometry.ammoIndices.length / 3,
      true
    );

    const sbConfig = volumeSoftBody.get_m_cfg();
    sbConfig.set_viterations(40);
    sbConfig.set_piterations(40);

    // Soft-soft and soft-rigid collisions
    sbConfig.set_collisions(0x11);

    // Friction
    sbConfig.set_kDF(-0.1);
    // Damping
    sbConfig.set_kDP(0.01);
    // Pressure
    sbConfig.set_kPR(pressure);
    // Stiffness
    volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9);
    volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9);

    volumeSoftBody.setTotalMass(mass, false);
    Ammo.castObject(volumeSoftBody, Ammo.btCollisionObject)
      .getCollisionShape()
      .setMargin(0.05);
    this.physicsWorld.addSoftBody(volumeSoftBody, 1, -1);
    volume.userData.physicsBody = volumeSoftBody;
    // Disable deactivation
    volumeSoftBody.setActivationState(4);

    this.softBodies.push(volume);

    // Store initial positions for resetting
    this.initialPositions = [];
    const nodes = volumeSoftBody.get_m_nodes();
    for (let i = 0; i < nodes.size(); i++) {
      const nodePos = nodes.at(i).get_m_x();
      this.initialPositions.push({
        x: nodePos.x(),
        y: nodePos.y(),
        z: nodePos.z(),
      });
    }
  }

  mapIndices(bufGeometry, indexedBufferGeom) {
    // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry

    const vertices = bufGeometry.attributes.position.array;
    const idxVertices = indexedBufferGeom.attributes.position.array;
    const indices = indexedBufferGeom.index.array;

    const numIdxVertices = idxVertices.length / 3;
    const numVertices = vertices.length / 3;

    bufGeometry.ammoVertices = idxVertices;
    bufGeometry.ammoIndices = indices;
    bufGeometry.ammoIndexAssociation = [];

    for (let i = 0; i < numIdxVertices; i++) {
      const association = [];
      bufGeometry.ammoIndexAssociation.push(association);

      const i3 = i * 3;

      for (let j = 0; j < numVertices; j++) {
        const j3 = j * 3;
        if (
          this.isEqual(
            idxVertices[i3],
            idxVertices[i3 + 1],
            idxVertices[i3 + 2],
            vertices[j3],
            vertices[j3 + 1],
            vertices[j3 + 2]
          )
        ) {
          association.push(j3);
        }
      }
    }
  }

  isEqual(x1, y1, z1, x2, y2, z2) {
    const delta = 0.000001;
    return (
      Math.abs(x2 - x1) < delta &&
      Math.abs(y2 - y1) < delta &&
      Math.abs(z2 - z1) < delta
    );
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  applyForceToSoftBody(Ammo = this.ammoClone, point, deltaX, deltaY) {
    if (this.softBodies.length === 0) return;

    const softBody = this.softBodies[0].userData.physicsBody;
    const nodes = softBody.get_m_nodes();

    // Convert point from THREE.js coordinates to Ammo.js coordinates
    const ammoPoint = new Ammo.btVector3(point.x, point.y, point.z);

    const forceMagnitude = 100;

    // Apply force to the soft body nodes near the point
    const force = new Ammo.btVector3(
      deltaX * forceMagnitude,
      deltaY * forceMagnitude,
      0
    );
    for (let i = 0; i < nodes.size(); i++) {
      const node = nodes.at(i);
      const nodePos = node.get_m_x();

      // Calculate the vector difference between node position and the click point
      const diffX = nodePos.x() - ammoPoint.x();
      const diffY = nodePos.y() - ammoPoint.y();
      const diffZ = nodePos.z() - ammoPoint.z();

      // Calculate the squared distance
      const distanceSquared = diffX * diffX + diffY * diffY + diffZ * diffZ;

      // Define a threshold distance for applying force
      const threshold = 1; // Adjust this value as needed

      // Apply force if within the threshold distance
      if (distanceSquared < threshold * threshold) {
        // Apply force (you might want to apply it in a direction relative to the node's position)
        node.get_m_x().op_add(force);
      }
    }
  }

  startReset() {
    if (this.softBodies.length === 0) return;

    this.resetInProgress = true;
    this.resetStartTime = performance.now();
  }

  resetSoftBody() {
    if (!this.resetInProgress) return;

    const currentTime = performance.now();
    const elapsedTime = (currentTime - this.resetStartTime) / 1000; // Convert to seconds
    const progress = Math.min(elapsedTime / this.resetDuration, 1); // Normalize between 0 and 1

    const softBody = this.softBodies[0].userData.physicsBody;
    const nodes = softBody.get_m_nodes();

    // Interpolate positions
    for (let i = 0; i < nodes.size(); i++) {
      const node = nodes.at(i);
      const initialPos = this.initialPositions[i];
      const currentPos = node.get_m_x();

      // Linear interpolation
      const newX = currentPos.x() + (initialPos.x - currentPos.x()) * progress;
      const newY = currentPos.y() + (initialPos.y - currentPos.y()) * progress;
      const newZ = currentPos.z() + (initialPos.z - currentPos.z()) * progress;

      node.get_m_x().setValue(newX, newY, newZ);
    }

    if (progress >= 1) {
      this.resetInProgress = false;
    }
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

      this.resetSoftBody();

      if (this.physicsWorld) this.updatePhysics(this.delta);

      this.renderer.render(this.scene, this.camera);

      if (this.controls) this.controls.update();
    };
    animate();
  }
}
