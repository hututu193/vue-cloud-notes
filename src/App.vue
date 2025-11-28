<template>
   <div class="app-container"> <!-- 改为 class 而不是 id -->
    <Sidebar/>
    <main class="main-content">
      <router-view/>  
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
@import '//at.alicdn.com/t/font_496303_kqrjhri8l25d0a4i.css';
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;  
  background-color: #eee;
}
a {
  text-decoration: none;
  color: #444;
}
ul, li{
  list-style: none;
}
.btn {
  color: #666;
  font-size: 12px;
  padding: 2px 4px;
  background-color: #fff;
  box-shadow: 0px 0px 2px 0px #ccc;
  border: none;
  cursor: pointer;
  display: inline-block;
}

/* 修改这里：使用 .app-container 而不是 #app */
.app-container {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-width: 0;
  background: white;
  /* margin: 16px; */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: auto;
}
</style>