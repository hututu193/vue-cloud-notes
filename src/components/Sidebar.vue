<template>
  <div class="sidebar-container">
    
    <div class="avatar-wrapper">
      <Avatar />
    </div>

    <el-menu
      class="el-menu-vertical"
      :default-active="route.path"
      background-color="#fff"
      text-color="#606266"
      active-text-color="#409eff"
      :router="true" 
      :collapse="true" 
    >
      <el-menu-item index="/note" title="笔记">
        <el-icon><i class="iconfont icon-note"></i></el-icon>
      </el-menu-item>

      <el-menu-item index="/notebooks" title="笔记本">
        <el-icon><i class="iconfont icon-notebook"></i></el-icon>
      </el-menu-item>

      <el-menu-item index="/trash" title="回收站">
        <el-icon><i class="iconfont icon-trash"></i></el-icon>
      </el-menu-item>
    </el-menu>

    <div class="logout-wrapper" @click="onLogout" title="退出登录">
      <i class="iconfont icon-logout"></i>
    </div>

  </div>
</template>

<script setup>
/* 逻辑部分代码一个字都不用动，全是通用的 */
import Avatar from './Avatar.vue'
import { useUserStore } from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isLoading = ref(false)

defineOptions({
  name: 'Sidebar'
})

const onLogout = async () => {
  if (isLoading.value) return
  try {
    isLoading.value = true
    await userStore.logout()
    ElMessage.success('已退出登录')
    setTimeout(() => {
      router.push({ path: '/login' })
    }, 300)
  } catch (error) {
    console.error('退出登录失败:', error)
    userStore.setUser(null)
    ElMessage.error('退出登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="less" scoped>
/* 这一次 CSS 我们做减法！
  去掉那些乱七八糟的颜色，只留结构。
*/

.sidebar-container {
  height: 100vh;
  width: 64px; /* 保持这个宽度，不破坏页面布局 */
  background-color: #fff; /* 背景改回白色！ */
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eef0f5; /* 右侧加一条极淡的分割线 */
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05); /* 加一点点高级的阴影 */
}

.avatar-wrapper {
  padding-top: 24px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
}

.el-menu-vertical {
  flex-grow: 1; 
  border-right: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

/* 强行覆盖 Element 样式，让图标居中 */
:deep(.el-menu-item) {
  padding: 0 !important;
  width: 40px;      /* 按钮做成圆的或者方块 */
  height: 40px;
  margin-bottom: 15px;
  border-radius: 8px; /* 圆角矩形，比直角高级 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 选中时的背景色：淡蓝色 */
:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff !important;
}

/* 图标大小设置 */
.iconfont {
  font-size: 22px; 
  /* 解决图标可能偏上的问题 */
  line-height: 1; 
  display: block; 
}

.logout-wrapper {
  margin-bottom: 20px;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399; /* 默认浅灰 */
  transition: all 0.3s;
}

.logout-wrapper:hover .iconfont {
  color: #f56c6c; /* 悬停时变成警示红 */
  transform: scale(1.1); /* 微微放大 */
}
</style>