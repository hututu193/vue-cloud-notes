import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Auth from '@/apis/auth'

export const useUserStore = defineStore('user', () => {
    const user = ref(null)

    const username = computed(() => {
        if (!user.value || !user.value.username) {
          return '未登录'
        }
        return user.value.username
      })

    const slug = computed(() => {
        if (!user.value || !user.value.username) {
          return '未'
        }
        return user.value.username.charAt(0)
      })

    const setUser = (userData) => {
        user.value = userData
    }

    const login = async ({username, password}) =>{
        const res = await Auth.login({username, password})
        // console.log('登录返回的数据:', res.data)
        // console.log('数据类型:', typeof res.data)
        setUser({username: res.data.username})
        return res
    }
    //登出
  const logout = async () => {
    try {
      await Auth.logout()
    } finally {
      setUser(null)  // 设置为 null，而不是 {username: null}
    }
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
        logout,
        checkAuth,
        login,
        register,
        setUser
    }
})