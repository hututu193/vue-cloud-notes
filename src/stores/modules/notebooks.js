import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Notebook from '@/apis/notebooks'

export const useNotebooksStore = defineStore('notebooks', () => {
    const notebooks = ref([])
    const currentBookId = ref(null)

    const currentBook = computed(() => {
        // 1. 确保 notebooks 是数组
        if (!Array.isArray(notebooks.value)) return {}
        
        // 2. 如果 notebooks 为空数组
        if (notebooks.value.length === 0) return {}
        
        // 3. 如果没有设置 currentBookId，返回第一个笔记本
        if (!currentBookId.value) return notebooks.value[0] || {}
        
        // 4. 根据 currentBookId 查找当前笔记本
        const notebook = notebooks.value.find(n => n.id == currentBookId.value)
        return notebook || notebooks.value[0] || {}
    })

    const setNotebooks = (newNotebooks) => { //设置笔记本列表
        notebooks.value = newNotebooks
    }
    
    const setCurrentBookId = (id) => {
        currentBookId.value = id
    }

    const getNotebooks = async () => {
        const res = await Notebook.getAll()
        setNotebooks(res.data)
     }

    const addNotebook = async (title) => {
        const res = await Notebook.addNotebook({title: title})
        notebooks.value.unshift(res.data)
        ElMessage({
            type: 'success',
            message: res.msg,
        })
    }

    const updateNotebook = async (notebookId, title) => {
        const res = await Notebook.updateNotebook(notebookId, {title: title})
        const notebook = notebooks.value.find(n => n.id === notebookId)
        if(notebook) notebook.title = title
        ElMessage({
            type: 'success',
            message: res.msg,
        })
    }

    const deleteNotebook = async (notebookId) =>{
        const res = await Notebook.deleteNotebook(notebookId)

        console.log(res);
        notebooks.value = notebooks.value.filter(n => n.id !== notebookId)
        ElMessage({
            type: 'success',
            message: res.msg,
        })
    }

    return {
        // 状态
        notebooks,
        currentBookId,
        currentBook,
        
        // 方法（actions）
        setNotebooks,
        addNotebook,
        updateNotebook,
        deleteNotebook,
        getNotebooks,
        setCurrentBookId
    }
})
