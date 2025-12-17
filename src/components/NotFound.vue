<template>
    <div class="not-found">
      <el-empty description="哎呀，页面走丢了..." image-size="200"></el-empty>
      <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  </style>