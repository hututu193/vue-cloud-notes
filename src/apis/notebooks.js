import request from "@/helpers/request";
import { friendlyDate } from "@/helpers/utils";

const URL = {
    GET: '/notebooks',
    ADD: '/notebooks',
    UPDATE: '/notebooks/:id',
    DELETE: '/notebooks/:id'
}

export default {
    async getAll() {
        const res = await request(URL.GET)
        res.data.sort((notebook1, notebook2) =>
            notebook1.createdAt < notebook2.createdAt ? 1 : -1
        )
        res.data.forEach(element => {
            element.friendlyCreatedAt = friendlyDate(element.createdAt)
        })
        return res
    },

    updateNotebook(notebookId, { title = '' } = { title: '' }) {
        return request(URL.UPDATE.replace(':id', notebookId), 'PATCH', { title })
    },

    deleteNotebook(notebookId) {
        return request(URL.DELETE.replace(':id', notebookId), 'DELETE')
    },

    addNotebook({ title = '' } = { title: '' }) {
        return request(URL.ADD, 'POST', { title })
    }
}