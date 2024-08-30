import { createMemoryHistory, createRouter } from "vue-router";

import LayoutIndex from "@/layout/index.vue";

const routes = [
  {
    path: "/",
    component: LayoutIndex,
    redirect: "/tubeGeometryDemo",
    children: [
      {
        path: "/holedemo",
        component: () => import("../views/holedemo/index.vue"),
      },
      { path: "/antvx6", component: () => import("../views/antvx6/index.vue") },
      {
        path: "/tubeGeometry",
        component: () => import("../views/threejs/tubeGeometry.vue"),
      },
      {
        path: "/tubeGeometryDemo",
        component: () => import("../views/threejs/tubeGeometryDemo.vue"),
      },
      {
        path: "/transform",
        component: () => import("../views/css3/transform.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
