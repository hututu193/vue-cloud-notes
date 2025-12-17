import { createRouter, createWebHashHistory } from 'vue-router'
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
        redirect: '/notebooks'
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
    {
        path: '/:pathMatch(.*)*', 
        name: 'NotFound',
        component: () => import('../components/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory('/vue-cloud-notes/'),
    routes,
})
//全局路由守卫 
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    
    const isLogin = await userStore.checkAuth()

    if (to.path === '/login') {
        if (isLogin) {
            // A. 如果已登录，又想去登录页 -> 踢回首页
            next('/') 
        } else {
            // B. 没登录，想去登录页 -> 放行
            next() 
        }
    } else {
        // C. 去其他页面
        if (to.meta.requiresAuth && !isLogin) {
            // 需要权限但没登录 -> 踢回登录页，并带上回跳地址
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            // 其他情况（不需要权限，或者已登录） -> 放行
            next()
        }
    }
})

export default router

