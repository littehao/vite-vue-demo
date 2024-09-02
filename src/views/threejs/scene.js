import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer
} from "three/addons/renderers/CSS2DRenderer.js";
export default class CreateScene {
  constructor({ dom, width, height }) {
    // 场景
    this.scene = new THREE.Scene();

    // AxesHelper：辅助观察的坐标系
    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    // 相机
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    // this.camera.position.set(8, 100, 100);
    this.camera.position.set(-2178, 1127, 1597);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    //光源
    this.light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    this.scene.add(this.light);
    // 平行光
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    this.directionalLight.position.set(50, 70, 0);
    // 方向光默认指向xyz坐标原点
    this.scene.add(this.directionalLight);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    dom.appendChild(this.renderer.domElement);

    // 创建 CSS2渲染器
    this.css2Renderer = new CSS2DRenderer();
    // 用法和webgl渲染器渲染方法类似
    this.css2Renderer.render(this.scene, this.camera);
    this.css2Renderer.setSize(width, height);
    this.css2Renderer.domElement.style.position = 'absolute';
    this.css2Renderer.domElement.style.top = '0px';
    this.css2Renderer.domElement.style.left = '0px';
    this.css2Renderer.domElement.style.pointerEvents = 'none';
    dom.appendChild(this.css2Renderer.domElement);


    // 渲染循环
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
      this.css2Renderer.render(this.scene, this.camera);
    });

    // 相机控件
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.controls.addEventListener("change", () => {
      // 浏览器控制台查看相机位置变化
      // console.log("camera.position", this.camera.position);
    });

    // 画布尺寸随着窗口变化
    window.addEventListener("resize", () => {
      this.renderer.setSize(width, height);
      this.css2Renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }
}
