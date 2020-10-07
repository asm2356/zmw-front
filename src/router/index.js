import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';
import 'animate.css'
import 'iview/dist/styles/iview.css';
import 'font-awesome/css/font-awesome.css'
import '../utils/myUtils'
import '../utils/vue-global'
import '../utils/axios'
import '../utils/myGlobal'
Vue.use(iView);
Vue.use(Router);
//自定义组件名
export default new Router({
  mode: 'history',//去掉路由#
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: () => import ('@/page/Home')
    }, {
      path: '/personalCenter',
      name: 'personalCenter',
      component: () => import ('@/page/personalCenter/personalCenter')
    }, {
      path: '/setting',
      name: 'setting',
      meta: {
        requireAuth: true
      },
      component: () => import('@/page/setting')
    }
    , {
      path: '/articleShow',
      name: 'articleShow',
      component: () => import("@/page/articleShow/articleShow")
    }
    , {
      path: '/login',
      name: 'login',
      component: () => import("@/page/login")
    }
    , {
      path: '/make',
      name: 'make',
      meta: {
        requireAuth: true
      },
      component: () => import("@/page/make")
    },
    {
      path: '/previewArticle',
      name: 'previewArticle',
      meta: {
        requireAuth: true
      },
      component: () => import("@/page/previewArticle")
    },
    {
      path: '/',
      name: 'logo',
      component: () => import("@/page/logo")
    },
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: Test
    // },
    {
      path: '*',
      name: 'notFound',
      component: () => import("@/page/error/notFound")
    }, {
      path: '/allLetter',
      name: 'allLetter',
      meta: {
        requireAuth: true
      },
      component: () => import("@/page/allLetter")
    }, {
      path: '/notOpenArticle',
      name: 'notOpenArticle',
      component: () => import("@/page/notOpenArticle")
    }, {
      path: '/about',
      name: 'about',
      component: () => import("@/page/about")
    }
  ]
})

