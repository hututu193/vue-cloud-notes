import request from "@/helpers/request";
import { friendlyDate } from "@/helpers/utils";

const URL = {
    GET: '/notes/from/:notebookId',
    ADD: '/notes/to/:notebookId',
    UPDATE: '/notes/:noteId',
    DELETE: '/notes/:noteId'
}

export default {
    async getAll({ notebookId }) {
        const res = await request(URL.GET.replace(':notebookId', notebookId))

        res.data = res.data.map(note => {
            note.createdAtFriendly = friendlyDate(note.createdAt)
            note.updatedAtFriendly = friendlyDate(note.updatedAt) // 修正拼写
            return note
        }).sort((note1, note2) => {
            // 修正排序：按更新时间降序排列（最新的在前）
            return new Date(note2.updatedAt) - new Date(note1.updatedAt)
        })

        return res
    },

    updateNote({ noteId }, { title, content }) {
        return request(URL.UPDATE.replace(':noteId', noteId), 'PATCH', { title, content })
    },

    deleteNote({ noteId }) {
        return request(URL.DELETE.replace(':noteId', noteId), 'DELETE')
    },

    addNote({ notebookId }, { title = '', content = '' } = { title: '', content: '' }) {
        return request(URL.ADD.replace(':notebookId', notebookId), 'POST', { title, content })
    }
}

