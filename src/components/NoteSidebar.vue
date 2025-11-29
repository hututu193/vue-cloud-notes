<template>
    <div class="note-sidebar">
        <span class="btn add-note">添加笔记</span>

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
                <span class="date">{{ note.updateAtFriendly }}</span>
                <span class="title">{{ note.title }}</span>
            </router-link>
        </li>
    </ul>
    </div>
</template>

<script setup>
    // import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import {ref, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
  import Notebooks from '@/apis/notebooks'
  import Notes from '@/apis/notes'

// 移除重复的 script 标签，合并到 setup 中
defineOptions({
    name: 'NoteSidebar'
})
const route = useRoute() 
const router = useRouter()

const notebooks = ref([])
const notes = ref([])
const currentBook = ref({})
// 定义组件发出的事件
const emit = defineEmits(['update:notes'])

const updateNotesList = (newNotes) => {
    notes.value = newNotes
    emit('update:notes', newNotes) 
}

const getNotebooks = async () =>{
    const res = await Notebooks.getAll()
    notebooks.value = res.data
   
    // console.log(route);
    currentBook.value = notebooks.value.find(notebook => notebook.id == route.query.notebookId) 
    || notebooks.value[0] || {}

  if(currentBook.value.id){
    const noteRes = await Notes.getAll({notebookId: currentBook.value.id})
    notes.value = noteRes.data
    updateNotesList(noteRes)
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
        const selectedNotebook = notebooks.value.find(notebook => notebook.id == notebookId)
        if (selectedNotebook) {
            currentBook.value = selectedNotebook

               

            const res = await Notes.getAll({notebookId})
            notes.value = res.data
            console.log('切换到笔记本后的笔记:', notes.value)
            updateNotesList(res.data)
        }
    }
//   ElMessage(`click on item ${command}`)
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
