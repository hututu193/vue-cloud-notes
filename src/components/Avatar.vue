<template>
  <el-avatar 
    class="custom-avatar"
    :size="32" 
    :style="{ backgroundColor: '#409eff', fontSize: '14px' }"
  >
    {{ slug }}
  </el-avatar>
</template>

<script setup>
import { useUserStore } from '@/stores/modules/user'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'Avatar'
})

const userStore = useUserStore()
const { slug } = storeToRefs(userStore)  
</script>

<style scoped>
/* 完全不需要写圆角、行高、宽高等 CSS！
  Element 帮你做好了。
  我们只需要加一点点过渡效果，让它看起来顺滑。
*/
.custom-avatar {
  /* 去掉原本的 margin-top，因为外层 Sidebar 已经控制了布局 */
  /* margin-top: 15px;  <-- 这行删掉！*/
  
  color: #fff; /* 文字白色 */
  font-weight: 600; /* 稍微加粗一点点，不要太粗 */
  cursor: pointer;
  transition: transform 0.3s;
}

.custom-avatar:hover {
  transform: rotate(360deg); /* 鼠标放上去转一圈，好玩又解压！ */
}
</style>