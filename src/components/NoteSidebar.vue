<template>
    <div class="note-sidebar">
        <span class="btn add-note">添加笔记</span>

        <el-dropdown @command="handleCommand" class="notebook-title">
    <span class="el-dropdown-link">
      我的笔记本1<el-icon class="el-icon--right"><arrow-down /></el-icon>
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
        <li v-for="note in notes" :key="note.id">
            <router-link :to="`/note?noteId=${note.id}`">
                <span class="date">{{ note.updateAtFriendly }}</span>
                <span class="title">{{ note.title }}</span>
            </router-link>
        </li>
    </ul>

    </div>
</template>

<script setup>
    import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
// import {ref} from 'vue '
import { reactive } from 'vue'

const notebooks = reactive([{
    id: 1, 
    title: 'hello1'
},
    {
    id: 2, 
    title: 'hello2'
},
])

const notes = reactive([
    {
    id: 11, 
    title: '第一个笔记',
    updateAtFriendly: '刚刚'
},
{
    id: 12, 
    title: '第2笔记',
    updateAtFriendly: '三分钟前'
},
])

const handleCommand = (command) => {
  ElMessage(`click on item ${command}`)
}
</script>

<script>
export default {
    name: 'NoteSidebar'
}
</script>

<style lang="less" >
@import url(../assets/css/note-sidebar.less);

</style>