<template>
  <div class="transform">
    <div id="popup" class="popup animated backInLeft">
      这是一个弹窗！<a href="#" class="close-popup">关闭</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped lang="scss">
.transform {
  width: 1000px;
  height: 800px;
  background: #ccc;
  position: relative;
}

.popup {
  width: 200px;
  height: 100px;
  background-color: #333;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.backInLeft {
  -webkit-animation-name: backInLeft;
  animation-name: backInLeft;
}
.animated {
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes backInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0) rotate(-120deg) scale(1.3);
    transform: translate3d(-100%, 0, 0) rotate(-120deg) scale(1.3);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0) scale(1);
    transform: translateZ(0) scale(1);
  }
}
@keyframes backInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0) rotate(-120deg) scale(1.3);
    transform: translate3d(-100%, 0, 0) rotate(-120deg) scale(1.3);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0) scale(1);
    transform: translateZ(0) scale(1);
  }
}
</style>
