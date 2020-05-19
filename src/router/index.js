import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=> import('../views/login/Login')
const Home = ()=> import('../views/home/Home.vue')

Vue.use(VueRouter)

  const routes = [
    {
      path:'',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home
    },
  
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  // to要访问的路径
  // from从哪个路径跳转来的
  // next()放行 next('/login')强行跳转
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
