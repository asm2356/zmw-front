import Vue from "vue";
import router from '../router'
import axios from "axios";

const myBaseUrl = {
    ucenter: 'http://192.168.52.131:8082',
    front: 'http://192.168.52.131:8182',
    manager: 'http://192.168.52.131:8282'
};
//const myBaseUrl = {
// ucenter: 'http://127.0.0.1:8082',
// front: 'http://127.0.0.1:8182',
// manager: 'http://127.0.0.1:8282'
//};
const constant = {
  default: {
    header: "../../static/images/default/header.png",//用户头像
    cover: '',//用户封面
    titlePicture: ''//文章标题图片
  }, categoryList: ['全部', '情感', '生活', '美食', '摄影', '随笔', '哲理', '其他'],
  letterStatus: {
    unRead: 1,
    alreadyRead: 2,
    all: 3
  },
  videoSize: 60 * 1024 * 1024,
  imageSize: 30 * 1024 * 1024,
  musicSize: 15 * 1024 * 1024,
  time: {
    second: 1,
    minute: 60,
    hours: 60 * 60,
    day: 60 * 60 * 24
  }
};
Vue.prototype.constant = constant;
Vue.prototype.myBaseUrl = myBaseUrl;
/**
 * 数组添加
 * @param index
 * @param item
 */
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
/**
 * 数组删除项
 * @param index
 */
Array.prototype.delete = function (index) {
  this.splice(index, 1);
};
export default class myGlobal {
  static goToArticleShow(articleId) {
    router.push({
      name: "articleShow",
      query: {
        articleId: articleId
      }
    });
  }

  static goToPersonCenter(mwId) {
    router.push({
      name: "personalCenter",
      query: {
        mwId: mwId
      }
    });
  }

  static switchConcernedAjax(mwId, isConcerned) {
    let _this = this;
    let params = {
      mwId: mwId,
      isConcerned: isConcerned
    };
    axios({
      url: myBaseUrl.front + "/personCenter/concernedAuthor.do",
      method: "post",
      params: params
    }).then((response) => {
      let data = response.data;
      if (data.code == 1) {
        _this.$Message.info("关注成功");
      }
    }).catch((error) => {
    });
  }

  static switchCollectAjax(articleId, isCollect) {
    let _this = window.vm;
    let params = {
      articleId: articleId,
      isCollect: isCollect
    };
    axios({
      url: myBaseUrl.front + "/personCenter/collectArticle.do",
      method: "post",
      params: params
    }).then((response) => {
      let data = response.data;
      if (data.code === 1) {
        if (data.data == true) {
          _this.$Message.success("收藏成功");
        } else {
          _this.$Message.success("取消收藏成功");
        }
      } else {
        _this.$Message.error(data.message);
      }
    }).catch((error) => {
      _this.$Message.error(data.message);
    });
  }

  static videoIsCorrect(file) {
    if (file == undefined || file == null) {
      return false;
    }
    let _this = window.vm;
    let videoType = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (videoType != "mp4") {
      _this.$Message.error("请上传MP4视频");
      return false;
    }
    if (file.size > _this.constant.videoSize) {
      _this.$Message.error("请上传小于" + _this.constant.videoSize / 1024 / 1024 + "M的视频");
      return false;
    }
    return true;
  }

  static imageIsCorrect(file) {
    if (file == undefined || file == null) {
      return false;
    }
    let _this = window.vm;
    let imageType = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (imageType != "png" && imageType != "jpeg" && imageType != "bmp" && imageType != "jpg") {
      _this.$Message.error("请选择正确格式的图片");
      return false;
    }
    if (file.size > _this.constant.imageSize) {
      _this.$Message.error("请上传小于" + _this.constant.imageSize / 1024 / 1024 + "M的图片");
      return false;
    }
    return true;
  }

  static musicIsCorrect(file) {
    if (file == undefined || file == null) {
      return false;
    }
    let _this = window.vm;
    let musicType = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (musicType != "mp3" && musicType != "wav") {
      _this.$Message.error("请选择mp3或者wav格式的音乐");
      return false;
    }
    if (file.size > _this.constant.musicSize) {
      _this.$Message.error("请上传小于" + _this.constant.musicSize / 1024 / 1024 + "M的音乐");
      return false;
    }
    return true;
  }
}
