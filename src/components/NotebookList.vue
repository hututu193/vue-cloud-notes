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
          
         <router-link v-for="(notebook, index) in notebooks" :key="index" to="/note/1" class="notebook">

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
 import Notebooks from '@/apis/notebooks'
import { useRouter } from 'vue-router';
import {ref, onMounted} from 'vue'
import { friendlyDate } from '@/helpers/utils';

const router = useRouter();
const notebooks =ref([])
const loading = ref(false)

const checkAuthAndGetNotebooks = async () =>{
  try {
    const authRes = await Auth.getInfo()   
      //如果未登录，跳转登录页
      if(!authRes.isLogin){
        router.push({path: '/login'})
        return
      }
      //获取笔记本列表
      loading.value = true
      const notebookRes = await Notebooks.getAll()
      notebooks.value = notebookRes.data || []    
  } catch (error) {
    console.error('操作失败:', error);
    router.push({ path: '/login' });
  } finally {
    loading.value = false;
  }
} 

// 在组件挂载时执行
onMounted(() => {
  checkAuthAndGetNotebooks();
});

const onCreate = async () =>{
  let title = window.prompt('创建笔记本')
  if(!title) return  // 用户点击取消
  if(title.trim() === ''){
    alert('笔记名不能为空')
    return
  }

  const res = await Notebooks.addNotebook({title})
  //  console.log('创建响应:', res);
    
   res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt)
    alert(res.msg)
    notebooks.value.unshift(res.data)
    // console.log('更新后的数组', notebooks.value);
}

const onEdit = async (notebook) => {
  // console.log('编辑笔记本:', notebook);
    let title = window.prompt('修改标题', notebook.title)
    if (!title) return // 用户点击取消
    
    const res = await Notebooks.updateNotebook(notebook.id, { title })
    alert(res.msg)
    notebook.title = title
};

const onDelete = async (notebook) => {
  //  console.log('删除笔记本:', notebook);
  let isConfirm = window.confirm('你确定要删除吗')
  if(isConfirm){
     const res = await Notebooks.deleteNotebook(notebook.id)
      
      // 正确的方式：在 notebooks.value 上操作
      const index = notebooks.value.indexOf(notebook)
      if (index !== -1) {
        notebooks.value.splice(index, 1)
      }
  }
  
};

</script>

<script>
  export default {
  name: 'Notebooks'
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