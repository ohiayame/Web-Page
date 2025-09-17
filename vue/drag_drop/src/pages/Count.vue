<script setup>
import { data } from "@/TestData.js";
import { ref } from "vue";

const dataList = ref([...data]);
const handleCount = (idx) => {
  dataList.value[idx] += 1;
};
</script>

<template>
  <div v-for="(item, idx) in dataList" :key="idx">
    <div v-if="item % 2 != 0" style="background-color: aqua">
      {{ item }}
    </div>
    <div v-else style="background-color: aquamarine">
      {{ item }}
    </div>

    <button @click="handleCount(idx)">Add 1</button>
  </div>
</template>
