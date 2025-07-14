<template>
  <div>
    <h1>Login</h1>
    <div>
    <form @submit.prevent="setLogin">
      이름 : <input type="text" v-model="user_id" placeholder="Enter your ID"><br>
      비밀번호 : <input type="password" v-model="user_pw" placeholder="Enter your password"><br>
      <input type="submit" value="로그인">
    </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../stores/user.js';

const user_id = ref('');
const user_pw = ref('');

const setLogin = async () => {
  const result = await login(user_id.value, user_pw.value);

  if (result.success) {
    alert('로그인 성공!');
  } else {
    alert(result.message || '로그인 실패');
  }

}

</script>
