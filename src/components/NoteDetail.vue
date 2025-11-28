<template>
  <div id="note" class="detail">

    <NoteSidebar></NoteSidebar>
    
     <div class="note-detail">
      
        <div class="note-bar">
          <span> 创建日期: {{currentNote.createdAtFriendly}}</span>
          <span> 更新日期: {{ currentNote.updatedAtFriendly }}</span>
          <span> {{currentNote.statusText}} </span>
          <span class="iconfont icon-delete"></span>
          <span class="iconfont icon-fullscreen"></span>
        </div>
        <div class="note-title">
          <input type="text"  placeholder="输入标题"
          :value="currentNote.title"/>
        </div>
        <div class="editor">

          <textarea   placeholder="输入内容, 支持 markdown 语法"
          v-show="true"
          :value="currentNote.content">
        </textarea>

          <div class="preview markdown-body"  v-show="false">
          </div>
        </div>
    

    </div>


  </div>
</template>
<script setup>
import Auth from '@/apis/auth';
import { useRouter } from 'vue-router';
import {ref} from 'vue'
import NoteSidebar from './NoteSidebar.vue';

const router = useRouter();
defineOptions({
  name: 'NoteDetail'
})

 const currentNote = ref({
  title : '我的笔记',
  content : "我的笔记内容",
  createdAtFriendly : '一天前',
  updatedAtFriendly : '刚刚',
  statusText:'未更新'
 })

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



<style lang="less">
@import url(../assets/css/note-detail.less);


#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
  height: 100%; /* 添加这行 */
  min-height: 0; /* 防止 flex 项目溢出 */
}

.note-detail {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  padding: 20px;
  background: #f8f9fa;
}

</style>