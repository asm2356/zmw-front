/**
 * Vue 相关的全局函数
 */
import Vue from "vue";
import myUtils from "../utils/myUtils";
import myGlobal from "../utils/myGlobal";
import MyHeader from "../components/myHeader";
import SwitchBtn from "../components/switchBtn";
import Loading from "../components/loading";
import VueLazyload from 'vue-lazyload'
Vue.component("MyHeader", MyHeader);
Vue.component("SwitchBtn", SwitchBtn);
Vue.component("Loading", Loading);
Vue.use(VueLazyload,{
  error: '/static/images/loadingCode.gif',
  loading:'/static/images/loading2.gif'
})
Vue.filter("timestampToTime", (value) => {
  if (value == null || value === '')
    return " ";
  return myUtils.timestampToTime(value);
});
Vue.filter("timestampToSimpleTime", (value) => {
  return myUtils.timestampToSimpleTime(value);
})
/**
 * 字符串省略 ag. strkkkk=>str...
 * @param value 要省略的字符串
 * @param length 长度多少要省略
 */
Vue.filter("strOmit", (value, length) => {
  if (value == null) {
    return null;
  }
  if (value.length <= length) {
    return value;
  } else {
    return value.substring(0, length) + "...";
  }
});
Vue.prototype.myUtils = myUtils;
Vue.prototype.myGlobal = myGlobal;
