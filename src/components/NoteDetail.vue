<template>
  <div id="note" class="detail">

    <NoteSidebar
    @update:notes="handleNotesUpdate"></NoteSidebar>
    
     <div class="note-detail">
      <!-- 如果当前笔记为空，显示请选择笔记 -->
      <div class="note-empty" v-show="!currentNote.id">请选择笔记</div>

      <div class="note-detail-ct" v-show="currentNote.id">
        <div class="note-bar">
          <span> 创建日期: {{currentNote.createdAtFriendly}}</span>
          <span> 更新日期: {{ currentNote.updatedAtFriendly }}</span>
          <span> {{statusText}} </span>
          <span class="iconfont icon-delete" 
          @click="onDeleteNote"></span>

          <span class="iconfont icon-fullscreen" @click="isShowPreview = !isShowPreview"></span>
        </div>
        
        <div class="note-title">
          <input type="text"  placeholder="输入标题"
          @input="onUpdateNote"
          @keydown="statusText='正在输入'"
          v-model="currentNote.title"/>
        </div>

        <div class="editor">
          <textarea   placeholder="输入内容, 支持 markdown 语法"
          v-show="!isShowPreview"
          @input="onUpdateNote"
          @keydown="statusText='正在输入'"
          v-model="currentNote.content">
        </textarea>

          <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview"> </div>
        </div>
    
    </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'lodash'
import { ElMessage } from 'element-plus'
import NoteSidebar from './NoteSidebar.vue'
import MarkdownIt from 'markdown-it';
 import { useNotesStore } from '@/stores/modules/note'
import { storeToRefs } from 'pinia'

 const notesStore = useNotesStore()
 const { notes, currentNote} = storeToRefs(notesStore)
const route = useRoute()
const md = new MarkdownIt();

const router = useRouter()
const statusText = ref('笔记未改动')
const isShowPreview = ref(false)

defineOptions({
    name: 'NoteDetail'
})




// ✅ 监听路由变化，更新 currentNoteId
watch(
  () => route.query.noteId,
  (newNoteId) => {
    if (newNoteId) {
      notesStore.setCurrentNoteId(newNoteId)
    }
  },
  { immediate: true }  // 立即执行一次
)

const previewContent = computed(() => {
  if (!currentNote.value.content) return ''
  return md.render(currentNote.value.content)
})

// 接收侧边栏传来的笔记列表
const handleNotesUpdate = (newNotes) => {
  notes.value = newNotes || []
  // console.log(notes.value)
}

// 防抖更新笔记
const onUpdateNote = debounce(() => {
  if (!currentNote.value.id) return

  notesStore.updateNote({ 
    noteId: currentNote.value.id 
  }, {
    title: currentNote.value.title,
    content: currentNote.value.content
  })
  .then(() => {
    statusText.value = '已保存'
  }).catch(() => {
    statusText.value = '保存出错'
  })
}, 300)
// 删除笔记
const onDeleteNote = async () => {
  try {
    // await ElMessageBox.confirm('确定删除这个笔记吗？', '提示')
    const res =  await notesStore.deleteNote({ noteId: currentNote.value.id})

// ✅ 显示成功消息（从 API 返回）
ElMessage({
      type: 'success',
      message: res.msg || '删除成功',
    })
    
    // 从当前路由获取 notebookId
    const notebookId = route.query.notebookId

      // 智能跳转
      if (notes.value.length > 0) {
        router.replace({ path: '/note', query: { 
          noteId: notes.value[0].id,
          notebookId: notebookId
        }})
      } else {
      router.replace({ 
        path: '/note',
        query: { notebookId: notebookId }  // ✅ 保留 notebookId
      })
    }
  } catch (error) {
    // 只处理真正的错误，不处理用户取消
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.msg || '删除失败')
    }
  }

}
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