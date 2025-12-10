<template>
  <div id="note-detail-container">
    <NoteSidebar @update:notes="handleNotesUpdate" />

    <div class="note-editor-layout">
      
      <div class="note-empty" v-if="!currentNote.id">
        <el-empty description="请选择或创建一条笔记" />
      </div>

      <div class="editor-main" v-else>
        
        <div class="editor-header">
          <div class="meta-info">
            <span>创建于 {{ currentNote.createdAtFriendly }}</span>
            <span class="divider">|</span>
            <span>{{ statusText }}</span>
          </div>

          <div class="actions">
            <el-tooltip content="预览模式" placement="bottom">
              <el-button link @click="isShowPreview = !isShowPreview">
                <i class="iconfont icon-fullscreen" :class="{active: isShowPreview}"></i>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="删除笔记" placement="bottom">
              <el-button link type="danger" @click="onDeleteNote">
                <i class="iconfont icon-delete"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <div class="title-input-box">
          <input 
            type="text" 
            v-model="currentNote.title" 
            @input="onUpdateNote"
            @keydown="statusText='正在输入...'"
            placeholder="无标题笔记"
          />
        </div>

        <div class="content-box">
          <textarea 
            v-show="!isShowPreview"
            v-model="currentNote.content"
            @input="onUpdateNote"
            @keydown="statusText='正在输入...'"
            placeholder="开始记录你的想法..."
          ></textarea>

          <div 
            v-show="isShowPreview" 
            class="preview markdown-body" 
            v-html="previewContent"
          ></div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import NoteSidebar from './NoteSidebar.vue'
import MarkdownIt from 'markdown-it'
import { useNotesStore } from '@/stores/modules/note'
import { storeToRefs } from 'pinia'

// ... 逻辑部分完全保持你原来的，一个字都不用改 ...
// 只是为了演示完整性，我把 key logic 贴在这里占位
const notesStore = useNotesStore()
const { notes, currentNote } = storeToRefs(notesStore)
const route = useRoute()
const router = useRouter()
const md = new MarkdownIt()
const statusText = ref('已保存')
const isShowPreview = ref(false)

defineOptions({ name: 'NoteDetail' })

// 监听路由、更新函数、删除函数保持原样...
watch(() => route.query.noteId, (newId) => {
  if (newId) notesStore.setCurrentNoteId(newId)
}, { immediate: true })

const handleNotesUpdate = (newNotes) => {
  notes.value = newNotes || []
}

const previewContent = computed(() => {
  return currentNote.value.content ? md.render(currentNote.value.content) : ''
})

const onUpdateNote = debounce(() => {
  if (!currentNote.value.id) return
  notesStore.updateNote({ noteId: currentNote.value.id }, {
    title: currentNote.value.title,
    content: currentNote.value.content
  }).then(() => statusText.value = '已保存').catch(() => statusText.value = '保存出错')
}, 300)

const onDeleteNote = async () => {
    // 建议加上 Element 弹窗确认，更安全
    await ElMessageBox.confirm('确认删除吗？', '提示', { type: 'warning' })
    const res = await notesStore.deleteNote({ noteId: currentNote.value.id})
    ElMessage.success(res.msg || '删除成功')
    const notebookId = route.query.notebookId
    // 简单粗暴的跳转逻辑
    notes.value.length > 0 
      ? router.replace({ path: '/note', query: { noteId: notes.value[0].id, notebookId }})
      : router.replace({ path: '/note', query: { notebookId }})
}
</script>

<style lang="less" scoped>
/* 整个页面容器 */
#note-detail-container {
  display: flex;
  height: 100%; /* 继承 App.vue 的高度 */
  width: 100%;
  background: #fff;
  border-radius: 4px; /* 如果想要一点圆角 */
  overflow: hidden;
}

/* 右侧编辑布局 */
.note-editor-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff; /* 纯白背景，沉浸式 */
}

/* 空状态居中 */
.note-empty {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 编辑器主区域 */
.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 40px; /* 两边留白，像 A4 纸一样 */
  max-width: 1000px; /* 内容不要太宽，方便阅读 */
  margin: 0 auto; /* 居中 */
  width: 100%;
}

/* 顶部信息栏 */
.editor-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid transparent; /* 不需要线，干净点 */
  margin-top: 10px;
  
  .meta-info {
    font-size: 12px;
    color: #999;
    
    .divider {
      margin: 0 8px;
      color: #eee;
    }
  }

  .iconfont {
    font-size: 18px;
    color: #999;
    transition: color 0.3s;
    
    &:hover {
      color: #333;
    }
    &.active {
      color: #409eff;
    }
  }
}

/* 标题输入区域 */
.title-input-box {
  margin: 20px 0;
  
  input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 32px; /* 大标题！ */
    font-weight: bold;
    color: #333;
    background: transparent;
    
    &::placeholder {
      color: #e0e0e0;
    }
  }
}

/* 内容区域 */
.content-box {
  flex: 1;
  position: relative;
  margin-bottom: 20px;
  
  textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    outline: none;
    font-size: 16px;
    line-height: 1.8; /* 行高大一点，阅读舒服 */
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .preview {
    height: 100%;
    overflow-y: auto;
  }
}
</style>