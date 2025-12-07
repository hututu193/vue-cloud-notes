import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Auth from '@/apis/auth'

export const useUserStore = defineStore('user', () => {
    const user = ref(null)

    const username = computed(() =>{
        return user.value === null ? '未登录' : user.value.username
    })

    const slug = computed(() =>{
        return user.value === null ? '未' : user.value.username.charAt(0)
    })

    const setUser = (userData) => {
        user.value = userData
    }

    const login = async ({username, password}) =>{
        const res = await Auth.login({username, password})
        // console.log('登录返回的数据:', res.data)
        // console.log('数据类型:', typeof res.data)

        // 修改这里：提取 username 属性
        setUser({username: res.data.username})
        return res
    }

    const register = async ({username, password}) =>{
        const res = await Auth.register({username, password})
        // 修改这里：提取 username 属性
        setUser({username: res.data.username})
    }

    const checkAuth = async () =>{
        // 已有用户信息，直接返回
        if (user.value) return true

        try {
            const res = await Auth.getInfo()
            if (res.isLogin) {
                // 同样修改这里：提取 username 属性
                user.value = {username: res.data.username}
                return true
            }
            return false
        } catch (error) {
            console.error('检查登录状态失败:', error)
            return false
        }
    }
    
    return {
        user,
        slug,
        username,
        checkAuth,
        login,
        register,
        setUser
    }
})