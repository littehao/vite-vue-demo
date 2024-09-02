<template>
  <div id="myDiv">
    <div class="flex btngroup">
      <el-button
        v-for="(item, index) in coverData"
        type="primary"
        @click="openCover(index)"
        >{{ item.isclose ? "打开" : "关闭" }}{{ item.name }}</el-button
      >
    </div>

    <span class="coverItem" v-for="(item, index) in coverData" :key="index">{{
      item.name
    }}</span>
  </div>

  <el-dialog v-model="dialogVisible" title="光缆信息" width="30%">
    <span>光缆信息详情</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="closeDialog">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import TWEEN from "@tweenjs/tween.js";

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
const ctroMeshs = []; //可点击物体
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

// 初始化
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
//创建人手井大厅
const boxSize = 400;
const loabbyList = [
  [0, 0, 0],
  [1200, 0, 0],
];
const lobbyGroup = new THREE.Group();
const lobbyItem = (material) => {
  // 三维场景中添加一个立方体
  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const boxmesh = new THREE.Mesh(geometry, material);
  boxmesh.updateMatrix();
  // threeScene.value.scene.add(boxmesh);
  const path1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-200, 0, 0),
    new THREE.Vector3(-180, 0, 0),
  ]);
  // const holeGeometry = new THREE.TubeGeometry(path1, 2, 130, 10, false);
  const holeGeometry = new THREE.BoxGeometry(500, 200, 300);
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
  return subRes2;
};
const createLobby = () => {
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0xeeeeee,
    // wireframe: true,
  });
  loabbyList.forEach((item) => {
    const lobby = lobbyItem(material.clone());
    lobby.position.set(...item);
    lobbyGroup.add(lobby);
  });
  threeScene.value.scene.add(lobbyGroup);
};
// 创建管道
const createTubeGeometry = (path, material, radius) => {
  const geometry = new THREE.TubeGeometry(path, 2, radius, 10, false);
  const mesh = new THREE.Mesh(geometry, material);
  tubeGroup.value.add(mesh);
};

// 创建父孔组
const radius = 50;
// 6个父孔
const tubeNums = 6;
//管道路径
const tubePaths = [];
const createTubeGroup = () => {
  let y = 50;
  let num = -1;
  const fatherPos = [];
  for (let i = 0; i < tubeNums; i++) {
    let z = num * 100;
    tubePaths.push([
      [new THREE.Vector3(-1000, 0, 0), new THREE.Vector3(-170, 0, 0)],
      [new THREE.Vector3(180, 0, 0), new THREE.Vector3(1020, 0, 0)],
      [new THREE.Vector3(1380, 0, 0), new THREE.Vector3(2400, 0, 0)],
    ]);
    if (i < 3) {
      fatherPos.push([0, y, z]);
      num++;
    } else {
      num--;
      z = num * 100;
      fatherPos.push([0, -y, z]);
    }
  }
  // 父孔管道路径
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0xeeeeee,
  });

  const fatherGroup = new THREE.Group();
  fatherGroup.name = "fatherGroup";
  tubePaths.forEach((item, index) => {
    const meshs = new THREE.Group();
    meshs.position.set(...fatherPos[index]);
    item.forEach((path) => {
      const tube = new THREE.CatmullRomCurve3(path);
      const geometry = new THREE.TubeGeometry(tube, 2, radius, 16, false);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "fatherTube";
      meshs.add(mesh);
      ctroMeshs.push(mesh);
    });
    fatherGroup.add(meshs);
  });
  tubeGroup.value.add(fatherGroup);
  // 井口1管道路径
  const wellhead1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 200, 0),
    new THREE.Vector3(0, 430, 0),
  ]);
  // 井口2管道路径
  const wellhead2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1200, 200, 0),
    new THREE.Vector3(1200, 430, 0),
  ]);
  createTubeGeometry(wellhead1, material.clone(), 130);
  createTubeGeometry(wellhead2, material.clone(), 130);
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
const coverData = ref([
  {
    name: "人手井1",
    pos: [0, 430, 0],
    isclose: true,
  },
  {
    name: "人手井2",
    pos: [1200, 430, 0],
    isclose: true,
  },
]);
const createCover = () => {
  const coverGroup = new THREE.Group();
  coverGroup.name = "coverGroup";
  coverData.value.forEach((item) => {
    const coverGeometry = new THREE.CylinderGeometry(150, 150, 20);
    const holematerial = new THREE.MeshLambertMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide,
      // wireframe: true,
    });
    const covermesh = new THREE.Mesh(coverGeometry, holematerial);
    covermesh.name = item.name;
    covermesh.isclose = true; // 井盖默认关闭
    covermesh.position.set(...item.pos);
    coverGroup.add(covermesh);
  });
  threeScene.value.scene.add(coverGroup);
};
// 创建井盖标签
const createCoverLabels = () => {
  const tags = new THREE.Group();
  const div = document.querySelectorAll(".coverItem");
  const coverGroup =
    threeScene.value.scene.getObjectByName("coverGroup").children;
  // console.log(coverGroup);
  // HTML元素转化为threejs的CSS2模型对象
  div.forEach((item, index) => {
    const tag = new CSS2DObject(item);
    tag.position.set(...coverGroup[index].position);
    tag.position.y += 100;
    tags.add(tag);
  });
  threeScene.value.scene.add(tags);
};
//路径
const getCablesPaths = () => {
  const paths = [];
  const positions = [];
  const numInnerPipes = 6; // 光缆数量
  const angleStep = (2 * Math.PI) / numInnerPipes;
  // 动态创建子管道路径
  for (let i = 0; i < numInnerPipes; i++) {
    const angle = i * angleStep;
    const path = [
      new THREE.Vector3(-1100, Math.cos(angle), Math.sin(angle)),
      new THREE.Vector3(2500, Math.cos(angle), Math.sin(angle)),
    ];
    positions.push({ x: 0, y: Math.cos(angle) * 30, z: Math.sin(angle) * 30 });
    paths.push(path);
  }
  return { paths, positions };
};
//创建子孔
const createChildHole = () => {
  // 光缆路径
  const fatherGroup = threeScene.value.scene.getObjectByName("fatherGroup");
  fatherGroup.children.forEach((item) => {
    const { paths, positions } = getCablesPaths();
    const parentRadius = 80;
    const childRadius = parentRadius / 6;
    const cableGroup = new THREE.Group();
    cableGroup.name = "cableGroup";
    // 缩放比例，用于生成子管道的路径
    // 创建子管道的路径
    for (let i = 0; i < paths.length; i++) {
      const path = new THREE.CatmullRomCurve3(paths[i]);
      const geometry = new THREE.TubeGeometry(path, 32, childRadius, 16, false);
      const material = new THREE.MeshLambertMaterial({
        color: 0xdddddd, //childHoleColor[i]
        wireframe: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = `tube${i + 1}`;
      mesh.position.set(...Object.values(positions[i]));
      cableGroup.add(mesh);
      ctroMeshs.push(mesh);
    }
    item.add(cableGroup);
  });

  // threeScene.value.scene.add(cableGroup);
};

//创建光缆芯
const createCablefiber = () => {
  const fiberNum = 6; //每根光缆-光缆芯数量
  const angleStep = (2 * Math.PI) / fiberNum;
  const matLine = new LineMaterial({
    color: "#007EC8",
    linewidth: 6, // in world units with size attenuation, pixels otherwise
    worldUnits: true,
    // vertexColors: true,
    // alphaToCoverage: true,
  });
  const fatherGroup = threeScene.value.scene.getObjectByName("fatherGroup");
  fatherGroup.children.forEach((child) => {
    const cableGroup = child.getObjectByName("cableGroup");
    cableGroup.children.forEach((item, index) => {
      item.cableColor = cableColor;
      for (let i = 0; i < fiberNum; i++) {
        const angle = i * angleStep;
        const path = [
          -1110,
          Math.cos(angle),
          Math.sin(angle),
          2600,
          Math.cos(angle),
          Math.sin(angle),
        ];
        const lineGeometry = new LineGeometry();
        lineGeometry.setPositions(path);
        const line = new Line2(lineGeometry, matLine.clone());
        line.name = "cableLine";
        line.material.color.set(item.cableColor[i]);
        line.position.set(0, Math.cos(angle) * 6, Math.sin(angle) * 6);
        line.computeLineDistances();
        item.add(line);
        ctroMeshs.push(line);
      }
    });
  });
};

//鼠标点击选中模型
const currentIntersected = ref(null);
const dialogVisible = ref(false);
const createEvent = () => {
  threeScene.value.renderer.domElement.addEventListener(
    "click",
    function (event) {
      const fatherGroup = threeScene.value.scene.getObjectByName("fatherGroup");
      if (!fatherGroup) return;
      // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
      const px = event.offsetX;
      const py = event.offsetY;
      //屏幕坐标px、py转WebGL标准设备坐标x、y
      //width、height表示canvas画布宽高度
      const x = (px / width) * 2 - 1;
      const y = -(py / height) * 2 + 1;
      //创建一个射线投射器`Raycaster`
      const raycaster = new THREE.Raycaster();
      const mouseVector = new THREE.Vector3();
      mouseVector.set(x, y, 0);
      raycaster.setFromCamera(mouseVector, threeScene.value.camera);
      raycaster.params.Line.threshold = 0.01;
      const intersects = raycaster.intersectObjects(ctroMeshs, false);
      // console.log(intersects);
      // intersects.length大于0说明，说明选中了模型
      if (
        currentIntersected.value &&
        currentIntersected.value.userData.originalColor
      ) {
        // 恢复原始颜色
        currentIntersected.value.material.color =
          currentIntersected.value.userData.originalColor;
        // 清除当前选中物体
        currentIntersected.value = null;
      }
      if (intersects.length > 0) {
        if (!intersects[0].object.name.includes("cableLine")) return;
        // 选中模型的第一个模型，设置为红色
        for (var i = 0; i < intersects.length; i++) {
          // 遍历线相交模型
          if (intersects[i].object instanceof THREE.Mesh) {
            intersects[i].object.userData.originalColor =
              intersects[i].object.material.color.clone();
            currentIntersected.value = intersects[i].object;
            // 取第一个（距离最近）的相交Mesh类型模型
            intersects[i].object.material.color.set(0xff0000);
            dialogVisible.value = true;
            break;
          }
        }
      }
    }
  );
};

//查看光缆详情
const closeDialog = () => {
  if (
    currentIntersected.value &&
    currentIntersected.value.userData.originalColor
  ) {
    // 恢复原始颜色
    currentIntersected.value.material.color =
      currentIntersected.value.userData.originalColor;
    // 清除当前选中物体
    currentIntersected.value = null;
  }
  dialogVisible.value = false;
};

//打开井盖
const openCover = (index) => {
  const coverGroup =
    threeScene.value.scene.getObjectByName("coverGroup").children;
  const cover = coverGroup[index];
  cover.isclose = !cover.isclose;
  coverData.value[index].isclose = cover.isclose;
  const tween = new TWEEN.Tween(cover.position);
  if (cover.isclose) {
    tween
      .to({ x: cover.position.x + 250 }, 1000) // 旋转一周需要2秒
      .start(); // 开始动画
  } else {
    tween
      .to({ x: cover.position.x - 250 }, 1000) // 旋转一周需要2秒
      .start(); // 开始动画
  }
};

//渲染动画
const createAnimate = () => {
  requestAnimationFrame(createAnimate);
  TWEEN.update(); // 更新Tween动画
};

onMounted(() => {
  init();
  createLobby();
  createTubeGroup();
  createPlane();
  createCover();
  createChildHole();
  createCablefiber();
  createEvent();
  createCoverLabels();
  createAnimate();
});
</script>

<style scoped lang="scss">
#myDiv {
  width: 1200px;
  height: 800px;
  margin: 0 auto;
  position: relative;
}
.btngroup {
  position: absolute;
  left: 50px;
  top: 50px;
}
.coverItem {
  display: block;
  background-color: rgba($color: #000000, $alpha: 0.5);
  color: #fff;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
