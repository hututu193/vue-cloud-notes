<template>
  <div id="trash"  class="detail">
    <div class="note-sidebar">
      <h3 class="notebook-title">回收站</h3>
      <div class="menu">
        <div>更新时间</div>
        <div>标题</div>
      </div>

      <ul class="notes">
        <li v-for="(note, index) in trashNotes" :key="note.id">
          <router-link :to="`/trash?noteId=${note.id}`"
          :class="{ 'active': isNoteActive(note.id, index) }">
            <span class="date">{{ note.updatedAtFriendly }}</span>
            <span class="title">{{ note.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="note-detail">
      <div class="note-bar" v-if="true">
        <span>创建日期: {{ currTrashNote.createdAtFriendly }}</span>
        <span> | </span>
        <span>更新日期: {{ currTrashNote.updatedAtFriendly }}</span>
        <span> | </span>
        <span>所属笔记本: {{ belongTo }}</span>

        <a class="btn action" @click="onRevert">恢复</a>
        <a class="btn action" @click="onDelete">彻底删除</a>
      </div>
      <div class="note-title">
        <span>{{ currTrashNote.title }}</span>
      </div>
      <div class="editor">
        <div class="preview markdown-body" v-html="compiledMarkdown"></div>
      </div>
    </div>

<!-- 如果没有选中笔记，显示提示 -->


  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';
import {onMounted, computed, watch} from 'vue'
import { useTrashStore } from '@/stores/modules/trash';
import { storeToRefs } from 'pinia'
import MarkdownIt from 'markdown-it';
import { useNotebooksStore } from '@/stores/modules/notebooks';

const md = new MarkdownIt();
const route = useRoute()
const router = useRouter()
const trashStore = useTrashStore()
const {currTrashNote, trashNotes} = storeToRefs(trashStore)

const notebooksStore = useNotebooksStore()
const { notebooks } = storeToRefs(notebooksStore) 

defineOptions({
  name: 'TrashDetail'
})

const compiledMarkdown = computed(() =>{
   return md.render(currTrashNote.value.content || '')
})
const belongTo = computed(() =>{
  if(!currTrashNote.value || !currTrashNote.value.notebookId) {
    return '未知笔记本'
  }  
  // 笔记本数据还没加载完
  if(!notebooks.value || notebooks.value.length === 0){
    return '加载中'
  }

  const notebook = notebooks.value.find(
    notebook => notebook.id == currTrashNote.value.notebookId
  )
  return notebook ? notebook.title : '未知笔记本'
})
// const currTrashNote = ref({
//   id: 2,
//   title: '我的笔记',
//   content: '## hello',
//   createdAtFriendly: '2小时前',
//   updatedAtFriendly: '1小时前' // 添加这个属性
// })
const loadAllData = async () =>{
  try {
    await trashStore.getTrashNotes()
    await notebooksStore.getNotebooks()
    // 如果有路由参数，设置当前笔记
    if (route.query.noteId) {
      trashStore.setCurrTrashNoteId(route.query.noteId)
    } else if (trashNotes.value.length > 0) {
      // 如果没有noteId但有笔记，默认选择第一个并更新URL
      const firstNoteId = trashNotes.value[0].id
      router.replace({ path: '/trash', query: { noteId: firstNoteId } })
    }
  } catch (error) {
    console.error('加载回收站笔记失败:', error)
  }

}
onMounted(() =>{
  loadAllData()
})


// 监听路由参数变化
watch(
  () => route.query.noteId,
  (newNoteId) => {
    if (newNoteId) {
      trashStore.setCurrTrashNoteId(newNoteId)
    }
  },
  { immediate: true }
)
// const trashNotes = ref([
// {
//   id: 2,
//   title: '我的笔记',
//   content: '## hello',
//   createdAtFriendly: '2小时前',
//   updatedAtFriendly: '1小时前' // 添加这个属性
// },
//)

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

const onDelete = () => {
  if (!currTrashNote.value || !currTrashNote.value.id) {
    console.error('没有选中笔记')
    return
  }
  
  const noteId = currTrashNote.value.id
  if (confirm('确定要彻底删除这篇笔记吗？')) {
    trashStore.deleteNote(noteId).then(() => {
      // 删除后，如果有其他笔记，跳转到第一个
      if (trashNotes.value.length > 0) {
        router.replace({ path: '/trash', query: { noteId: trashNotes.value[0].id } })
      } else {
        // 如果没有笔记了，清空URL参数
        router.replace({ path: '/trash' })
      }
    })
  }
}

const onRevert = () => {
  if (!currTrashNote.value || !currTrashNote.value.id) {
    console.error('没有选中笔记')
    return
  }
  
  const noteId = currTrashNote.value.id
  if (confirm('确定要恢复这篇笔记吗？')) {
    trashStore.revertNote(noteId).then(() => {
      // 恢复后，如果有其他笔记，跳转到第一个
      if (trashNotes.value.length > 0) {
        router.replace({ path: '/trash', query: { noteId: trashNotes.value[0].id } })
      } else {
        // 如果没有笔记了，清空URL参数
        router.replace({ path: '/trash' })
      }
    })
  }
}

</script>
 

<style lang="less" scoped>
@import url(../assets/css/note-sidebar.less);
@import url(../assets/css/note-detail.less);

#trash {
  display: flex;  
  align-items: stretch;
  background-color: #fff;
  flex: 1;

  height: 100%; /* 添加这行 - 关键！ */
  min-height: 0; /* 添加这行 - 关键！ */


  .note-bar {
    .action {
      float: right;
      margin-left: 10px;
      padding: 2px 4px;
      font-size: 12px;

    }
  }
 }
</style>