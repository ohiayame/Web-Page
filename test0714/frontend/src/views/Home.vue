<template>
  <button @click="routerLogin">로그인</button>

  <div class="home">
    <h1>My Timer</h1>
    <button>timer</button>
    <button>학습시간</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function routerLogin() {
  router.push('/login');
};
</script>

