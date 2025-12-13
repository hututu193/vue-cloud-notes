<template>
  <div class="notebook-container">
    
    <div class="header-bar">
      <h2>📚 我的笔记本 ({{ notebooks.length }})</h2>
      <el-button type="primary" round @click.prevent="onCreate">
        <i class="iconfont icon-plus" style="margin-right: 5px;"></i> 新建笔记本
      </el-button>
    </div>

    <el-skeleton v-if="loading" :rows="3" animated />
    
    <el-empty v-if="!loading && notebooks.length === 0" description="这里空空如也，快去创建第一个笔记本吧！" />

    <div class="notebook-grid" v-else>
      <el-row :gutter="20">
        <el-col 
          v-for="notebook in notebooks" 
          :key="notebook.id" 
          :xs="24" :sm="12" :md="8" :lg="6"
          style="margin-bottom: 20px;"
        >
          <el-card 
            class="notebook-card" 
            shadow="hover" 
            @click="jumpToNote(notebook.id)"
          >
            <div class="card-header">
              <div class="title-box">
                <i class="iconfont icon-notebook notebook-icon"></i>
                <span class="notebook-title" :title="notebook.title">{{ notebook.title }}</span>
              </div>
            </div>

            <div class="card-content">
              <div class="count-number">{{ notebook.noteCounts? notebook.noteCounts : '0' }}</div>
              <div class="count-label">篇笔记</div>
            </div>

            <div class="card-footer">
              <span class="date-text">{{ notebook.createdAtFriendly }}</span>
              
              <div class="actions">
                <el-button 
                  link 
                  type="primary" 
                  size="small" 
                  @click.stop="onEdit(notebook)"
                >
                  <i class="iconfont icon-edit"></i> 编辑
                </el-button>
                <el-button 
                  link 
                  type="danger" 
                  size="small" 
                  @click.stop="onDelete(notebook)"
                >
                  <i class="iconfont icon-trash"></i> 删除
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNotebooksStore } from '@/stores/notebooks'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router' // 引入路由跳转

const notebookStore = useNotebooksStore()
const { notebooks } = storeToRefs(notebookStore)
const router = useRouter() // 获取路由实例

defineOptions({
  name: 'NotebookList'
})

const loading = ref(false)

const loadNotebooks = async () => {
  try {
    loading.value = true
    await notebookStore.getNotebooks()

// console.log(res)

  } catch (error) {
    console.error('获取笔记本失败', error)
  } finally {
    loading.value = false
  }
}

// 跳转逻辑：不用 router-link 包裹，直接用 JS 跳转，样式更可控
const jumpToNote = (notebookId) => {
  router.push(`/note?notebookId=${notebookId}`)
}

onMounted(() => {
  loadNotebooks();
});


const onCreate = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入笔记本标题', '创建笔记本', {
      confirmButtonText: '创建',
      cancelButtonText: '取消',
      inputPattern: /^.{1,30}$/,
      inputErrorMessage: '标题不能为空且不超过30个字符',
    })
    await notebookStore.addNotebook(value)
    // ElMessage.success('创建成功！') // 优化提示
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('创建失败，请重试')
    }
  }
}

const onEdit = async (notebook) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新标题', '修改笔记本', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      inputValue: notebook.title,
      inputPattern: /^.{1,30}$/,
      inputErrorMessage: '标题不能为空且不超过30个字符',
    })
    await notebookStore.updateNotebook(notebook.id, value)
    // ElMessage.success('修改成功！')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('修改失败，请重试')
    }
  }
}

const onDelete = async (notebook) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除笔记本 "${notebook.title}" 吗？里面的笔记也会被删除哦！`, 
      '删除警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '我再想想',
        type: 'warning',
      }
    )
    await notebookStore.deleteNotebook(notebook.id)
    // ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('删除失败，请重试')
    }
  }
}
</script>

<style lang="less" scoped>

.notebook-container {
  min-height: 100%;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;

  h2 {
    font-size: 18px;
    color: #333;
    font-weight: 600;
  }
}

/* 卡片样式定制 */
.notebook-card {
  cursor: pointer;
  border: none; /* 去掉默认边框，用投影代替，更现代 */
  transition: all 0.3s;
  background: #f9f9f9; /* 稍微给一点灰背景，和白色内容区分 */
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-5px); /* 鼠标放上去，卡片上浮 5px */
    box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* 加深阴影 */
    background: #fff; /* 悬浮时变亮白 */
    border-color: #409eff; /* 边框变蓝 */
    
    .notebook-icon {
      color: #409eff; /* 图标变蓝 */
      transform: scale(1.1);
    }
  }
}

.card-header {
  margin-bottom: 15px;
  .title-box {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .notebook-icon {
      font-size: 20px;
      color: #909399;
      transition: all 0.3s;
    }

    .notebook-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.card-content {
  text-align: center;
  padding: 10px 0 20px 0;

  .count-number {
    font-size: 32px; /* 超大数字 */
    font-weight: bold;
    color: #333;
    font-family: 'Arial', sans-serif;
  }
  
  .count-label {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 5px;

  .date-text {
    font-size: 12px;
    color: #ccc;
  }
  
  .actions {
    .iconfont {
      font-size: 14px;
      margin-right: 2px;
    }
  }
}
</style>