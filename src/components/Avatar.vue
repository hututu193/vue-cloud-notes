<template>
  <span :title="username"> {{slug}}</span>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Auth from '@/apis/auth';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()

const username = computed(() => userStore.username)
const slug = computed(() => {
  return username.value.charAt(0)
})

onMounted(async () => {
  try {
    const userInfo = await Auth.getInfo()
    if (userInfo && userInfo.isLogin) {
      // 使用 store 的方法来设置用户名，而不是直接赋值
      userStore.setUsername(userInfo.data.username)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<script>
     export default {
        name: 'Avatar'
     }
</script>

<style scoped>
span {
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 32px;
  border-radius: 50%;
  background: #f2b81c;
  color: #fff;
  text-shadow: 1px 0 1px #795c19;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
  margin-top: 15px;
}
</style>