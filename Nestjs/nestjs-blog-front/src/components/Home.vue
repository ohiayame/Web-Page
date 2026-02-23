<script setup lang="ts">
import { ref, onMounted } from "vue";
import styles from "@/styles/Home.module.css";
import { getAllPosts } from "@/utils/api";
import type { PostType } from "@/utils/Types";

const posts = ref<PostType[]>([]);

onMounted(async () => {
  posts.value = (await getAllPosts()) ?? [];
});
</script>

<template>
  <div :class="styles.container">
    <h1>Nest.js Blog</h1>

    <ul :class="styles.postList">
      <li v-for="post in posts" :key="post.id" :class="styles.post">
        <h2 :class="styles.title">{{ post.title }}</h2>
        <p :class="styles.author">{{ post.author }}</p>
      </li>
    </ul>
  </div>
</template>
