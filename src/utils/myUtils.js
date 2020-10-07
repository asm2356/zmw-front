export default class myUtils {
  /**
   * 将时间戳转化成时间格式 2018-11-28 6:10
   * @param value
   * @returns {string}
   */
  static timestampToTime = (value) => {
    let date = new Date(parseInt(value));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes();
    //let s = date.getSeconds();
    return Y + M + D + h + m;
  };
  /**
   * 将时间戳转化成时间格式  如果距离当前时间一天转化成日期否则转化成时间
   * @param value
   * @returns {string}
   */
  static timestampToSimpleTime = (value) => {
    let currentData = new Date().getTime();
    let date = new Date(parseInt(value));
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes();
    if (currentData - value > 86400000) {
      return M + D;
    } else {
      return h + m;
    }
  };

  /**
   * 时间转化时间戳 时间格式 2018-11-28 6:10
   * @param value
   */
  static timeToTimestamp(value) {
    let date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    return date.getTime();
  };


  /**
   * 获取字符串实际长度包括汉字
   * @param value
   */
  static getStrLength(value) {
    return value.replace(/[\u0391-\uFFE5]/g, value).length;
  }

  static setCookie(key, value, expire) {
    let date = new Date();
    date.setTime(date.getTime() + (expire));
    document.cookie = key + "=" + value + ";" + date;
  }

  static getCookie(key) {
    let name = key + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(name) == 0) return cookie.substring(name.length, cookie.length);
    }
    return null;
  }

  /**
   * 存储localStorage
   */
  static setStore(name, content) {
    if (!name) return
    window.localStorage.setItem(name, content)
  }

  /**
   * 获取localStorage
   */
  static getStore(name) {
    if (!name) return
    return window.localStorage.getItem(name)
  }

  /**
   * 删除localStorage
   */
  static removeStore(name) {
    if (!name) return
    window.localStorage.removeItem(name)
  }

  static secondToDate(msd) {
    let time = msd
    if (null != time && "" != time) {
      if (time > 60 && time < 60 * 60) {
        time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
          parseInt(time / 60.0)) * 60) + "秒";
      }
      else if (time >= 60 * 60 && time < 60 * 60 * 24) {
        time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
          parseInt(time / 3600.0)) * 60) + "分钟" +
          parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
      } else if (time >= 60 * 60 * 24) {
        time = parseInt(time / 3600.0 / 24) + "天" + parseInt((parseFloat(time / 3600.0 / 24) -
          parseInt(time / 3600.0 / 24)) * 24) + "小时" + parseInt((parseFloat(time / 3600.0) -
          parseInt(time / 3600.0)) * 60) + "分钟" +
          parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
      }
      else {
        time = parseInt(time) + "秒";
      }
    }
    return time;
  }
}
