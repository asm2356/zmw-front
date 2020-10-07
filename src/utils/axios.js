import Vue from "vue";
import axios from "axios";
import myUtils from "./myUtils";

Vue.prototype.$ajax = axios;
// axios.get()
//axios.defaults.baseURL = "http://127.0.0.1:8081";
axios.defaults.headers = {
  "Content-Type": "application/json;charset=UTF-8"
}
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
axios.interceptors.response.use((response) => {
  let excludeCode = [10014, 10022, 10023, 10024, 30005];//不统一处理返回的代码
  let headers = response.headers;
  if (headers['content-type'] === "application/json;charset=UTF-8") {
    let data = response.data;
    if (data.code !==1) {
      if (data.code === 10010) {
        window.vm.$Message.error(data.message);
        window.vm.$store.commit("LOGIN", null);
        return;
      }
      if (data.code === 30005) {
        let count = data.data.count;
        let time  = data.data.time;
        let result = myUtils.secondToDate(time);
        window.vm.$Message.error("您尝试次数已经超过" + count+"次,请" +result+ "后再试");
      }
      if (excludeCode.indexOf(data.code) === -1) {
        window.vm.$Message.error(data.message);
      }
    }
  }

  return response;
}, (error) => {
  return Promise.reject(error);
});
