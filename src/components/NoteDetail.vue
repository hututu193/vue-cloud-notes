<template>
  <div id="note" class="detail">

    <NoteSidebar></NoteSidebar>
    <div class="note-detail">
      gikjh
    </div>
  </div>
</template>
<script setup>
import Auth from '@/apis/auth';
import { useRouter } from 'vue-router';
import NoteSidebar from './NoteSidebar.vue';

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
  export default{
    name: 'NoteList'
  }
</script>

<style lang="less">
// @import url(../assets/css/note-detail.less);

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}

</style>