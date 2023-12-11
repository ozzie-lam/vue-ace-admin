/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-30 20:49:23
 * @Description:
 */
import { useIndexedDB } from '@/hooks/useIndexedDB'
import router from '@/router'
import { loginApi } from '@/views/user/login/api'
import { useRouteStore } from './route'
import { useTabsStore } from './tabs'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const getToken = computed(() => token.value)
  const { openDB, put, deleteData } = useIndexedDB()

  // 初始化
  async function init() {
    token.value = ''
    userInfo.value = null
    useRouteStore().init()
    useTabsStore().init()
    await openDB('my-database', 1, 'routes')
    await deleteData('routes', 'backendRoutes')
  }

  // 登录
  async function login(form: any) {
    const res = await loginApi(form)
    token.value = res.data.token
    userInfo.value = res.data
    // 转换后端路由信息并添加到路由实例
    await useRouteStore().setRoutes()
    // 打开数据库并保存路由信息到 IndexedDB
    await openDB('my-database', 1, 'routes')
    await put('routes', 'backendRoutes', useRouteStore().getRoutes)
    await router.push('/')
  }

  // 退出登录
  async function logout() {
    await router.push({ name: 'login', replace: true })
    await init()
    console.log('logout', router.getRoutes())
  }

  return {
    token,
    userInfo,
    getToken,
    login,
    logout
  }
})
