import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import gsap from 'gsap';
import Resources from '@/app/utils/Resources';
import sources from '@/app/data/models';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GUI } from 'dat.gui';

export default class Output {
  constructor(_options = {}) {
    // Basic setup
    this.window = _options.window;
    this.width = this.window.innerWidth;
    this.height = this.window.innerHeight;
    this.targetElement = _options.targetElement;
    this.setLoading = _options.setLoading;
    this.isMobile = _options.isMobile;

    this.settings = {
      radius: 1.4,
      cameraRadius: { value: 80 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    };

    this.clock = new THREE.Clock();

    this.resources = new Resources(sources);

    this.moves = [
      'bellydance',
      'breakdance',
      'hokeypokey',
      'macarena',
      'maraschino',
      'samba',
      'silly',
      'snake',
      'swing',
      'twerk',
      'wave',
    ];

    this.resources.on('ready', () => {
      this.setLoading(false);
      // this.createStats();
      this.createRenderer();
      this.createScene();
      this.createHDRI();
      this.createCamera();
      this.createLights();
      // this.createOrbitControls();
      this.createScenario();
      this.createModels();
      // this.createGUI();

      this.render();
    });

    // events
    this.window.addEventListener('resize', this.onResize.bind(this));
  }

  createGUI() {
    this.gui = new GUI();
    this.gui.add(this.settings.rotation, 'x', -50, 50).onChange((value) => {
      this.scenario.rotation.x = value;
    });
    this.gui.add(this.settings.rotation, 'y', -50, 50).onChange((value) => {
      this.scenario.rotation.y = value;
    });
    this.gui.add(this.settings.rotation, 'z', -50, 50).onChange((value) => {
      this.scenario.rotation.z = value;
    });
  }

  createStats() {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'fixed';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(this.window.devicePixelRatio);
    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.targetElement.appendChild(this.renderer.domElement);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createHDRI() {
    this.hdri = this.resources.items.envmap;
    this.hdri.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = this.hdri;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.window.innerWidth / this.window.innerHeight,
      0.2,
      2000
    );

    this.camera.position.y = 0;
    this.camera.position.z = 200;
  }

  createLights() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 5, 5);
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
    dirLight.shadow.bias = -0.0001;
  }

  createScenario() {
    const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.3,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    this.cylinder1 = new THREE.Mesh(geometry, material);
    this.cylinder1.receiveShadow = true;
    this.cylinder1.position.x = this.isMobile ? -1 : -2;
    this.cylinder1.position.y = -0.6;

    this.cylinder2 = new THREE.Mesh(geometry, material);
    this.cylinder2.receiveShadow = true;
    this.cylinder2.position.x = this.isMobile ? 1 : 2;
    this.cylinder2.position.y = -0.6;

    this.scenario = new THREE.Group();
    this.scenario.add(this.cylinder1);
    this.scenario.add(this.cylinder2);

    this.scene.add(this.scenario);
  }

  createModels() {
    this.models = this.resources.items;

    // Giulia
    this.giulia = this.models.giulia;
    this.giuliaMesh = this.giulia.scene.children[0];
    this.giuliaMesh.scale.set(0.01, 0.01, 0.01);
    this.giuliaMesh.position.y = -0.5;
    this.giuliaMesh.position.x = this.isMobile ? -1 : -2;
    this.giuliaMesh.castShadow = true;
    this.giuliaMesh.receiveShadow = true;
    this.giuliaMesh.children.forEach((element) => {
      element.receiveShadow = true;
      element.castShadow = true;
    });
    this.giuliaMixer = new THREE.AnimationMixer(this.giuliaMesh); // Unique mixer for Giulia
    this.giuliaClip = this.giulia.animations[1];
    this.giuliaAction = this.giuliaMixer.clipAction(this.giuliaClip);
    this.giuliaAction.play();
    this.scenario.add(this.giuliaMesh);

    // Vitor
    this.vitor = this.models.vitor;
    this.vitorMesh = this.vitor.scene.children[0];
    this.vitorMesh.position.y = -0.5;
    this.vitorMesh.position.x = this.isMobile ? 1 : 2;
    this.vitorMesh.receiveShadow = true;
    this.vitorMesh.children.forEach((element) => {
      element.receiveShadow = true;
      element.castShadow = true;
    });
    this.vitorMixer = new THREE.AnimationMixer(this.vitorMesh); // Unique mixer for Vitor
    this.vitorClip = this.vitor.animations[2];
    this.vitorAction = this.vitorMixer.clipAction(this.vitorClip);
    this.vitorAction.play();
    this.scenario.add(this.vitorMesh);
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
  }

  start() {
    gsap.fromTo(
      this.camera.position,
      {
        x: 0,
        y: 10,
        z: 200,
      },
      {
        x: 0,
        y: 0,
        z: 7,
        delay: 1,
        duration: 2,
      }
    );

    gsap.fromTo(
      this.scenario.rotation,
      {
        x: 0,
        y: Math.PI,
        z: 0,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        delay: 3,
        duration: 1,
      }
    );
  }

  changeDance() {
    // Ensure `lastGiuliaIndex` and `lastVitorIndex` exist
    if (this.lastGiuliaIndex === undefined) this.lastGiuliaIndex = -1;
    if (this.lastVitorIndex === undefined) this.lastVitorIndex = -1;

    // Giulia
    const previousGiuliaAction = this.giuliaAction; // Save the current action
    let randomGiuliaIndex;

    // Generate a new index different from the previous one
    do {
      randomGiuliaIndex = Math.floor(Math.random() * this.moves.length);
    } while (randomGiuliaIndex === this.lastGiuliaIndex);

    const newGiuliaDance = this.giulia.animations.find(
      (move) => move.name === this.moves[randomGiuliaIndex]
    );
    this.lastGiuliaIndex = randomGiuliaIndex; // Update last index
    this.giuliaClip = newGiuliaDance; // New clip
    this.giuliaAction = this.giuliaMixer.clipAction(this.giuliaClip); // Create new action
    this.giuliaAction.reset().fadeIn(0.5).play(); // Fade in the new action
    if (previousGiuliaAction) previousGiuliaAction.fadeOut(0.5); // Fade out the previous action

    // Vitor
    const previousVitorAction = this.vitorAction; // Save the current action
    let randomVitorIndex;

    // Generate a new index different from the previous one
    do {
      randomVitorIndex = Math.floor(Math.random() * this.moves.length);
    } while (randomVitorIndex === this.lastVitorIndex);

    const newVitorDance = this.vitor.animations.find(
      (move) => move.name === this.moves[randomVitorIndex]
    );
    this.lastVitorIndex = randomVitorIndex; // Update last index
    this.vitorClip = newVitorDance; // New clip
    this.vitorAction = this.vitorMixer.clipAction(this.vitorClip); // Create new action
    this.vitorAction.reset().fadeIn(0.5).play(); // Fade in the new action
    if (previousVitorAction) previousVitorAction.fadeOut(0.5); // Fade out the previous action
  }

  /**
   * EVENTS
   */
  onResize() {
    this.width = this.window.innerWidth;
    this.height = this.window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * LOOP
   */

  render() {
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.stats) this.stats.begin();
      this.delta = this.clock.getDelta();
      //this.camera.lookAt(0, 0, 0);
      this.renderer.render(this.scene, this.camera);
      if (this.controls) this.controls.update();
      // if (this.mixer) this.mixer.update(this.delta);
      if (this.giuliaMixer) this.giuliaMixer.update(this.delta);
      if (this.vitorMixer) this.vitorMixer.update(this.delta);
      if (this.stats) this.stats.end();
    };
    animate();
  }
}
