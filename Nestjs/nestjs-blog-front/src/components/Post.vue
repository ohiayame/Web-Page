<script setup lang="ts">
import { ref, onMounted } from "vue";
import styles from "@/styles/Post.module.css";
import { getPost } from "@/utils/api";
import { useRoute } from "vue-router";

const route = useRoute();
const post = ref();

onMounted(async () => {
  if (typeof route.params.id === "string")
    post.value = await getPost(route.params.id);
});
</script>

<template>
  <div v-if="post" :class="styles.container">
    <h1 :class="styles.title">{{ post.title }} #{{ post.id }}</h1>
    <p :class="styles.meta">
      작성자:{{ post.author }} | 작성일: {{ post.createdAt }}
    </p>
    <p :class="styles.content">{{ post.content }}</p>
  </div>
  <div v-else>not find</div>
</template>
