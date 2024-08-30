<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          router
          @select="handleSelect"
        >
          <el-menu-item index="/holedemo">Hole demo</el-menu-item>
          <el-menu-item index="/antvx6">antvx6</el-menu-item>
          <el-menu-item index="/tubeGeometry">tubeGeometry</el-menu-item>
          <el-menu-item index="/tubeGeometryDemo"
            >tubeGeometryDemo</el-menu-item
          >
          <el-menu-item index="/transform">transform</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeIndex = ref("/tubeGeometryDemo");
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
  activeIndex.value = key;
  router.push(key);
};
</script>

<style scoped lang="scss"></style>
