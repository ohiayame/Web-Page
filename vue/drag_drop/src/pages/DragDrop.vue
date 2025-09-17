<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";

// 과일 / 동물 리스트
const set1 = ref(["1", "2", "3"]);
const set2 = ref(["10", "20", "30"]);
const set3 = ref([]);
const set4 = ref([]);
</script>

<template>
  <div style="display: flex; gap: 2rem">
    <!-- 과일 영역 -->
    <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
      <h3>set1</h3>
      <draggable v-model="set1" group="items">
        <template #item="{ element }">
          <div
            style="
              padding: 8px;
              border: 1px solid #ccc;
              margin: 4px 0;
              background: #e6f7ff;
            "
          >
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>

    <!-- 동물 영역 -->
    <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
      <h3>set2</h3>
      <draggable v-model="set2" group="items">
        <template #item="{ element }">
          <div
            style="
              padding: 8px;
              border: 1px solid #ccc;
              margin: 4px 0;
              background: #e6f7ff;
            "
          >
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>

    <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
      <h3>set3</h3>
      <draggable v-model="set3" group="items">
        <template #item="{ element }">
          <div
            style="
              padding: 8px;
              border: 1px solid #ccc;
              margin: 4px 0;
              background: #e6f7ff;
            "
          >
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>

    <div style="flex: 1; border: 2px dashed #87ceeb; padding: 1rem">
      <h3>set4</h3>
      <draggable v-model="set4" group="items">
        <template #item="{ element }">
          <div
            style="
              padding: 8px;
              border: 1px solid #ccc;
              margin: 4px 0;
              background: #e6f7ff;
            "
          >
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
