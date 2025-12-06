import Note from '@/apis/notes'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

export const useNotesStore = defineStore('notes', () => {
    const notes = ref([])
    const currentNoteId = ref(null)
   
    const currentNote = computed(() => {
        if (!Array.isArray(notes.value)) return {}
        if (notes.value.length === 0) return {}
        if (!currentNoteId.value) return notes.value[0] || {}

        const note = notes.value.find(n => n.id == currentNoteId.value)  // ✅ 加 .value
        return note || notes.value[0] || {}
    })

    const setNotes = (newNote) => { 
        notes.value = newNote
    }

    const setCurrentNoteId = (id) => {
        currentNoteId.value = id
    }
    
    const getNotes = async ({ notebookId }) => {
        const res = await Note.getAll({ notebookId })
        setNotes(res.data)
        return res
    }

    const addNote = async (notebookId, title, content) => {
        const res = await Note.addNote({ notebookId }, { title, content })
        notes.value.unshift(res.data)
    }

    const updateNote = async ({noteId}, { title, content }) => {
        const res = await Note.updateNote({ noteId }, { title, content })
        const note = notes.value.find(n => n.id === noteId)
        if (note) {
            note.title = title
            note.content = content
        }
    }

    const deleteNote = async ({noteId}) => {
        try {
            const res = await Note.deleteNote({ noteId })
            notes.value = notes.value.filter(n => n.id !== noteId)
            return res  // ✅ 只返回结果，不显示消息
        } catch (error) {
            // 可以记录错误但不显示消息
            console.error('删除笔记失败:', error)
            throw error  // 重新抛出错误
        }
    }
     
    return {
        // 状态
        notes,
        currentNote,       // ✅ 添加
        currentNoteId,     // ✅ 添加
        // 方法
        setNotes,
        setCurrentNoteId,  // ✅ 添加
        addNote,
        updateNote,
        deleteNote,
        getNotes
    }
})
