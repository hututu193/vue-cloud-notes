<template>
  <div id="sidebar">
    <Avatar/>
    <div class="icons">
      <router-link to="/note" title="笔记"><i class="iconfont icon-note"></i></router-link>
      <router-link to="/notebooks" title="笔记本"><i class="iconfont icon-notebook"></i></router-link>
      <router-link to="/trash" title="回收站"><i class="iconfont icon-trash"></i></router-link> 
    </div> 
    <div class="logout" @click="onLogout">
      <i class="iconfont icon-logout"></i>
    </div>
  </div>
</template>

<script setup>
import Avatar from './Avatar.vue'
import { useUserStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router' 
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
const router = useRouter() 

const userStore = useUserStore()
const isLoading = ref(false)

defineOptions({
  name: 'Sidebar'
})
// 点击退出登录
const onLogout = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    await userStore.logout()
    
    ElMessage({
      type: 'success',
      message: '已退出登录',
      duration: 1500,
    })
    
    // 短暂延迟后跳转到登录页
    setTimeout(() => {
      router.push({ path: '/login' })
    }, 300)
    
  } catch (error) {
    console.error('退出登录失败:', error)
    // 即使 API 失败，也清除本地用户状态
    userStore.setUser(null)
    ElMessage({
      type: 'error',
      message: '退出登录失败，请重试',
    })
  } finally {
    isLoading.value = false
  }
}

</script>


<style lang="less" scoped>
#sidebar {
  position: relative;
  width: 56px;
  text-align: center;
  background-color: #2c333c;

  
  height: 100vh;
  // height: 100%;
  // border: 1px solid red;
}
.icons {
  margin-top: 15px;

  a {
    padding: 6px 0;
    display: block;
  }
}

.icons .router-link-active {
  background-color: #5e6266;
}
.logout {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.iconfont {
  color: #fff;
}
</style>