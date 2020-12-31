import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
import {Message} from 'element-ui';
Vue.prototype.$message = Message

const vueRouter =  new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/useraccount_table',
                    component: () => import(/* webpackChunkName: "useraccount_table" */ '../components/page/UserAccount.vue'),
                    meta: { title: '账户管理' }
                },
                {
                    path: '/usernowtrace_table',
                    component: () => import(/* webpackChunkName: "usertracebreif_table" */ '../components/page/UserNowTrace.vue'),
                    meta: { title: '当前登录信息' }
                },
                {
                    path: '/userhistorytrace_table',
                    component: () => import(/* webpackChunkName: "usertraceverbose_table" */ '../components/page/UserHistoryTrace.vue'),
                    meta: { title: '历史登录信息' }
                },
                {
                    path: '/device_table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/DeviceManage.vue'),
                    meta: { title: '设备信息' }
                },
                {
                    path: '/global_configuration',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Ssid.vue'),
                    meta: { title: '全局配置'}
                },
                {
                    path: '/email_table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/emailpage.vue'),
                    meta: { title: '发送邮件' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/private',
            component: () => import(/* webpackChunkName: "private" */ '../components/page/Private.vue'),
            meta: { title: '个人用户页面' }
        }
    ]
});

export default vueRouter


// //路由导航守卫
// vueRouter.beforeEach((to, from, next) => {
//     //to 要去的路由配置
//     //from 当前的路由配置
//     //next 一定要调用，让to的路由配置继续生效，比如如果去登陆直接next(),否则判断token是否存在，如果存在就next()
//     if (to.path === '/login') return next() ;//使用return，不需要写else
//         //判断其他页面是否有token
//         const token = localStorage.getItem('token');
//         //存在继续往后走
//     if (token) return next();
//         // this.$router.push({name:'login'}) #没有this,无法使用
//         console.log("想进去，没门儿")
//         Message.warning('未登录，请先登录！')
//         vueRouter.push({
//             name: 'login'
//         })  
//   });

  
vueRouter.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token');
    if(to.path!='/login' && !token){
        console.log('想进去,没门儿！')
        next({path: '/login'})
    } else {  
        if(to.path =='/login' && token){
            next('/')
        }else{
            next()
        }
    }
})
  