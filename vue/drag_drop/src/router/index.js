import { createRouter, createWebHistory } from "vue-router";

import Count from "@/pages/Count.vue";
import DragDrop from "@/pages/DragDrop.vue";

const routes = [
  { path: "/", name: "Count", component: Count },
  { path: "/drag", name: "DragDrop", component: DragDrop },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
