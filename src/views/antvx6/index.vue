<template>
  <div id="htmlpdf">
    <div id="container"></div>
    <div>
      <el-button type="primary" @click="exportPdf">导出</el-button>
    </div>
    <canvas id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Graph, Model } from "@antv/x6";
import jsPDF from "jspdf";
import { Edit,Share,Delete,Search } from '@element-plus/icons-vue'

import { Canvg } from "canvg";

const renderX6 = () => {
  Graph.registerNode(
    "custom-node",
    {
      width: 200,
      height: 60,
      attrs: {
        body: {
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "rgba(95,149,255,0.05)",
          refWidth: 1,
          refHeight: 1,
        },
        image: {
          "xlink:href":
            "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
          width: 16,
          height: 16,
          x: 12,
          y: 12,
        },
        title: {
          text: "Node",
          refX: 40,
          refY: 14,
          fill: "rgba(0,0,0,0.85)",
          fontSize: 12,
          "text-anchor": "start",
        },
        text: {
          text: "this is content text",
          refX: 40,
          refY: 38,
          fontSize: 12,
          fill: "rgba(0,0,0,0.6)",
          "text-anchor": "start",
        },
      },
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "image",
          selector: "image",
        },
        {
          tagName: "text",
          selector: "title",
        },
        {
          tagName: "text",
          selector: "text",
        },
      ],
    },
    true
  );

  const graph = new Graph({
    container: document.getElementById("container"),
    grid: true,
  });

  graph.addNode({
    x: 200,
    y: 160,
    shape: "custom-node",
  });
};
onMounted(() => {
  renderX6()
});

const svgToPdf = (svgElement, filename) => {
  html2canvas(svgElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename + ".pdf");
  });
};

const getBlobUrl = (svgElement) => {
  // SVG转换为XML字符串
  const xml = new XMLSerializer().serializeToString(svgElement);

  // 创建blob对象
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  return URL.createObjectURL(blob);
};

const exportSvgToPdf = async () => {
  const svgElement = document.querySelectorAll("svg")[0];
  // const canvas = document.createElement('canvas');
  // const canvas = document.querySelector("canvas");
  // const ctx = canvas.getContext("2d");

  // // 设置canvas的尺寸与SVG相同
  // canvas.width = svgElement.clientWidth;
  // canvas.height = svgElement.clientHeight;
  let parentNode = svgElement.parentNode;
  const url = getBlobUrl(svgElement);
  console.log(url);
  let img = new Image();

  img.src = url;

  img.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;

    let ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    parentNode.removeChild(svgElement);

    parentNode.appendChild(canvas);
  };

  // const v = await  Canvg.from(url);

  // v.start(); // 开始渲染
};

const exportPdf = () => {
  // const dom = document.querySelector('htmlpdf');
  exportSvgToPdf();
};

onMounted(async () => {
  // const svgElement = document.querySelectorAll("svg")[0];
  // const canvas = document.querySelector('canvas');
  // const ctx = canvas.getContext('2d');
  // console.log(svgElement)
  // const v = await new Canvg(ctx, svgElement);
  // // Start SVG rendering with animations and mouse handling.
  // v.start();
});
</script>

<style scoped lang="scss">
#container {
  width: 800px;
  height: 500px;
  margin: 0 auto;
}
</style>
