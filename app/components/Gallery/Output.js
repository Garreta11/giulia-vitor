import * as THREE from 'three';

import { lerp } from './utils/math';
import Media from './Media';

export default class Output {
  constructor(_options = {}) {
    this.targetElement = _options.targetElement;
    this.window = _options.window;

    this.width = this.targetElement.clientWidth; // or window.innerWidth
    this.height = this.targetElement.clientHeight; // or window.innerHeight

    this.screen = {
      height: this.height,
      width: this.width,
    };

    // create scene
    this.scene = new THREE.Scene();

    // create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(this.window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x080808, 0);

    this.targetElement.appendChild(this.renderer.domElement);

    // Initialize variable
    this.time = 0;
    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0,
    };

    this.speed = 2;

    // create camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2.5);

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = {
      height,
      width,
    };

    // Add a light to the scene
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);

    this.createGeometry();
    this.createMedias();
    this.createGallery();

    this.window.addEventListener('resize', this.onResize.bind(this));
    this.render();
  }

  createGallery() {
    this.gallery = document.querySelector('.gallery');
    this.galleryBounds = this.gallery.getBoundingClientRect();
    this.galleryHeight =
      (this.viewport.height * this.galleryBounds.height) /
      this.targetElement.clientHeight;

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          height: this.galleryHeight,
          screen: this.screen,
          viewport: this.viewport,
        })
      );
    }
  }

  createGeometry() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1);
  }

  createMedias() {
    this.mediasElements = document.querySelectorAll('.gallery-figure');
    this.medias = Array.from(this.mediasElements).map((element) => {
      let media = new Media({
        targetElement: this.targetElement,
        element,
        geometry: this.planeGeometry,
        height: this.galleryHeight,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
      });

      return media;
    });
  }

  onResize() {
    // Update camera aspect ratio and renderer size on resize
    this.width = this.targetElement.clientWidth; // or window.innerWidth
    this.height = this.targetElement.clientHeight; // or window.innerHeight
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  render() {
    this.scroll.target += this.speed;

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'down';
      this.speed = 5;
    } else if (this.scroll.current < this.scroll.last) {
      this.direction = 'up';
      this.speed = -5;
    }

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, this.direction));
    }

    this.scroll.last = this.scroll.current;

    this.time += 0.05;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
