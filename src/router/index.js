import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=> import('../views/login/Login')
const Home = ()=> import('../views/home/Home.vue')
const WelCome = ()=> import('../views/home/children/WelCome')
const User = ()=> import('../views/user/User')
const Rights = ()=> import('../views/prower/Rights')
const Roles = ()=> import('../views/prower/Roles')
const Cate = ()=> import('../views/goods/Cate')
const Params = ()=> import('../views/goods/Params')
const List = ()=> import('../views/goods/list/List')
const AddPage = ()=> import('../views/goods/addpage/AddPage')
const Order = ()=> import('../views/order/Order')
const Report = ()=> import('../views/report/Report')

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
      component:Home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          component:WelCome
        },
        {
          path:'/users',
          component:User
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:'/roles',
          component:Roles
        },
        {
          path:'/categories',
          component:Cate
        },
        {
          path:'/params',
          component:Params
        },
        {
          path:'/goods',
          component:List
        },
        {
          path:'/goods/add',
          component:AddPage
        },
        {
          path:'/orders',
          component:Order
        },
        {
          path:'/reports',
          component:Report
        }

      ]
    },
  
]
const router = new VueRouter({
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
