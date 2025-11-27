// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 只有最核心的组件（如首页、登录页）使用同步导入
import HelloWorld from '@/components/HelloWorld.vue'
import Login from '@/components/Login.vue'
import Notebooks from '@/components/NotebookList.vue'
import NoteDetail from '@/components/NoteDetail.vue'
import TrashDetail from '@/components/TrashDetail.vue'

const routes = [
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
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
        component: () => import('@/components/NotebookList.vue')
    },
    {
        path: '/note',
        name: 'NoteDetail',
        component: () => import('@/components/NoteDetail.vue')
    },
    {
        path: '/trash',
        name: 'TrashDetail',
        component: () => import('@/components/TrashDetail.vue')
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

export default router

