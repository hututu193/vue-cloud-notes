<!-- components/SimpleTest.vue -->
<template>
  <div>
    <h1>简单测试页面</h1>
    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  name: 'SimpleTest',
  data() {
    return {
      currentTime: new Date().toLocaleTimeString()
    }
  },
  mounted() {
    console.log('SimpleTest 组件已挂载')
  }
}
</script>