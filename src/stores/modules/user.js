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
          // 修正这里：使用 user.value 而不是 user
        // return user.value === null ? '未' : user.value.username.charAt(0)
    })

    const setUser = (name) => {
        user.value = name
    }

    const login = async ({username, password}) =>{
        const res = await Auth.login({username, password})

        console.log('登录返回的数据:', res.data)  // 添加这行
        console.log('数据类型:', typeof res.data)

        setUser({name: res.data})
        return res
    }

    const register = async ({username, password}) =>{
        const res = await Auth.register({username, password})
        setUser({name: res.data})
    }

    const checkAuth = async () =>{
        // 已有用户信息，直接返回
        if (user.value) return true

        try {
            const res = await Auth.getInfo()
            if (res.isLogin) {
                user.value = res.data
                return true
            }
            return false
        } catch (error) {
           
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
