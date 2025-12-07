import request from "@/helpers/request";
import { friendlyDate } from "@/helpers/utils";

const URL = {
    GET: '/notes/trash',
    REVERT: '/notes/:noteId/revert',
    DELETE: '/notes/:noteId/confirm'
  }

export default {
    async getAll () {
        const res = await request(URL.GET)

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

    deleteNote({ noteId }) {
        return request(URL.DELETE.replace(':noteId', noteId), 'DELETE')
      },
    
      revertNote({ noteId }) {
        return request(URL.REVERT.replace(':noteId', noteId), 'PATCH')
      }
    }
    