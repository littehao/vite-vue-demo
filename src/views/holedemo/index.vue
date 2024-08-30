<template>
  <div class="">
    <canvas id="myCanvas" width="200" height="200"></canvas>

    <div class="container"></div> 
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted((mount) => {
  const canvas = document.getElementById('myCanvas');  
  const ctx = canvas.getContext('2d');  
  
  // 父孔和子孔的参数  
  const parentRadius = 100;  
  const childRadius = 20;  
  const numChildren = 12; // 可以根据父孔和子孔的大小调整这个值  
  let childCenters = []; // 存储子孔中心的坐标 
  const fontSize = 16; // 文本字体大小 
  const textOffsetY = fontSize / 8; // 文本垂直偏移量（基于字体大小和额外间距）
  
  // 绘制圆形  
  function drawCircle(x, y, radius, color = 'black') {  
    ctx.beginPath();  
    ctx.arc(x, y, radius, 0, 2 * Math.PI);  
    ctx.fillStyle = color;  
    ctx.fill();  
    ctx.closePath();  
  }  

  // 绘制文本  
  function drawText(text, x, y, fontSize) {  
    ctx.font = `${fontSize}px Arial`;  
    ctx.fillStyle = 'black';  
    ctx.textAlign = 'center'; // 文本居中  
    ctx.textBaseline = 'middle'; // 文本基线居中  
    // 由于textBaseline是相对于文本基线（不是文本底部）的，我们需要额外调整y坐标  
    ctx.fillText(text, x, y + textOffsetY);  
  }  
  
  // 计算并绘制子孔  
  function drawInnerCircles() {  
    const centerX = canvas.width / 2;  
    const centerY = canvas.height / 2;   
    const startAngle = -Math.PI / 2; // 第一个子孔从顶部开始（12点钟方向）  
    const angleStep = 2 * Math.PI / numChildren; // 均匀分布的角度步长  
    
  
    // 确保子孔可以完全放入父孔内  
    if (2 * childRadius > parentRadius) {  
      console.error('子孔太大，无法内切于父孔内');  
      return;  
    }  
    // 绘制父孔  
    drawCircle(centerX, centerY, parentRadius);  

    for (let i = 0; i < numChildren; i++) {  
      const angle = startAngle + i * angleStep; 
      // 计算子孔中心的位置，使其边缘与父孔边缘相接触  
      const x = centerX + (parentRadius - childRadius) * Math.cos(angle);  
      const y = centerY + (parentRadius - childRadius) * Math.sin(angle);  
      drawCircle(x, y, childRadius,'red');  
      childCenters.push({ x, y, childRadius }); // 存储子孔中心坐标  

      // 绘制文本序号  
      drawText((i + 1).toString(), x, y, fontSize); 
    }  
  }  

  let currentHoverIndex = -1
  function mouseHandle(event,callback) {
    const rect = canvas.getBoundingClientRect();  
    const x = event.clientX - rect.left;  
    const y = event.clientY - rect.top;  
    const hoveredCircleIndex  = childCenters.findIndex((child,i) => {
      const { x: centerX, y: centerY } = childCenters[i]; 
      return Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(childRadius, 2) 
    })
    if(currentHoverIndex !== hoveredCircleIndex){
      for (let i = 0; i < numChildren; i++) {  
        const { x, y, childRadius } = childCenters[i];  
        drawCircle(x, y, childRadius,'red');   
        // 绘制文本序号  
        drawText((i + 1).toString(), x, y, fontSize);
      }  
    }
    if(hoveredCircleIndex > -1){
      currentHoverIndex = hoveredCircleIndex
      callback(hoveredCircleIndex)
    }
  }

  // 监听canvas的点击事件  
  canvas.addEventListener('click', function(event) {  
    mouseHandle(event,(i) => {
      console.log(`子孔 ${i + 1} 被点击`);  
    })
  });  
  // 监听canvas的点击事件  
  canvas.addEventListener('mousemove', function(event) {  
    mouseHandle(event,(i) => {
      const { x, y, childRadius } = childCenters[i];  
      drawCircle(x, y, childRadius,'blue');  
      // 绘制文本序号  
      drawText((i + 1).toString(), x, y, fontSize); 
      console.log(`鼠标移入子孔 ${i + 1}`);  
    })
  });  
  
  drawInnerCircles();  
});

onMounted(() => {
  const container = document.querySelector('.container');  
  const numCircles = 20;  
  const radius = 170; // 父容器半径（实际大小由容器尺寸决定）  
  const circleRadius = 28; // 子圆半径 
  const circleSize =  circleRadius * 2

  
  // 计算并创建圆形  
  for (let i = 0; i < numCircles; i++) { 
    const angle = -(Math.PI / 2) + i * (2 * Math.PI / numCircles);
    const x = container.offsetWidth / 2 + radius * Math.cos(angle);  
    const y = container.offsetHeight / 2 + radius * Math.sin(angle) ;  
  
    const circle = document.createElement('div');  
    circle.innerText = (i + 1)
    circle.classList.add('circleItem');  
    circle.style.left = `${x - circleRadius}px`;  
    circle.style.top = `${y - circleRadius}px`;  
    circle.style.width = `${circleSize}px`;  
    circle.style.height = `${circleSize}px`;  
  
    // 监听鼠标移入事件  
    circle.addEventListener('mouseenter', function() {  
      this.style.backgroundColor = 'blue';  
    });  
  
    // 监听鼠标移出事件（可选，用于恢复颜色）  
    circle.addEventListener('mouseleave', function() {  
      this.style.backgroundColor = 'red';  
    });  
  
    container.appendChild(circle);  
  }  
})
</script>

<style scoped lang="scss">
canvas {
  border: 1px solid black;
  cursor: pointer;
}

  
</style>
