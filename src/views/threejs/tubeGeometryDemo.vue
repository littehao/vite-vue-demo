<template>
  <div id="myDiv"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { CSG } from "three-csg-ts";
import CreateScene from "./scene";
import groundimg from "@/assets/ground.jpg";

const width = 1200;
const height = 800;
const threeScene = ref(null);
const tubeGroup = ref(null);
const childHoleColor = [
  "#007EC8",
  "#FCB71E",
  "#01A751",
  "#C97F66",
  "#949599",
  "#FCFFFF",
];
const cableColor = [
  "#007EC8",
  "#FCB71E",
  "#01A751",
  "#C97F66",
  "#949599",
  "#FCFFFF",
  "#ED1B24",
  "#202221",
  "#FDF202",
  "#9E68A6",
  "#EE89B5",
  "#C7DC35",
];

const init = () => {
  const myDiv = document.getElementById("myDiv");
  threeScene.value = new CreateScene({
    width,
    height,
    dom: myDiv,
  });
  tubeGroup.value = new THREE.Group();
  threeScene.value.scene.add(tubeGroup.value);
};
//创建孔
const createLobby = () => {
  // 三维场景中添加一个立方体
  const geometry = new THREE.BoxGeometry(400, 400, 400);
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0xeeeeee,
    // wireframe: true,
  });
  const boxmesh = new THREE.Mesh(geometry, material);
  boxmesh.updateMatrix();
  // threeScene.value.scene.add(boxmesh);
  const path1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-200, 0, 0),
    new THREE.Vector3(-180, 0, 0),
  ]);
  const holeGeometry = new THREE.TubeGeometry(path1, 2, 130, 10, false);
  const holeGeometry2 = new THREE.CylinderGeometry(100, 100, 400);
  const holematerial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // wireframe: true,
  });
  const holemesh = new THREE.Mesh(holeGeometry, holematerial);
  const holemesh2 = new THREE.Mesh(holeGeometry2, holematerial.clone());
  // 设置井口位置
  holemesh2.position.set(0, 300, 0);
  // holemesh.rotateZ(Math.PI / 2);
  holemesh.updateMatrix();
  holemesh2.updateMatrix();
  // threeScene.value.scene.add(holemesh);
  // threeScene.value.scene.add(holemesh2);

  const subRes = CSG.subtract(boxmesh, holemesh);
  const subRes2 = CSG.subtract(subRes, holemesh2);
  threeScene.value.scene.add(subRes2);
  return subRes2;
};

const createTubeGeometry = (path, material) => {
  const geometry = new THREE.TubeGeometry(path, 2, 130, 10, false);
  const mesh = new THREE.Mesh(geometry, material);
  tubeGroup.value.add(mesh);
};

const createTubeGroup = () => {
  const path1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1000, 0, 0),
    new THREE.Vector3(-180, 0, 0),
  ]);
  const path2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(190, 0, 0),
    new THREE.Vector3(1000, 0, 0),
  ]);
  const path3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 200, 0),
    new THREE.Vector3(0, 430, 0),
  ]);
  const path4 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1400, 0, 0),
    new THREE.Vector3(2400, 0, 0),
  ]);
  const path5 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1200, 200, 0),
    new THREE.Vector3(1200, 430, 0),
  ]);
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0xeeeeee,
  });
  createTubeGeometry(path1, material);
  createTubeGeometry(path2, material.clone());
  createTubeGeometry(path3, material.clone());
  createTubeGeometry(path4, material.clone());
  createTubeGeometry(path5, material.clone());
};
//创建地面
const createPlane = () => {
  // 创建地面（地面是一个平面，使用PlaneGeometry定义）
  const textureLoader = new THREE.TextureLoader();
  const path1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 400, 0),
    new THREE.Vector3(0, 450, 0),
  ]);
  const path2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1200, 400, 0),
    new THREE.Vector3(1200, 450, 0),
  ]);
  const hole1 = new THREE.TubeGeometry(path1, 2, 130, 10, false);
  const hole2 = new THREE.TubeGeometry(path2, 2, 130, 10, false);
  const groundgeometry = new THREE.PlaneGeometry(width * 3, height * 2, 1, 1);
  const groundmaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    map: textureLoader.load(groundimg),
  });
  const material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  const groundMesh = new THREE.Mesh(groundgeometry, groundmaterial);
  const holePlaneMesh1 = new THREE.Mesh(hole1, material.clone());
  const holePlaneMesh2 = new THREE.Mesh(hole2, material.clone());
  groundMesh.position.y = 400;
  groundMesh.position.x = 600;
  groundMesh.position.z = -400;

  // 将地面的法线向上调整，使其正对屏幕
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.updateMatrix();
  holePlaneMesh1.updateMatrix();
  holePlaneMesh2.updateMatrix();
  const subRes1 = CSG.subtract(groundMesh, holePlaneMesh1);
  const subRes2 = CSG.subtract(subRes1, holePlaneMesh2);

  // 将地面添加到场景
  // threeScene.value.scene.add(groundMesh);
  // threeScene.value.scene.add(holePlaneMesh);
  threeScene.value.scene.add(subRes2);
};
//创建井盖
const createCover = () => {
  const coverGeometry = new THREE.CylinderGeometry(150, 150, 20);
  const holematerial = new THREE.MeshLambertMaterial({
    color: 0xeeeeee,
    side: THREE.DoubleSide,
    // wireframe: true,
  });
  const covermesh = new THREE.Mesh(coverGeometry, holematerial);
  threeScene.value.scene.add(covermesh);
  return covermesh;
};
//路径
const getCablesPaths = () => {
  const paths = [];
  const numInnerPipes = 6; // 光缆数量
  const angleStep = (2 * Math.PI) / numInnerPipes;
  // 动态创建子管道路径
  for (let i = 0; i < numInnerPipes; i++) {
    const angle = i * angleStep;
    const path = [
      new THREE.Vector3(-1000, Math.cos(angle) * 70, Math.sin(angle) * 70),
      new THREE.Vector3(2400, Math.cos(angle) * 70, Math.sin(angle) * 70),
    ];
    paths.push(path);
  }
  return paths;
};
//创建子孔
const createChildHole = () => {
  // 光缆路径
  const paths = getCablesPaths();
  const parentRadius = 200;
  const childRadius = parentRadius / 6;
  const cableGroup = new THREE.Group();
  cableGroup.name = "cableGroup";
  // 缩放比例，用于生成子管道的路径
  // 创建子管道的路径
  for (let i = 0; i < paths.length; i++) {
    const path = new THREE.CatmullRomCurve3(paths[i]);
    const geometry = new THREE.TubeGeometry(path, 32, childRadius, 16, false);
    const material = new THREE.MeshLambertMaterial({
      color: childHoleColor[i],
      wireframe: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    cableGroup.add(mesh);
  }
  threeScene.value.scene.add(cableGroup);
};

//创建光缆芯
const createCablefiber = () => {
  const fiberNum = 6; //每根光缆-光缆芯数量
  const cableGroup = threeScene.value.scene.getObjectByName("cableGroup");
  cableGroup.children.forEach((item, index) => {
    const angleStep = (2 * Math.PI) / fiberNum;
    const positions = [];
    const lineGroup = new THREE.Group();
    const originalPosition = item.geometry.attributes.position.array;
    for (let i = 0; i < fiberNum; i++) {
      const angle = i * angleStep;
      const path = [
        -1000,
        Math.cos(angle) * 70,
        Math.sin(angle) * 70,
        2400,
        Math.cos(angle) * 70,
        Math.sin(angle) * 70,
      ];
      positions.push(path);
    }
    console.log("originalPosition-------", originalPosition);
    for (let i = 0; i < fiberNum; i++) {
      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions(positions[3]);
      const matLine = new LineMaterial({
        color: cableColor[i],
        linewidth: 10, // in world units with size attenuation, pixels otherwise
        worldUnits: true,
        // vertexColors: true,
        // alphaToCoverage: true,
      });
      const line = new Line2(lineGeometry, matLine);
      line.computeLineDistances();
      lineGroup.add(line);
    }
    console.log("lineGroup--------", lineGroup);
    item.add(lineGroup);
  });
  // console.log(cableGroup);
  // 光缆路径
  // const paths = getCablesPaths();

  // for (let i = 0; i < paths.length; i++) {
  //   const curve = new THREE.CatmullRomCurve3(paths[i]);
  //   const positions = [];
  //   const points = curve.getPoints(10);
  //   for (let j = 0; j < points.length; j++) {
  //     const point = points[j];
  //     positions.push(point.x, point.y, point.z);
  //   }
  //   for (let j = 0; j < fiberNum; j++) {}

  // }
  // threeScene.value.scene.add(lineGroup);
};

onMounted(() => {
  init();
  createLobby();
  createLobby().position.set(1200, 0, 0);
  createTubeGroup();
  createPlane();
  createCover().position.set(0, 430, 0);
  createCover().position.set(1200, 430, 0);
  createChildHole();
  createCablefiber();
});
</script>

<style scoped lang="scss">
#myDiv {
  width: 1200;
  height: 800px;
  margin: 0 auto;
}
</style>
