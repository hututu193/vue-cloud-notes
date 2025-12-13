<template>
  <div class="login-container">
    
    <div class="floating-icons">
      <span class="icon i-1">✏️</span>
      <span class="icon i-2">💡</span>
      <span class="icon i-3">☁️</span>
    </div>

    <div class="login-card">
      
      <div class="brand-header">
        <div class="logo-circle">
          <span class="king-emoji">👑</span>
        </div>
        <h1 class="app-title">King Note</h1>
        <p class="app-slogan">今天，你想记录什么？</p>
      </div>

      <div class="form-content">
        <div class="tab-group">
          <div 
            class="tab-item" 
            :class="{ active: isLoginMode }" 
            @click="switchMode(true)"
          >
            登 录
          </div>
          <div 
            class="tab-item" 
            :class="{ active: !isLoginMode }" 
            @click="switchMode(false)"
          >
            注 册
          </div>
        </div>

        <div class="input-group">
          <div class="input-item">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              class="indie-input"
            />
          </div>
          <div class="input-item">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
              class="indie-input"
              @keyup.enter="onSubmit"
            />
          </div>
        </div>

        <transition name="fade">
          <div class="error-tip" v-if="formData.isError">
            {{ formData.notice }}
          </div>
        </transition>

        <button 
          class="indie-btn" 
          :class="{ loading: isLoading }"
          @click="onSubmit"
          :disabled="isLoading"
        >
          {{ isLoading ? '处理中...' : (isLoginMode ? '进入笔记本' : '创建新账号') }}
          <span class="btn-arrow">→</span>
        </button>

      </div>
    </div>

    <div class="footer-text">
      Designed by Hututu & AI · 2025
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, Lock } from '@element-plus/icons-vue'

defineOptions({ name: 'Login' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoginMode = ref(true)
const isLoading = ref(false)

const formData = reactive({
  username: '',
  password: '',
  notice: '',
  isError: false
})

const switchMode = (isLogin) => {
  isLoginMode.value = isLogin
  formData.isError = false
  formData.notice = ''
}

const onSubmit = async () => {
  // 简单校验
  if(!/^[\w\u4e00-\u9fa5]{3,15}$/.test(formData.username)){
    showError('用户名格式不对 (3-15位)')
    return
  }
  if(!/^.{6,16}$/.test(formData.password)){
    showError('密码长度需为 6-16 位')
    return
  }

  try {
    isLoading.value = true
    formData.isError = false
    
    if (isLoginMode.value) {
      await userStore.login({ username: formData.username, password: formData.password })
      const redirect = route.query.redirect || '/notebooks'
      router.push(redirect)
    } else {
      await userStore.register({ username: formData.username, password: formData.password })
      router.push('/notebooks')
    }
  } catch (error) {
    showError(error.response?.data?.msg || '操作失败，请检查网络')
  } finally {
    isLoading.value = false
  }
}

const showError = (msg) => {
  formData.isError = true
  formData.notice = msg
  // 3秒后自动消失，不用手动关
  setTimeout(() => {
    formData.isError = false
  }, 3000)
}
</script>

<style lang="less" scoped>
/* 🌟 核心背景：方格纸效果 */
.login-container {
  height: 100vh;
  width: 100vw;
  background-color: #f7f9fc;
  /* 用 CSS 画出淡蓝色的网格线，就像数学作业本 */
  background-image: 
    linear-gradient(#eef1f5 1px, transparent 1px),
    linear-gradient(90deg, #eef1f5 1px, transparent 1px);
  background-size: 30px 30px; /* 格子大小 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 漂浮的背景装饰 Emoji */
.floating-icons .icon {
  position: absolute;
  font-size: 40px;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}
.i-1 { top: 15%; left: 10%; animation-delay: 0s; transform: rotate(-15deg); }
.i-2 { bottom: 20%; right: 15%; animation-delay: 2s; transform: rotate(10deg); font-size: 50px; }
.i-3 { top: 20%; right: 20%; animation-delay: 4s; font-size: 60px; opacity: 0.4; }

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

/* 🌟 登录卡片：拟态风格 + 干净的阴影 */
.login-card {
  width: 380px;
  background: rgba(255, 255, 255, 0.95); /* 轻微透一点点背景 */
  backdrop-filter: blur(10px);
  border-radius: 16px;
  /* 一个很“实”的投影，不像 AI 做的模糊投影 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.03);
  padding: 40px 30px;
  z-index: 10;
  transition: transform 0.3s;
}

.login-card:hover {
  transform: translateY(-5px); /* 鼠标放上去微微浮起 */
}

/* 品牌头 */
.brand-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: #eef1f5;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.king-emoji {
  font-size: 32px;
}

.app-title {
  font-family: 'Georgia', serif; /* 用衬线体，更有书卷气 */
  font-size: 26px;
  color: #333;
  font-weight: bold;
  letter-spacing: 1px;
}

.app-slogan {
  font-size: 13px;
  color: #999;
  margin-top: 5px;
  letter-spacing: 2px;
}

/* Tab 切换 */
.tab-group {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
}

.tab-item {
  padding: 10px 20px;
  font-size: 15px;
  color: #999;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  font-weight: 500;
}

.tab-item.active {
  color: #333;
}

/* 活动 Tab 下面的小黑条 */
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #333; /* 黑色，极简 */
}

/* 输入框定制 */
.input-group {
  margin-bottom: 20px;
}

.input-item {
  margin-bottom: 15px;
}

/* 覆盖 Element 样式，做成极简风 */
:deep(.indie-input .el-input__wrapper) {
  background: #f9f9f9;
  box-shadow: none;
  border: 1px solid transparent;
  padding: 10px 15px;
  transition: all 0.3s;
}

:deep(.indie-input .el-input__wrapper.is-focus) {
  background: #fff;
  border: 1px solid #333; /* 聚焦时变成黑框，酷！ */
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 错误提示 */
.error-tip {
  font-size: 12px;
  color: #ff4d4f;
  background: #fff2f0;
  padding: 8px 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 🌟 个性化按钮 */
.indie-btn {
  width: 100%;
  height: 48px;
  background: #333; /* 纯黑按钮，很极客 */
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.indie-btn:hover {
  background: #000;
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.indie-btn:disabled {
  background: #999;
  cursor: not-allowed;
  transform: none;
}

.btn-arrow {
  transition: transform 0.3s;
}
.indie-btn:hover .btn-arrow {
  transform: translateX(4px); /* 箭头动一下 */
}

.footer-text {
  position: absolute;
  bottom: 20px;
  font-size: 12px;
  color: #ccc;
  font-family: monospace;
}
</style>