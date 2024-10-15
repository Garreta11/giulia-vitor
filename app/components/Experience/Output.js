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

    this.settings = {
      radius: 1.4,
      cameraRadius: { value: 80 },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    };

    this.clock = new THREE.Clock();

    this.resources = new Resources(sources);

    this.resources.on('ready', () => {
      this.setLoading(false);
      this.createStats();
      this.createRenderer();
      this.createScene();
      this.createHDRI();
      this.createCamera();
      this.createLights();
      this.createOrbitControls();
      this.createScenario();
      this.createModels();
      this.setupScrollTrigger();
      this.createGUI();

      this.render();
    });

    // events
    this.window.addEventListener('resize', this.onResize.bind(this));
  }

  createGUI() {
    this.gui = new GUI();
    this.gui.add(this.settings.position, 'x', -50, 50).onChange((value) => {
      this.camera.position.x = value;
    });
    this.gui.add(this.settings.position, 'y', -50, 50).onChange((value) => {
      this.camera.position.y = value;
    });
    this.gui.add(this.settings.position, 'z', -50, 50).onChange((value) => {
      this.camera.position.z = value;
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

    this.camera.position.y = 10;
    this.camera.position.z = 200;
  }

  createLights() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(0, 5, 5);
    this.scene.add(dirLight);

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const helper = new THREE.DirectionalLightHelper(dirLight, 1);
    this.scene.add(helper);

    let d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 20000;
    dirLight.shadow.bias = -0.0001;
  }

  createScenario() {
    this.exhibition = this.resources.items.exhibition;

    this.exhibition.children.forEach((element) => {
      element.receiveShadow = true;
      element.material = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.3,
        metalness: 0,
        side: THREE.DoubleSide,
      });
    });

    this.scene.add(this.exhibition);

    this.exhibition.scale.set(0.05, 0.05, 0.05);
    this.exhibition.position.y = -2.5;
    this.exhibition.position.z = -5;
    this.exhibition.rotation.y = Math.PI;
  }

  createModels() {
    this.models = this.resources.items;
    this.giulia = this.models.giulia;
    this.giuliaMesh = this.giulia.scene.children[0];

    this.giuliaMesh.scale.set(0.01, 0.01, 0.01);
    this.giuliaMesh.position.y = -2;
    this.giuliaMesh.castShadow = true;
    this.giuliaMesh.receiveShadow = true;
    this.giuliaMesh.children.forEach((element) => {
      element.receiveShadow = true;
      element.castShadow = true;
    });

    this.mixer = new THREE.AnimationMixer(this.giuliaMesh);
    this.clip = this.giulia.animations[1];
    this.action = this.mixer.clipAction(this.clip);
    // this.action.setLoop(THREE.LoopOnce);
    // this.action.clampWhenFinished = true; // Make the animation stay on its final frame when finished
    this.action.play();
    this.scene.add(this.giuliaMesh);
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
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
        y: -1,
        z: 7,
        delay: 1,
        duration: 5,
      }
    );

    gsap.fromTo(
      this.exhibition.rotation,
      {
        x: 0,
        y: Math.PI,
        z: 0,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        delay: 1,
        duration: 3,
      }
    );
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
