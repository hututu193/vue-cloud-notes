<template>
  <div id="trash-detail">
    <h1>垃圾回收</h1>
  </div>
</template>

<script setup>

import Auth from '@/apis/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

// ✅ 正确：直接在 setup 中执行，类似 Vue 2 的 created
Auth.getInfo().then(res => {
 
  if (!res.isLogin) {
    router.push({ path: '/login' });
  }
}).catch(error => {
  console.error('检查登录状态失败:', error);
  router.push({ path: '/login' });
});

</script>
 
<script>
   export default {
  name: 'TrashDetail'
}
</script>

<style scoped>
h1 {
  color: blue;
}
</style>