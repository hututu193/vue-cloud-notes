import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const username = ref('未登录')

    const setUsername = (name) => {
        username.value = name
    }

    return {
        username,
        setUsername
    }
})