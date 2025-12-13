<template>
  <div id="trash" class="detail">
    
    <div class="note-sidebar">
      
      <div class="sidebar-header">
        <h3 class="notebook-title">
          <i class="iconfont icon-trash"></i> 回收站
        </h3>
      </div>

      <div class="notes-wrapper">
        <el-empty 
          v-if="trashNotes.length === 0" 
          description="回收站是空的" 
          :image-size="60"
        />

        <ul class="note-list" v-else>
          <li v-for="(note, index) in trashNotes" :key="note.id">
            <router-link 
              :to="`/trash?noteId=${note.id}`"
              class="note-item"
              :class="{ 'active': isNoteActive(note.id, index) }"
            >
              <span class="note-title">{{ note.title || '无标题笔记' }}</span>
              <span class="note-date">{{ note.updatedAtFriendly }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="note-detail">
      
      <div class="note-detail-ct" v-if="currTrashNote.id">
        
        <div class="note-bar">
          <div class="meta-info">
            <span>原属于: <b>{{ belongTo }}</b></span>
            <span class="divider">|</span>
            <span>删除时间: {{ currTrashNote.updatedAtFriendly }}</span>
          </div>
          
          <div class="actions">
            <el-button type="primary" size="small" plain @click="onRevert">
              <i class="iconfont icon-refresh"></i> 恢复笔记
            </el-button>
            <el-button type="danger" size="small" plain @click="onDelete">
              <i class="iconfont icon-delete"></i> 彻底删除
            </el-button>
          </div>
        </div>

        <div class="note-title">
          <span>{{ currTrashNote.title }}</span>
        </div>

        <div class="editor">
          <div class="preview markdown-body" v-html="compiledMarkdown"></div>
        </div>
      </div>

      <div class="note-empty" v-else>
        <el-empty description="选择一条笔记查看详情" />
      </div>

    </div>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, computed, watch } from 'vue'
import { useTrashStore } from '@/stores/trash';
import { storeToRefs } from 'pinia'
import MarkdownIt from 'markdown-it';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNotebooksStore } from '@/stores/notebooks';

const md = new MarkdownIt();
const route = useRoute()
const router = useRouter()
const trashStore = useTrashStore()
const { currTrashNote, trashNotes } = storeToRefs(trashStore)

const notebooksStore = useNotebooksStore()
const { notebooks } = storeToRefs(notebooksStore) 

defineOptions({ name: 'TrashDetail' })

const compiledMarkdown = computed(() => md.render(currTrashNote.value.content || ''))

const belongTo = computed(() => {
  if(!currTrashNote.value || !currTrashNote.value.notebookId) return '未知笔记本'
  if(!notebooks.value || notebooks.value.length === 0) return '加载中...'
  const notebook = notebooks.value.find(nb => nb.id == currTrashNote.value.notebookId)
  return notebook ? notebook.title : '未知笔记本'
})

const loadAllData = async () => {
  try {
    await trashStore.getTrashNotes()
    await notebooksStore.getNotebooks()
    if (route.query.noteId) {
      trashStore.setCurrTrashNoteId(route.query.noteId)
    } else if (trashNotes.value.length > 0) {
      const firstNoteId = trashNotes.value[0].id
      router.replace({ path: '/trash', query: { noteId: firstNoteId } })
    }
  } catch (error) {
    console.error('加载回收站笔记失败:', error)
  }
}

onMounted(() => {
  loadAllData()
})

watch(() => route.query.noteId, (newNoteId) => {
  if (newNoteId) trashStore.setCurrTrashNoteId(newNoteId)
}, { immediate: true })

const isNoteActive = (noteId, index) => {
    const currentNoteId = route.query.noteId
    if (currentNoteId) return currentNoteId == noteId
    return index === 0
}

const onDelete = async () => {
  if (!currTrashNote.value?.id) return
  
  try {
    await ElMessageBox.confirm('彻底删除后将无法恢复，确定吗？', '警示', {
      confirmButtonText: '彻底删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await trashStore.deleteNote(currTrashNote.value.id)
    
    // ElMessage.success('已彻底删除')
    
    if (trashNotes.value.length > 0) {
      router.replace({ path: '/trash', query: { noteId: trashNotes.value[0].id } })
    } else {
      router.replace({ path: '/trash' })
    }
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error('删除失败')
  }
}

const onRevert = async () => {
  if (!currTrashNote.value?.id) return
  try {
      await trashStore.revertNote(currTrashNote.value.id)

      // ElMessage.success('笔记已恢复')

      if (trashNotes.value.length > 0) {
        router.replace({ path: '/trash', query: { noteId: trashNotes.value[0].id } })
      } else {
        router.replace({ path: '/trash' })
      }
  } catch (e) {
      ElMessage.error('恢复失败')
  }
}
</script>

<style lang="less" scoped>
/* CSS全部内联重写了，不再依赖外部文件*/

#trash {
  display: flex;
  height: 100%;
  background-color: #fff;
}

/* --- 1. 左侧 Sidebar 样式 (复用 NoteSidebar 的风格) --- */
.note-sidebar {
  width: 280px;
  height: 100%;
  background-color: #f9f9f9;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #eef0f2;
    background: #f9f9f9;
    
    .notebook-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .notes-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
  }

  .note-list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .note-item {
    display: flex;             /* 左右布局 */
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    margin: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;

    .note-title {
      font-size: 14px;
      color: #333;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 10px;
    }

    .note-date {
      font-size: 12px;
      color: #999;
      flex-shrink: 0;
    }

    &:hover {
      background-color: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    &.active {
      background-color: #fff;
      border: 1px solid #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
      
      .note-title { color: #409eff; font-weight: bold; }
      .note-date { color: #409eff; }
    }
  }
}

/* --- 2. 右侧 Detail 样式 --- */
.note-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
  
  .note-detail-ct {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* 顶部操作条 */
  .note-bar {
    padding: 15px 40px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between; /* 两端对齐：左边信息，右边按钮 */
    align-items: center;
    background-color: #fff;

    .meta-info {
      font-size: 12px;
      color: #999;
      .divider { margin: 0 10px; color: #eee; }
      b { color: #666; }
    }
    
    .actions {
      display: flex;
      gap: 10px; /* 按钮之间的间距 */
    }
  }

  .note-title {
    padding: 20px 40px 0 40px;
    span {
      display: block;
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
  }

  .editor {
    flex: 1;
    padding: 20px 40px;
    overflow-y: auto;
    
    .preview {
      font-size: 16px;
      line-height: 1.8;
      color: #333;
    }
  }
  
  /* 空状态居中 */
  .note-empty {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>