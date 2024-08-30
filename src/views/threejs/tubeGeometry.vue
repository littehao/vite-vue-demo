<template>
  <div id="myDiv"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

onMounted(() => {
  const myDiv = document.getElementById("myDiv");
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  const width = 800;
  const height = 800;

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(-704, 165, 740);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  scene.add(light);
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(50, 70, 0);
  // 方向光默认指向xyz坐标原点
  scene.add(directionalLight);

  // 1.antialias:true抗锯齿
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  // 1.设置渲染器的大小和页面大小一样大
  renderer.setSize(width, height);
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, camera); //执行渲染操作
  myDiv.appendChild(renderer.domElement);

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", function () {
    // 浏览器控制台查看相机位置变化
    console.log("camera.position", camera.position);
  });

  // // 添加立方体
  // const geometry = new THREE.BoxGeometry(4, 4, 4);
  // const material = new THREE.MeshLambertMaterial({
  //   color: 0x00ff00, //设置材质颜色
  // });
  // const mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);

  let points = [
    { x: -300, y: 0, z: 0 },
    // { x: 15, y: 0, z: 0 },
    // { x: 15, y: 20, z: 0 },
    // { x: 15, y: 20, z: 20 },
    // { x: 35, y: 20, z: 20 },
    // { x: 55, y: 0, z: 0 },
    { x: 500, y: 0, z: 0 },
  ];
  points = points.map(({ x, y, z }) => new THREE.Vector3(x, y, z));
  const curve = new THREE.CatmullRomCurve3(points);
  curve.curveType = "centripetal";
  curve.closed = false;
  const geometry1 = new THREE.TubeGeometry(curve, 200, 70, 20, false);
  const material1 = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide, //双面显示看到管道内壁
    color: 0xfff000,
  });
  const mesh1 = new THREE.Mesh(geometry1, material1);
  scene.add(mesh1);

  // 第二个管道的材料和几何体，使用更小的半径
  // const material2 = new THREE.MeshLambertMaterial({
  //   side: THREE.DoubleSide, //双面显示看到管道内壁
  //   color: 0x0000ff,
  // });
  // const geometry2 = new THREE.TubeGeometry(curve, 200, 20, 20, false); // 半径为1
  // const mesh2 = new THREE.Mesh(geometry2, material2);
  // // 将第二个管道沿Y轴稍微偏移，以便可以看到它
  // mesh2.position.y += 0.5;
  // scene.add(mesh2);
  // 小管道的参数
  const numInnerPipes = 6;
  const innerRadius = 20; // 小管道的半径
  const angleStep = (2 * Math.PI) / numInnerPipes;
  // 创建小管道
  for (let i = 0; i < numInnerPipes; i++) {
    const angle = i * angleStep;
    const offset = new THREE.Vector3(
      Math.cos(angle) * 50, // 假设主管道半径为1，这里使用1.5作为偏移量（根据实际情况调整）
      0,
      Math.sin(angle) * 50
    );
    let y = i >= 3 ? -20 : 20;
    const innerPathPoints = [
      offset.clone().add(new THREE.Vector3(-300, y, 0)),
      offset.clone().add(new THREE.Vector3(500, y, 0)),
    ];
    const innerPath = new THREE.CatmullRomCurve3(innerPathPoints);
    // 创建小管道的TubeGeometry（注意：这里只是示意，实际上TubeGeometry需要更多的细分）
    const innerGeometry = new THREE.TubeGeometry(
      innerPath,
      200,
      innerRadius,
      20,
      false
    );
    const innerMaterial = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide, //双面显示看到管道内壁
      color: 0xaaaaaa,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);

    // 旋转小管道以匹配主管道的方向（这里假设主管道是水平的，所以不需要额外旋转）
    // 如果主管道不是水平的，你可能需要计算旋转矩阵并应用到innerMesh上

    // 将小管道添加到场景中
    scene.add(innerMesh);
  }

  // 创建地面（地面是一个平面，使用PlaneGeometry定义）
  const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.y = -70;

  // 将地面的法线向上调整，使其正对屏幕
  plane.rotation.x = -Math.PI / 2;

  // 将地面添加到场景
  scene.add(plane);

  function render() {
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行函数render
  }
  render();
});
</script>

<style scoped lang="scss">
#myDiv {
  width: 800px;
  height: 800px;
}
</style>
