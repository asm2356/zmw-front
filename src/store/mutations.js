import {LOGIN} from './mutations-types'
import router from '../router'
import store from "./index";
import myUtils from "../utils/myUtils";

export default {
  [LOGIN](state, account) {
    state.account = account;
    if (account == null) {
      window.vm.myUtils.removeStore("account");
    } else {
      window.vm.myUtils.setStore("account", account);
    }
  }
}
router.beforeEach((to, from, next) => {
  //加载开始
  store.state.account = myUtils.getStore('account');
  if (to.matched.some(record => record.meta.requireAuth)) {// 判断该路由是否需要登录权限
    if (store.state.account != null) {
      next();
    } else {
      next({
        name: 'login'
      });
    }
  }
  else {
    next();
  }
  if (to.path == '/personalCenter') {
    if (to.query.mwId == null || to.query.mwId == '') {
      next({
        path: 'notFound'
      })
    }
  }
});


router.afterEach(route => {
  //加载完成
});


