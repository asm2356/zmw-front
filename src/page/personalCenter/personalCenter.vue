<template>
  <div key="Date.now()">
    <Affix>
      <MyHeader/>
    </Affix>
    <div class="main-body">
      <Card>
        <div class="wall">
          <input type="file" :disabled="$store.state.account!=mwId" id="coverImgId"
                 @change="coverChange($event)">
          <img :src="userBaseInfo.cover" @click="coverImgClick"/>
        </div>
        <Row class="person-center-body">
          <Col :span="6">
            <div class="person-header" @click="headerImgClick">
              <div class="person-header-icon" v-show="$store.state.account==mwId">
                <svg class="icon" aria-hidden="true" style="font-size: 30px;color: white">
                  <use xlink:href="#icon-paizhao"></use>
                </svg>
              </div>
              <span class="person-header-tips" v-show="$store.state.account==mwId">
                  &nbsp;修改我的头像
                </span>
              <div>
                <input type="file" :disabled="$store.state.account!=mwId" id="personHeader"
                       @change="headerChange($event)"/>
                <img :src="userBaseInfo.header" />
              </div>
            </div>
          </Col>
          <Col :span="18">
            <div id="person-info">
              <div style="margin-top: 70px;font-size: 28px">{{userBaseInfo.alias}}</div>
              <div style="font-size: 16px">个性签名:{{userBaseInfo.introduction}}</div>
              <div style="margin-top: 40px;">
                <span>访问量:{{authorReadingNumber}}</span>
                <span style="margin-left: 10px;">获赞数:{{praiseNumber}}</span>
              </div>
            </div>
            <div style="float: right;margin-top: -25px;">
              <SwitchBtn style="display: inline-block"
                         v-show="$store.state.account!= mwId"
                         :currentValue="isConcerned"
                         text="关注" @click.native="switchConcerned(mwId);">
                <svg slot="icon" class="icon" aria-hidden="true" font-size="20px">
                  <use xlink:href="#icon-jia"></use>
                </svg>
              </SwitchBtn>
              <Button size="large"
                      style="display: inline-block;width: 100px;"
                      v-show="$store.state.account!= mwId"
                      @click="messageClick">
                <svg class="icon" aria-hidden="true" font-size="20px">
                  <use xlink:href="#icon-liaotian"></use>
                </svg>
                <span>私信</span>
              </Button>
              <send-letter :isShow="sendLetterModal" :user="userBaseInfo"
                           @closeModal="sendLetterModal=false">
              </send-letter>
            </div>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col :span="18">
          <Card style="margin-top: 10px">
            <Menu mode="horizontal" active-name="1" @on-select="onMenuSelect">
              <Submenu name="1" class="menu-item">
                <template slot="title">
                  文章 <span>{{articleSumNum}}</span>
                </template>
                <MenuItem :name="1+'-'+(index)" v-for="(item,index) in customThemeList" :key="index">{{item}}
                </MenuItem>
              </Submenu>
              <MenuItem name="2" class="menu-item">
                关注的人<span>{{noticerSumNum}}</span>
              </MenuItem>
              <MenuItem name="3" class="menu-item">
                粉丝<span>{{fansSumNum}}</span>
              </MenuItem>
              <MenuItem name="4" class="menu-item">
                收藏<span>{{collectSumNum}}</span>
              </MenuItem>
              <MenuItem name="5" class="menu-item">
                评论<span>{{discussSumNum}}</span>
              </MenuItem>
            </Menu>
            <div>
              <!--菜单下的内容-->
              <!--作品文章-->
              <PersonalArticle v-show="currentActiveMenu==1"
                               :mwId="mwId"
                               :sumNum="articleSumNum"
                               :pageNumber="pageNumber"
                               :currentCustomTheme="currentCustomTheme"
                               @deleteArticle="--articleSumNum"/>
              <!--关注-->
              <Concerned v-if="currentActiveMenu==2" :mwId="mwId" :sumNum="noticerSumNum" :pageNumber="pageNumber"
                         :currentCustomTheme="currentCustomTheme"/>
              <!--粉丝-->
              <Fans v-if="currentActiveMenu==3" :mwId="mwId" :sumNum="fansSumNum" :pageNumber="pageNumber"/>
              <!--收藏-->
              <Collect v-if="currentActiveMenu==4" :mwId="mwId" :sumNum="collectSumNum" :pageNumber="pageNumber"/>
              <!--评论-->
              <br/>
              <Discuss v-if="currentActiveMenu==5" :mwId="mwId" :sumNum="discussSumNum" :pageNumber="pageNumber"/>
            </div>
          </Card>
        </Col>
        <Col :span="5" style="margin-left: 20px">
          <Card style="margin-top: 10px;width: 280px" v-show="$store.state.account==mwId">
            <div style="margin-left: 15px;">
              <svg class="icon" aria-hidden="true" font-size="80px">
                <use xlink:href="#icon-xiezuo"></use>
              </svg>
              <div class="write-article" @click="$router.push('/make')">开始写作
              </div>
            </div>
          </Card>
          <!--<Card style="margin-top: 10px;width: 280px">-->
          <!--<div slot="title">-->
          <!--<svg class="icon" aria-hidden="true" font-size="22px">-->
          <!--<use xlink:href="#icon-tuijian"></use>-->
          <!--</svg>-->
          <!--<span style="font-weight: 600;vertical-align: top">-->
          <!--推荐用户-->
          <!--</span>-->
          <!--</div>-->
          <!--<div>-->
          <!--内容-->
          <!--</div>-->
          <!--</Card>-->
        </Col>
      </Row>
    </div>
    <MyBackTop/>
  </div>
</template>
<script>
  import Collect from "./collect";
  import Discuss from "./discuss";
  import Fans from "./Fans";
  import Concerned from "./concerned";
  import PersonalArticle from "./personalArticle";
  import sendLetter from "../../components/sendLetter";
  import MyBackTop from "../../components/MyBackTop";

  export default {
    name: "personalCenter",
    components: {Concerned, Fans, Discuss, Collect, sendLetter, MyBackTop, PersonalArticle},
    data() {
      return {
        scrollFinished: false,
        userBaseInfo: {
          cover: '/static/images/loading2.gif'
        },
        praiseNumber: 0,
        currentActiveMenu: 1,
        mwId: this.$route.query.mwId,
        authorReadingNumber: 0,
        articleSumNum: 0,
        noticerSumNum: 0,
        fansSumNum: 0,
        collectSumNum: 0,
        discussSumNum: 0,
        customThemeList: [],
        currentCustomTheme: null,
        pageNumber: 0,
        isConcerned: false,
        sendLetterModal: false
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollMethod);
    },
    mounted() {
      this.initData();
      window.addEventListener('scroll', this.scrollMethod);
      this.getUserCustomThemeList();
      this.initPersonInfo();
      this.getArticleNumber();
      this.getNoticerNumber();
      this.getFansNumber();
      this.getUserDiscussNumber();
      this.getCollectArticleNumber();
      this.getArticleReadingNumber();
    },
    methods: {

      initData() {
        this.pageNumber = 0
        this.userBaseInfo = {};
      },
      messageClick() {
        if (this.$store.state.account == null) {
          this.$Message.error("登录之后才能发送私信");
          return;
        }
        this.sendLetterModal = true
      },
      switchConcerned(mwId) {
        this.isConcerned = !this.isConcerned;
        this.myGlobal.switchConcernedAjax(mwId, this.isConcerned);
      },
      goToPersonCenter(mwId) {
        this.$router.push({
          name: 'personalCenter',
          query: {
            mwId: mwId
          }
        });
      },
      //获取用户的总阅读量
      getArticleReadingNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/getArticleReadingNumber.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.authorReadingNumber = data.data;
          }
        }).catch((error) => {

        });
      },
      scrollMethod() {
        let scrollTop = document.documentElement.scrollTop;
        if (scrollTop + document.documentElement.clientHeight + 30 <= document.documentElement.scrollHeight) {
          this.scrollFinished = false;
        }
        if (!this.scrollFinished && scrollTop + document.documentElement.clientHeight + 40 >= document.documentElement.scrollHeight) {
          this.scrollFinished = true;
          this.loadMoreMethod();
        }
      },
      onMenuSelect(name) {
        let itemIndex = name.split("-");
        if (itemIndex.length > 1 && itemIndex[0] == "1") {
          //文章类表(只有文章类表有子菜单)
          this.currentActiveMenu = itemIndex[0];
          if (itemIndex[1] == 0) {
            this.currentCustomTheme = null;
          } else {
            this.currentCustomTheme = this.customThemeList[itemIndex[1]];
          }
          this.getArticleNumber();
        } else {
          this.currentActiveMenu = itemIndex[0];
        }
        this.pageNumber = 0;
      },
      loadMoreMethod() {
        if (this.currentActiveMenu == 1) {

        }
        this.pageNumber++;
      },
      coverImgClick() {
        $("#coverImgId").click();
      },
      coverChange(e) {
        let file = e.target.files[0];
        if (!this.myGlobal.imageIsCorrect(file)) {
          return;
        }
        let _this = this;
        let formData = new FormData();
        formData.append("coverImg", file);
        formData.append("oldImg", this.userBaseInfo.cover);
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/user/changeCover.do",
          method: "post",
          headers: {'Content-Type': 'multipart/form-data'},
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let dfsFile = data.data;
            _this.userBaseInfo.cover = "http://" + dfsFile.host + "/" + dfsFile.groupName + "/" + dfsFile.path;
          }
        }).catch((error) => {
        });

      },
      headerImgClick() {
        $("#personHeader").click();
      },
      headerChange(e) {
        let file = e.target.files[0];
        if (!this.myGlobal.imageIsCorrect(file)) {
          return;
        }
        let _this = this;
        let formData = new FormData();
        formData.append("headerImg", file);
        formData.append("oldImg", this.userBaseInfo.header);
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/user/changeHeader.do",
          method: "post",
          headers: {'Content-Type': 'multipart/form-data'},
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let dfsFile = data.data;
            _this.userBaseInfo.header = "http://" + dfsFile.host + "/" + dfsFile.groupName + "/" + dfsFile.path;
          }
        }).catch((error) => {
        });
      },
      initPersonInfo() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/user/getUserBaseInfo.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.userBaseInfo = data.data;
            _this.getUserPraiseNumber();
          } else if (data.code === 10014) {
            _this.$router.push({
              name: "notFound"
            });
          }
        }).catch((error) => {

        })
      },
      getUserPraiseNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getUserPraiseNumber.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            this.praiseNumber = data.data;
          }
        }).catch((error) => {
        })
      },
      getNoticerNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getNoticerNumber.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.noticerSumNum = data.data;
          }
        }).catch((error) => {
        })
      },
      getCollectArticleNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getCollectArticleNumber.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.collectSumNum = data.data;
          }
        }).catch((error) => {
        })
      },
      getFansNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getFansNumber.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.fansSumNum = data.data;
          }
        })
          .catch((error) => {

          })
      },
      getUserDiscussNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getUserDiscussNumber.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.discussSumNum = data.data;
          }
        }).catch((error) => {
        })
      },
      getUserCustomThemeList() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getUserCustomThemeList.do",
          method: "post",
          params: {
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          _this.customThemeList.push("全部");
          if (data.code === 1) {
            for (let i = 0; i < data.data.length; i++) {
              _this.customThemeList.push(data.data[i].customThemeName);
            }
          }
        }).catch((error) => {
        })
      },
      getArticleNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getArticleNumber.do",
          method: "post",
          params: {
            mwId: this.mwId,
            customTheme: this.currentCustomTheme
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.articleSumNum = data.data;
          }
        }).catch((error) => {
        });
      }
    }
  }
</script>
<style scoped>
  body {
    background-color: #F6F6F6;
  }

  .wall {
    width: 1165px;
    height: 300px;
    overflow: hidden;
  }

  .wall img {
    width: 100%;
    height: 100%;
  }

  .menu-item {
    font-size: 18px;
    margin-left: 20px;
  }

  .person-center-body {
    margin-top: -50px;
    margin-left: 30px;
  }

  .person-header {
    width: 200px;
    height: 200px;
    border-radius: 20px;
  }

  .person-header:before {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    background-color: black;
    border-radius: 20px;
    opacity: 0;
    -webkit-transition: all 500ms linear 0s;
    -moz-transition: all 500ms linear 0s;
    -ms-transition: all 500ms linear 0s;
    -o-transition: all 500ms linear 0s;
    transition: all 500ms linear 0s;
  }

  .person-header img {
    width: 200px;
    height: 200px;
    border-radius: 20px;
  }

  .person-header:hover:before {
    opacity: 0.6;
  }

  .person-header-icon {
    position: absolute;
    top: 120px;
    left: 40px;
    opacity: 0;
    -webkit-transition: all 300ms linear 0s;
    -moz-transition: all 300ms linear 0s;
    -ms-transition: all 300ms linear 0s;
    -o-transition: all 300ms linear 0s;
    transition: all 300ms linear 0s;
  }

  .person-header:hover .person-header-icon {
    top: 90px;
    left: 40px;
    opacity: 1;
  }

  .person-header-tips {
    position: absolute;
    top: 70px;
    left: 70px;
    opacity: 0;
    color: white;
    -webkit-transition: all 200ms linear 0s;
    -moz-transition: all 200ms linear 0s;
    -ms-transition: all 200ms linear 0s;
    -o-transition: all 200ms linear 0s;
    transition: all 200ms linear 0s;
  }

  .person-header:hover .person-header-tips {
    position: absolute;
    top: 95px;
    left: 70px;
    opacity: 1;
  }

  .write-article {
    font-size: 20px;
    margin-top: -40px;
    margin-left: 95px;
    color: dodgerblue;
    cursor: pointer
  }

  input[type='file'] {
    opacity: 0;
    position: absolute;
  }

</style>
