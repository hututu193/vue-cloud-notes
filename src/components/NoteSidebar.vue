<template>
    <div class="note-sidebar">
        <span class="btn add-note" @click="onAddNote">添加笔记</span>

        <el-dropdown @command="handleCommand" class="notebook-title">
    <span class="el-dropdown-link">
      {{currentBook.title}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="notebook in notebooks"
        :key="notebook.id"
        :command="notebook.id">{{notebook.title}}</el-dropdown-item>
        <el-dropdown-item command="trash">回收站</el-dropdown-item>
        
      </el-dropdown-menu>
    </template>

  </el-dropdown>

  <div class="menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>

    <ul class="notes">
        <!-- 此处的key需要再次确认 -->
        <li v-for="(note, index) in notes" 
        :key="note.id">
            <router-link 
                :to="`/note?noteId=${note.id}&notebookId=${currentBook.id}`"
                :class="{ 'active': isNoteActive(note.id, index) }">
                <span class="date">{{ note.updatedAtFriendly }}</span>
                <span class="title">{{ note.title }}</span>
            </router-link>
        </li>
    </ul>
    </div>
</template>

<script setup>
    // import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/modules/note'
import { useNotebooksStore } from '@/stores/modules/notebook'
import { storeToRefs } from 'pinia'

const notesStore = useNotesStore()
const notebookStore = useNotebooksStore()

const { currentBook, notebooks} = storeToRefs(notebookStore)
const { notes} = storeToRefs(notesStore)

// 移除重复的 script 标签，合并到 setup 中
defineOptions({
    name: 'NoteSidebar'
})
const route = useRoute() 
const router = useRouter()
// const notebooks = ref([])
// const notes = ref([])
// const currentBook = ref({})
// 定义组件发出的事件
const emit = defineEmits(['update:notes'])

const updateNotesList = (newNotes) => {
    // notes.value = newNotes
    emit('update:notes', newNotes) 
}

const getNotebooks = async () =>{
 // ✅ 先获取笔记本列表
 if (notebookStore.notebooks.length === 0) {
    await notebookStore.getNotebooks()
  }

  notebookStore.setCurrentBookId(route.query.notebookId)
  if (!currentBook.value.id) return

  const noteRes = await notesStore.getNotes({notebookId: currentBook.value.id})

    updateNotesList(noteRes.data || [])
    
      // 统一处理路由跳转，用 replace 避免历史记录堆积
  const newQuery = { notebookId: currentBook.value.id }
if(route.query.noteId){
  // URL 已有 noteId，保留它
  newQuery.noteId = route.query.noteId

  notesStore.setCurrentNoteId(route.query.noteId)

}else if(noteRes.data?.length >0){
  // URL 没有 noteId，但有笔记，设置第一个
  newQuery.noteId = noteRes.data[0].id

  notesStore.setCurrentNoteId(noteRes.data[0].id)

}
// 如果没有笔记，newQuery 就只有 notebookId

// 比较是否需要跳转
const needRedirect = 
  newQuery.notebookId !== route.query.notebookId || 
  newQuery.noteId !== route.query.noteId

  if(needRedirect){
    router.replace({path: '/note', query: newQuery})
  }
}

onMounted(() =>{
    getNotebooks()
})

// 判断当前笔记是否激活
// 如果URL中有noteId，则匹配对应的笔记；如果没有noteId，则默认第一个笔记为active
const isNoteActive = (noteId, index) => {
    const currentNoteId = route.query.noteId
    if (currentNoteId) {
        // 有选中的笔记，匹配对应的笔记
        return currentNoteId == noteId
    } else {
        // 没有选中的笔记，默认第一个笔记为active
        if (index === 0) {
            return true
        } else {
            return false
        }
    }
}
const handleCommand = async (notebookId) => {
    if(notebookId == 'trash') {
        router.push({path:'/trash'})
    } else {
        // 找到选中的笔记本并更新 currentBook
        // const selectedNotebook = notebooks.value.find(notebook => notebook.id == notebookId)
        notebookStore.setCurrentBookId(notebookId)
        
        // if (selectedNotebook) {
            // currentBook.value = selectedNotebook
            const res = await notesStore.getNotes({notebookId})
            // const res = await Notes.getAll({notebookId})
            // notes.value = res.data
            // console.log('切换到笔记本后的笔记:', notes.value)
            updateNotesList(res.data)
            
            // 更新URL参数：更新notebookId，如果有笔记则导航到第一个笔记，否则只更新notebookId
            if (res.data && res.data.length > 0) {
                // 有新笔记，导航到第一个笔记
                router.push({
                    path: '/note',
                    query: {
                        noteId: res.data[0].id,
                        notebookId: notebookId
                    }
                })
            } else {
                // 没有笔记，只更新notebookId
                router.push({
                    path: '/note',
                    query: {
                        notebookId: notebookId
                    }
                })
            }
        }
    }
//   ElMessage(`click on item ${command}`)
// }

const onAddNote = async () =>{
  // const res = await Notes.addNote({notebookId: currentBook.value.id})
  // notes.value.unshift(res.data)
  notesStore.addNote(currentBook.value.id)
}
</script>

<style lang="less" >
@import url(../assets/css/note-sidebar.less);

// 添加高度设置
.note-sidebar {
    height: 100%; /* 继承父容器高度 */
    display: flex;
    flex-direction: column;
}

.notes {
    flex: 1;
    overflow-y: auto; /* 如果笔记太多可以滚动 */
    min-height: 0; /* 重要：允许 flex 项目收缩 */
} 
</style>
