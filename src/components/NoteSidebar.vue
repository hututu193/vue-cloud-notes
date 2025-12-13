<template>
    <div class="note-sidebar">
      
      <div class="sidebar-header">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="notebook-title">
            {{ currentBook.title || '选择笔记本' }}
            <i class="iconfont icon-down"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="notebook in notebooks" 
                :key="notebook.id" 
                :command="notebook.id"
              >
                {{ notebook.title }}
              </el-dropdown-item>
              <el-dropdown-item command="trash" divided>
                <i class="iconfont icon-trash"></i> 回收站
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
  
        <el-button 
          class="add-btn" 
          type="primary" 
          link 
          @click="onAddNote"
        >
          <i class="iconfont icon-plus"></i> 添加
        </el-button>
      </div>
  
      <div class="notes-wrapper">
         <el-empty 
          v-if="notes.length === 0" 
          :image-size="60" 
          description="暂无笔记" 
        />
  
        <ul class="note-list" v-else>
  <li v-for="(note, index) in notes" :key="note.id">
    <router-link 
      :to="`/note?noteId=${note.id}&notebookId=${currentBook.id}`"
      class="note-item"
      :class="{ 'active': isNoteActive(note.id, index) }"
    >
      <span class="note-title">{{ note.title || '无标题' }}</span>
      <span class="note-date">{{ note.updatedAtFriendly }}</span>
    </router-link>
  </li>
</ul>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotesStore } from '@/stores/note'
  import { useNotebooksStore } from '@/stores/notebooks'
  import { storeToRefs } from 'pinia'
  
  const notesStore = useNotesStore()
  const notebooksStore = useNotebooksStore()
  const { currentBook, notebooks } = storeToRefs(notebooksStore)
  const { notes } = storeToRefs(notesStore)
  const route = useRoute()
  const router = useRouter()
  const emit = defineEmits(['update:notes'])
  
  defineOptions({ name: 'NoteSidebar' })
  
  // --- 逻辑部分保持不变，我只优化了 CSS 结构 ---
  const handleCommand = async (notebookId) => {
    if(notebookId == 'trash') {
      router.push({path:'/trash'})
    } else {
      notebooksStore.setCurrentBookId(notebookId)
      const res = await notesStore.getNotes({notebookId})
      emit('update:notes', res.data)
      if (res.data && res.data.length > 0) {
        router.push({ path: '/note', query: { noteId: res.data[0].id, notebookId }})
      } else {
        router.push({ path: '/note', query: { notebookId }})
      }
    }
  }
  
  const onAddNote = () => {
    notesStore.addNote(currentBook.value.id)
  }
  
  const getNotebooks = async () => {
    if (notebooksStore.notebooks.length === 0) {
      await notebooksStore.getNotebooks()
    }
    notebooksStore.setCurrentBookId(route.query.notebookId)
    if (!currentBook.value.id) return
    const noteRes = await notesStore.getNotes({notebookId: currentBook.value.id})
    emit('update:notes', noteRes.data || [])
    
  }
  
  const isNoteActive = (noteId, index) => {
      const currentNoteId = route.query.noteId
      if (currentNoteId) return currentNoteId == noteId
      return index === 0
  }
  
  onMounted(() => {
    getNotebooks()
  })
  </script>
  
  <style lang="less" scoped>
  .note-sidebar {
    width: 280px; /* 稍微窄一点，精致 */
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9; /* 极淡的灰，和纯白编辑器区分开 */
    border-right: 1px solid #eee;
  }
  
  .sidebar-header {
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eef0f2;
    background: #f9f9f9;
    
    .notebook-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      cursor: pointer;
      display: flex;
      align-items: center;
      
      .icon-down {
        font-size: 12px;
        margin-left: 5px;
        color: #999;
      }
    }
  
    .add-btn {
      font-size: 14px;
      padding: 0;
    }
  }
  
  .note-item {
  display: flex;             /* ✨ 魔法核心：开启 Flex 布局 */
  justify-content: space-between; /* ✨ 让标题靠左，时间靠右 */
  align-items: center;       /* 垂直居中对齐 */
  
  padding: 12px 14px;        /* 稍微减小一点左右间距，让内容宽一点 */
  margin: 4px 8px;           /* 每一项之间的间距 */
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent; 
  text-decoration: none;     /* 去掉链接下划线 */

  /* 标题样式 */
  .note-title {
    font-size: 14px;
    color: #333;
    
    flex: 1;                 /* ✨ 霸道属性：占据所有剩余空间 */
    white-space: nowrap;     /* 只有一行，不许换行 */
    overflow: hidden;        /* 超出部分藏起来 */
    text-overflow: ellipsis; /* 超出部分变成 ... */
    margin-right: 10px;      /* 给右边的时间留点距离，别挨太近 */
    font-weight: 500;
  }
  
  /* 时间样式 */
  .note-date {
    font-size: 12px;
    color: #999;             /* 浅灰色，不要喧宾夺主 */
    flex-shrink: 0;          /* ✨ 关键：无论空间多挤，时间绝对不能被压缩 */
    font-family: Arial, sans-serif; /* 数字用 Arial 比较好看 */
  }

  /* 悬停效果 */
  &:hover {
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }

  /* 选中状态 */
  &.active {
    background-color: #fff;
    border: 1px solid #409eff; /* 加上蓝色边框 */
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);

    /* 选中时，标题和时间都变蓝，或者保持原色，看你喜好 */
    .note-title {
      color: #409eff;
      font-weight: bold;
    }
    .note-date {
      color: #409eff;
    }
  }
}
  </style>