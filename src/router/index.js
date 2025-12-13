import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 只有最核心的组件（如首页、登录页）使用同步导入

import Login from '@/components/Login.vue'
// import Notebooks from '@/components/NotebookList.vue'
// import NoteDetail from '@/components/NoteDetail.vue'
// import TrashDetail from '@/components/TrashDetail.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/note'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    // 其他所有组件都使用懒加载
    {
        path: '/notebooks',
        name: 'Notebooks',
        component: () => import('@/components/NotebookList.vue'),
        meta: { requiresAuth: true }  // ✅ 标记需要登录
    },
    {
        path: '/note',
        name: 'NoteDetail',
        component: () => import('@/components/NoteDetail.vue'),
        meta: { requiresAuth: true }  // ✅ 标记需要登录
    },
    {
        path: '/trash',
        name: 'TrashDetail',
        component: () => import('@/components/TrashDetail.vue'),
        meta: { requiresAuth: true }
    },
    // 可以添加加载状态
    // {
    //     path: '/loading',
    //     name: 'Loading',
    //     component: () => import('@/components/LoadingState.vue')
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
//全局路由守卫 
router.beforeEach(async (to, from, next) =>{

    if (to.path === '/login') {
        next()
        return
      }

    const userStore = useUserStore()
    const isLogin = await userStore.checkAuth()

    if(to.meta.requiresAuth && !isLogin){
        next({
            path: '/login',
            query: { redirect: to.fullPath}
        })
        return
         
    }
     // 如果已登录还访问登录页，跳转到首页
     if (to.path === '/login' && isLogin) {
       next('/')
       return
     }
    
    next()
})

export default router

