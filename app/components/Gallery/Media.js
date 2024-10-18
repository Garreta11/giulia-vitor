import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

export default class Media {
  constructor(_options = {}) {
    this.targetElement = _options.targetElement;
    this.element = _options.element;
    this.image = this.element.querySelector('img');
    this.geometry = _options.geometry;
    this.scene = _options.scene;
    this.screen = _options.screen;
    this.viewport = _options.viewport;
    this.height = _options.height;

    this.extra = 0;

    this.loader = new THREE.TextureLoader();

    this.createMesh();
    this.createBounds();
  }

  createMesh() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tMap: { value: this.loader.load(this.image.src) },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
        uImageSizes: { value: new THREE.Vector2(0, 0) },
        uViewportSizes: {
          value: new THREE.Vector2(
            this.targetElement.clientWidth,
            this.targetElement.clientHeight
          ),
        },
        uStrength: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();
    this.updateScale();
    this.updateX();
    this.updateY();

    this.mesh.material.uniforms.uPlaneSizes.value = [
      this.mesh.scale.x,
      this.mesh.scale.y,
    ];
  }

  updateScale() {
    this.aspectRatio = this.bounds.width / this.bounds.height;
    this.mesh.scale.x = this.aspectRatio;
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -(this.viewport.width / 2) +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }
  updateY(y = 0) {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height -
      this.extra;
  }

  onResize(sizes) {
    this.extra = 0;

    if (sizes) {
      const { height, screen, viewport } = sizes;

      if (height) this.height = height;
      if (screen) this.screen = screen;
      if (viewport) {
        this.viewport = viewport;

        this.mesh.material.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    this.createBounds();
  }

  update(y, direction) {
    this.updateScale();
    this.updateX();
    this.updateY(y.current);
    console.log(y.current);

    const planeOffset = this.mesh.scale.y / 2;
    const viewportOffset = this.viewport.height / 2;

    this.isBefore = this.mesh.position.y + planeOffset < -viewportOffset;
    this.isAfter = this.mesh.position.y - planeOffset > viewportOffset;

    if (direction === 'up' && this.isBefore) {
      this.extra -= this.height;

      this.isBefore = false;
      this.isAfter = false;
    }

    if (direction === 'down' && this.isAfter) {
      this.extra += this.height;

      this.isBefore = false;
      this.isAfter = false;
    }

    // this.mesh.material.uniforms.uStrength.value = ((y.current - y.last) / this.targetElement.clientWidth) * 10;
  }
}
