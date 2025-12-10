<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';

defineOptions({
  name: "App"
})
</script>

<style>
/* 引入 iconfont (保持你原来的) */
@import '//at.alicdn.com/t/font_496303_kqrjhri8l25d0a4i.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden; /* 防止整个页面出现滚动条，只让内容区滚动 */
}

body {
  font-family: 'Inter', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 整个 App 容器 */
.app-container {
  display: flex;
  height: 100vh; /* 占满屏幕高度 */
  width: 100vw;
}

/* 右侧内容主区域 */
.main-content {
  flex: 1;             /* 占满剩余宽度 */
  height: 100%;        /* 占满高度 */
  background-color: #f5f7fa; /* ✨ 关键点：给右边一个极淡的灰背景 */
  padding: 30px;       /* 内容和边缘留点呼吸感 */
  overflow-y: auto;    /* 内容多了只在右边滚动 */
  
  /* ❌ 删掉下面这些！不要让主容器像个卡片，要让它像桌面 */
  /* border-radius: 8px; */
  /* box-shadow: ...; */
  /* margin: 16px; */
}

/* 滚动条美化（选做）：让右边的滚动条细一点，不那么突兀 */
.main-content::-webkit-scrollbar {
  width: 6px;
}
.main-content::-webkit-scrollbar-thumb {
  background: #dfe1e5;
  border-radius: 3px;
}
.main-content::-webkit-scrollbar-track {
  background: transparent;
}
</style>