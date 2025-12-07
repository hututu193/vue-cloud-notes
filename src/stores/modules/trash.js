import Trash from '@/apis/trash'
import { ElMessage } from 'element-plus'


import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTrashStore = defineStore('trash', () => {
    const trashNotes = ref([])
    const currTrashNoteId = ref(null)

    const currTrashNote = computed(() =>{
        if(!currTrashNoteId.value) return trashNotes.value[0] || {}
        return trashNotes.value.find(note => note.id == currTrashNoteId.value) || {}
    })

    const setTrashNotes = (notes) =>{
        trashNotes.value = notes
    }
    
const setCurrTrashNoteId = (currNoteId) =>{
    currTrashNoteId.value = currNoteId
}

    const getTrashNotes = async () =>{
        const res = await Trash.getAll()
        setTrashNotes(res.data)
    }

    const addTrashNote = (note) =>{
        trashNotes.value.unshift(note)
    }

    const deleteNote =async (noteId) =>{
        const res =await Trash.deleteNote({noteId})
        trashNotes.value = trashNotes.value.filter(note => note.id !== noteId)
        ElMessage({
            type: 'success',
            message: res.msg,
          })
    }

    const revertNote =async (noteId) =>{
        const res = await Trash.revertNote({noteId})
        trashNotes.value = trashNotes.value.filter(note => note.id !== noteId)
        ElMessage({
            type: 'success',
            message: res.msg,
          })
    }
    return {
        trashNotes,
        currTrashNote,
        currTrashNoteId,
        setTrashNotes,
        setCurrTrashNoteId,
        getTrashNotes,
        addTrashNote,
        revertNote,
        deleteNote,
    }
})
