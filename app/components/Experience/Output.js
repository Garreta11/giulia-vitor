import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import gsap from 'gsap';
import Resources from '@/app/utils/Resources';
import sources from '@/app/data/models';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GUI } from 'dat.gui';

/* import studio from '@theatre/studio';
import * as core from '@theatre/core'; */

// studio.initialize();

export default class Output {
  constructor(_options = {}) {
    // Basic setup
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.targetElement = _options.targetElement;
    this.setLoading = _options.setLoading;

    this.settings = {
      radius: 1.4,
      cameraRadius: { value: 80 },
    };

    this.clock = new THREE.Clock();

    this.resources = new Resources(sources);

    this.resources.on('ready', () => {
      console.log('resources are ready');
      this.setLoading(false);
      this.createStats();
      this.createRenderer();
      this.createScene();
      this.createCamera();
      this.createLights();
      this.createModels();
      this.setupScrollTrigger();
      this.createGUI();

      //this.createTheatre();

      this.render();
    });

    // events
    window.addEventListener('resize', this.onResize.bind(this));
  }

  createGUI() {
    this.gui = new GUI();
    const radiusController = this.gui
      .add(this.settings, 'radius', 0, Math.PI * 2)
      .step(0.01);
    radiusController.onChange((value) => {
      console.log(value);
      this.camera.position.x = Math.cos(value) * this.cameraRadius;
      this.camera.position.z = Math.sin(value) * this.cameraRadius;
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.targetElement.appendChild(this.renderer.domElement);
  }

  createScene() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xffffff);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.2,
      2000
    );

    gsap.to(this.settings.cameraRadius, {
      value: 8,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.camera.position.x =
          Math.cos(this.settings.radius) * this.settings.cameraRadius.value;
        this.camera.position.y = 3;
        this.camera.position.z =
          Math.sin(this.settings.radius) * this.settings.cameraRadius.value;
      },
    });
  }

  createLights() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 2);
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

  createModels() {
    this.models = this.resources.items;
    this.giulia = this.models.giulia;
    this.giuliaMesh = this.giulia.scene.children[0];

    this.giuliaMesh.scale.set(0.01, 0.01, 0.01);

    this.mixer = new THREE.AnimationMixer(this.giuliaMesh);
    this.clip = this.giulia.animations[0];
    this.action = this.mixer.clipAction(this.clip);
    this.action.setLoop(THREE.LoopOnce);
    this.action.clampWhenFinished = true; // Make the animation stay on its final frame when finished
    this.action.play();
    this.scene.add(this.giuliaMesh);
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  setupScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger);

    this.desktopAnimation = () => {
      this.section = 0;
      this.tl = gsap.timeline({
        default: {
          duration: 1,
          ease: 'power2.inOut',
        },
        scrollTrigger: {
          trigger: '.page',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      /* // Section #1
      this.tl.to(
        this.camera.position,
        {
          x: 1,
          y: 3,
          z: 8,
          onStart: () => {
            console.log('onStart');
            this.clip = this.giulia.animations[1];
            this.action.fadeOut(0.5);
            this.action = this.mixer.clipAction(this.clip);
            this.action.fadeIn(0.5);
            // Play the animation only once
            // this.action.setLoop(THREE.LoopOnce);
            // this.action.clampWhenFinished = true; // Make the animation stay on its final frame when finished
            this.action.play();
          },
        },
        this.section
      );

      // Section #2
      this.section++;
      this.tl.to(
        this.camera.position,
        {
          x: -1,
          y: 3,
          z: 8,
          onStart: () => {
            this.clip = this.giulia.animations[3];

            this.action.fadeOut(0.5);
            this.action = this.mixer.clipAction(this.clip);
            this.action.fadeIn(0.5);
            // Play the animation only once
            // this.action.setLoop(THREE.LoopOnce);
            // this.action.clampWhenFinished = true; // Make the animation stay on its final frame when finished
            this.action.play();
          },
        },
        this.section
      ); */
    };

    ScrollTrigger.matchMedia({
      '(prefers-reduced-motion: no-preference)': this.desktopAnimation,
    });
  }

  createTheatre() {
    this.project = core.getProject('giulia-vitor-experience');

    this.sheet = this.project.sheet('Animated Scene');

    this.cameraObject = this.sheet.object('Camera', {
      rotation: core.types.compound({
        x: core.types.number(this.camera.rotation.x, { range: [-2, 2] }),
        y: core.types.number(this.camera.rotation.y, { range: [-2, 2] }),
        z: core.types.number(this.camera.rotation.z, { range: [-2, 2] }),
      }),
      position: core.types.compound({
        x: core.types.number(this.camera.position.x, { range: [-2, 2] }),
        y: core.types.number(this.camera.position.y, { range: [-2, 2] }),
        z: core.types.number(this.camera.position.z, { range: [-2, 80] }),
      }),
    });
    this.cameraObject.onValuesChange((values) => {
      this.camera.rotation.x = values.rotation.x;
      this.camera.rotation.y = values.rotation.y;
      this.camera.rotation.z = values.rotation.z;
      this.camera.position.x = values.position.x;
      this.camera.position.y = values.position.y;
      this.camera.position.z = values.position.z;
    });
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

  /**
   * LOOP
   */

  render() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.stats.begin();
      this.delta = this.clock.getDelta();
      //this.camera.lookAt(0, 0, 0);
      this.renderer.render(this.scene, this.camera);
      if (this.controls) this.controls.update();
      if (this.mixer) this.mixer.update(this.delta);
      this.stats.end();
    };
    animate();
  }
}