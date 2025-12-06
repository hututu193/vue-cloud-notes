<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn"
      @click.prevent="onCreate"><i class="iconfont icon-plus"></i> 新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表{{ notebooks.length }}</h3>
        <div class="book-list">
          
          <!-- 这里需要再次确认key用什么 -->
         <router-link v-for="notebook in notebooks"
         :key="notebook.id" 
         :to="`/note?notebookId=${notebook.id}`" class="notebook">

            <div>
              <span class="iconfont icon-notebook"></span>{{ notebook.title }}
              <span>{{notebook.noteCounts}}</span>
              <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>  
              <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>  
              <span class="date">{{notebook.friendlyCreatedAt}}</span>              
            </div>
          </router-link>  
          
           <!-- 添加加载状态提示 -->
          <div v-if="loading" class="loading">加载中...</div>
          <div v-if="!loading && notebooks.length === 0" class="empty">暂无笔记本</div> 
        </div>       
      </div>

    </main>

  </div>
</template>

<script setup>
 import Auth from '@/apis/auth';
import { useRouter } from 'vue-router';
import {ref, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useUserStore } from '@/stores/modules/user';
import { useNotebooksStore } from '@/stores/modules/notebook'
import { storeToRefs } from 'pinia'

const notebookStore = useNotebooksStore()
const userStore = useUserStore()
const { notebooks} = storeToRefs(notebookStore)
const router = useRouter();

defineOptions({
  name: 'NotebookList'
})
// const notebooks =ref([])
const loading = ref(false)

const loadNotebooks = async () =>{
  try {
    loading.value = true
    await notebookStore.getNotebooks()
  } catch (error) {
    console.log('获取笔记本失败', error)
  } finally{
    loading.value = false
  }
}

// 在组件挂载时执行
onMounted(() => {
  loadNotebooks();
});

const onCreate = async () => {
  try {
    // 使用 Element Plus 的弹窗获取输入
    const { value } = await ElMessageBox.prompt('输入笔记本标题', '创建笔记本', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{1,30}$/,
      inputErrorMessage: '标题不能为空',
    })
  
    notebookStore.addNotebook(value)
  } catch (error) {
    // 这里会捕获两种错误：用户取消和API调用失败
    if (error === 'cancel' || error === 'close') {
      // 用户主动取消
      ElMessage({
        type: 'info',
        message: '已取消创建',
      })
    } else {
      // API 调用失败或其他错误
      console.error('创建笔记本失败:', error)
      ElMessage({
        type: 'error',
        message: '创建失败，请重试',
      })
    }
  }
}

const onEdit = async (notebook) => {
  try {
    let title = ''
  const { value } = await ElMessageBox.prompt('输入笔记本新标题', '修改笔记本', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: notebook.title, //显示原来的标题
    inputPattern: /^.{1,30}$/,
    inputErrorMessage: '标题不能为空，且不超过30个字符',
  })
  notebookStore.updateNotebook(notebook.id, value)
 
  } catch (error) {
    // 用户取消操作 - 静默处理，什么都不做
    if (error !== 'cancel' && error !== 'close') {
      // 只有真正的错误才提示用户
      console.error('编辑笔记本失败:', error)
      ElMessage({
        type: 'error',
        message: '编辑失败，请重试',
      })
    }
  }
}

const onDelete = async (notebook) => {
 try {
  await ElMessageBox.confirm(
    '确认要删除笔记本吗', '删除笔记本',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
   notebookStore.deleteNotebook(notebook.id)

 } catch (error) {
   if (error === 'cancel' || error === 'close') {
      // 用户主动取消
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    } else {
      // 其他错误（如网络错误）
      console.error('删除笔记本失败:', error)
      ElMessage({
        type: 'error',
        message: '删除失败，请重试',
      })
    }
  }
}
</script>


<style lang="less" scoped>
  @import url('../assets/css/notebook-list.less');

  .loading, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}
  
</style>