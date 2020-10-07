<template>
  <div>
    <Affix>
      <MyHeader></MyHeader>
    </Affix>
    <Row class="main-body">
      <!--这里是主要内容-->
      <a-player class="a-player " autoplay mini :float="true" v-if="article.articleContent.music!=null"
                :music="{src:article.articleContent.music}"
      />
      <Col :span="17">
        <div style="overflow: hidden">
          <div class="article-content">
            <div v-html="article.articleContent.content" class="content">
            </div>
          </div>
          <div class="article-bottom">
            <!--创建时间-->
            <div class="create-time">
              <svg class="icon create-time-icon" aria-hidden="true">
                <use xlink:href="#icon-shijian"></use>
              </svg>
              <span>创建于:{{article.articleAttribute.releaseTime | timestampToTime()}}</span>
            </div>
            <div class="article-footer">
              <!--分享样式-->
              <div class="share">
                <svg class="icon" aria-hidden="true" style="font-size: 40px;" @click="share('weibo')">
                  <use xlink:href="#icon-weibo"></use>
                </svg>
                <svg class="icon" aria-hidden="true" style="font-size: 35px;" @click="share('qq')">
                  <use xlink:href="#icon-QQ"></use>
                </svg>
                <svg class="icon" aria-hidden="true" style="font-size: 33px" @click="share('kongjian')">
                  <use xlink:href="#icon-kongjian"></use>
                </svg>
              </div>
              <!--收藏样式-->
              <div class="collector" :class="hasCollectorClass" @click="articleCollectorClick">
                <svg class="icon" aria-hidden="true"
                     style="font-size:18px;">
                  <use v-show="!hasCollector" xlink:href="#icon-shoucang1"></use>
                  <use v-show="hasCollector" xlink:href="#icon-star__easyico"></use>
                </svg>
                收藏
              </div>
              <!--点赞样式-->
              <div class="praise">
                <my-star :active="hasArticlePraise" @click.native="articlePraiseClick"/>
                <div class="praise-number">
                  {{article.articleAttribute.praiseNumber}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ArticleDiscuss :articleId="articleId" :commentNumber="article.articleAttribute.commentNumber"/>
      </Col>
      <Col :span="7">
        <Card style="margin-left: 10px">
          <p slot="title">关于作者</p>
          <Row>
            <Col :span="8">
              <img v-lazy="article.userBaseInfo.header" class="author-header"/>
            </Col>
            <Col :span="16">
              <div class="author-name" @click="myGlobal.goToPersonCenter(article.userBaseInfo.mwId)">
                {{article.userBaseInfo.alias}}
              </div>
              <div>{{article.userBaseInfo.introduction | strOmit(20)}}</div>
            </Col>
          </Row>
          <Row style="text-align: center;">
            <Col :span="8">
              <div>文章</div>
              <div style="color: black">{{articleNum}}</div>
            </Col>
            <Col :span="8">
              <div>被浏览</div>
              <div style="color: black;">{{authorReadingNumber}}</div>
            </Col>
            <Col :span="8">
              <div>粉丝</div>
              <div style="color: black">{{fansNum}}</div>
            </Col>
          </Row>
          <Row style="margin-top: 10px">
            <Col :span="10" :push="2">
              <SwitchBtn text="关注" :currentValue="isConcerned" @click.native="concernedAuthor">
                <svg slot="icon" class="icon" aria-hidden="true" font-size="20px">
                  <use xlink:href="#icon-jia"></use>
                </svg>
              </SwitchBtn>
            </Col>
            <Col :span="10" :push="2">
              <Button size="large" style="width: 100px" @click="sendLetterClick">
                <svg class="icon" aria-hidden="true" font-size="20px">
                  <use xlink:href="#icon-sixin"></use>
                </svg>
                &nbsp;私信
              </Button>
            </Col>
          </Row>
        </Card>
        <send-letter :user="article.userBaseInfo" :isShow="sendLetterModal"
                     @closeModal="sendLetterModal=false"/>
        <!--作者的其他作品 除了本文显示的文章-->
        <Card class="author-other-article" v-show="authorOtherArticle.length>1">
          <p slot="title">作者的其他文章</p>
          <Row style="margin-top: 10px" v-for="(item,index) in authorOtherArticle" v-if="item.articleId!=articleId"
               :key="index">
            <Col :span="8">
              <img v-lazy="item.titlePicture" @click="myGlobal.goToArticleShow(item.articleId)" class="title-picture"/>
            </Col>
            <Col :span="16">
                    <span class="author-article-title"
                          @click="myGlobal.goToArticleShow(item.articleId)">{{item.title}}</span>
              <div class="author-article-attribute">
                <svg class="icon" aria-hidden="true" style="font-size: 14px">
                  <use xlink:href="#icon-z-like"></use>
                </svg>
                <span>{{item.articleAttribute.praiseNumber}}  </span>
                <svg class="icon" aria-hidden="true" style="font-size: 14px">
                  <use xlink:href="#icon-ico_yueduliang"></use>
                </svg>
                <span>{{item.articleAttribute.readingNumber}}</span>
                <svg class="icon" aria-hidden="true" style="font-size: 14px">
                  <use xlink:href="#icon-pinglun"></use>
                </svg>
                <span>{{item.articleAttribute.commentNumber}}</span>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <ArticlePwd :articleId="articleId" @getArticleContent="getArticleContent"/>
    <MyBackTop/>
  </div>
</template>
<script>
  import MyStar from "../../components/myStar";
  import sendLetter from "../../components/sendLetter";
  import MyBackTop from "../../components/MyBackTop";
  import APlayer from 'vue-aplayer';
  import ArticlePwd from './articlePwd'
  import ArticleDiscuss from './articleDiscuss'

  export default {
    name: "articleShow",
    components: {
      MyBackTop,
      MyStar,
      sendLetter,
      APlayer,
      ArticlePwd,
      ArticleDiscuss
    },
    data() {
      return {
        aPlay: {
          float: true
        },
        sendLetterModal: false,
        articleId: this.$route.query.articleId,
        articleNum: 0,
        fansNum: 0,
        article: {
          articleContent: '',
          articleAttribute: '',
          userBaseInfo: ''
        },
        hasCollector: false,
        hasArticlePraise: false,
        authorReadingNumber: 0,//作者总阅读量
        authorOtherArticle: [],
        hasCollectorClass: {
          'cancel-collector': true,
          'has-collector': false
        },
        isConcerned: false,
        articleEncrypt: false
      }
    },
    mounted() {
      this.articleEncrypt = true;
      APlayer.disableVersionBadge = true;//不打印版本号
      this.initData();
    },
    methods: {
      getArticleContent(data) {
        this.article = data;
        this.getOpenArticleNumber();
        this.getFansNumber();
        this.getArticleReadingNumber();
        this.getAuthorOtherArticleList();
      },
      sendLetterClick() {
        if (this.$store.state.account == null) {
          this.$Message.error("登录之后才能发送私信");
          return;
        }
        this.sendLetterModal = true;
      },
      initData() {
        this.sendLetterModal = false;
        this.articleNum = 0;
        this.fansNum = 0;
        this.article = {
          articleContent: '',
          articleAttribute: '',
          userBaseInfo: ''
        };
        this.hasCollector = false;
        this.hasArticlePraise = false;
        this.authorReadingNumber = 0;//作者总阅读量
        this.authorOtherArticle = [];
      },
      //获取作者其他文章列表
      getAuthorOtherArticleList() {
        let _this = this;
        let params = {
          startNum: 0,
          pageSize: 5,
          mwId: _this.article.userBaseInfo.mwId
        };
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getArticleList.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;

          if (data.code === 1) {
            _this.authorOtherArticle = data.data;
          }
        }).catch((error) => {
        })
      },
      //获取用户总阅读量
      getArticleReadingNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/getArticleReadingNumber.do",
          method: "post",
          params: {
            mwId: _this.article.userBaseInfo.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.authorReadingNumber = data.data;
          }
        }).catch((error) => {
        });
      },
      //为文章点赞
      articlePraiseClick() {
        let _this = this;
        if (this.article == null) {
          return;
        }
        this.hasArticlePraise = !this.hasArticlePraise;
        if (this.hasArticlePraise) {
          this.article.articleAttribute.praiseNumber++;
        } else {
          this.article.articleAttribute.praiseNumber--;
        }
        //暂时存到缓存中一天点击有效只有一次
        // let cookieKey = this.articleId;
        // let expire = this.constant.time.day;
        // if (this.myUtils.getCookie(cookieKey) != null) {
        //   _this.myUtils.setCookie(cookieKey, _this.hasArticlePraise, expire);
        //   return;
        // }
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/updateArticlePraise.do",
          method: "post",
          params: {
            articleId: _this.articleId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            //_this.myUtils.setCookie(cookieKey, _this.hasArticlePraise, expire);
          }
        }).catch((error) => {
        })
      },
      //收藏文章
      articleCollectorBtn() {
        this.hasCollector = !this.hasCollector;
        if (this.hasCollector) {
          this.hasCollectorClass = {
            'cancel-collector': false,
            'has-collector': true
          }
        } else {
          this.hasCollectorClass = {
            'cancel-collector': true,
            'has-collector': false
          }
        }
      },
      articleCollectorClick() {
        this.articleCollectorBtn();
        let params = {
          articleId: this.articleId,
          isCollector: this.hasCollector//是否收藏
        };
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/articleCollector.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            if (_this.hasCollector) {
              _this.$Message.success("收藏成功");
            } else {
              _this.$Message.success("取消成功");
            }
          } else {
            _this.articleCollectorBtn();
          }
        }).catch((error) => {

        })
      },
      getOpenArticleNumber() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getOpenArticleNumber.do",
          method: "post",
          params: {
            mwId: _this.article.userBaseInfo.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.articleNum = data.data;
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
            mwId: _this.article.userBaseInfo.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.fansNum = data.data;
          }
        }).catch((error) => {
        })
      },
      concernedAuthor() {
        if (this.$store.state.account == null) {
          this.$Message.error("用户未登录");
          return;
        }
        this.isConcerned = !this.isConcerned;
        let _this = this;
        let params = {
          mwId: _this.article.userBaseInfo.mwId,
          isConcerned: this.isConcerned
        };
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/concernedAuthor.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            if (this.isConcerned) {
              _this.$Message.success("关注成功");
            } else {
              _this.$Message.success("取消关注成功");
            }
          } else {
            _this.$Message.error(data.message);
          }
        }).catch((error) => {
        });
      },
      share(type) {
        let url = "";
        let currentUrl = window.location.href;
        switch (type) {
          case "kongjian":
            url = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey"
            break;
          case "weibo":
            url = "http://service.weibo.com/share/mobile.php";
            break;
          case "qq":
            url = "http://connect.qq.com/widget/shareqq/index.html";
            break;
        }
        url = url + "?title=" + this.article.title + "&url=" + currentUrl;
        window.open(url)
      }
    },
    watch: {
      '$route': 'loadData'
    }
  }
</script>
<style scoped>
  .main-body {
    width: 1200px;
    margin: 0 auto;
    margin-top: 15px;
  }

  .author-header {
    width: 100px;
    height: 100px;
    border-radius: 50%;

  }

  .author-name {
    margin-top: 15px;
    font-size: 20px;
    font-weight: bold;
    color: black;
    cursor: pointer;
  }

  .author-name:hover {
    color: dodgerblue;
  }

  .author-article-title {
    margin-top: 5px;
    font-weight: 600;
    color: #2e2e2e;
    height: 70px;
    display: inline-block;
    cursor: pointer;
    margin-left: 10px;
    transition: all 0.5s;
    -moz-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
  }

  .author-article-title:hover {
    color: dodgerblue;
  }

  .content {
    padding: 20px;
    word-wrap: break-word;
  }

  .has-collector {
    border: 1px solid rgb(239, 206, 74);
    border-radius: 25px;
    color: rgb(239, 206, 74);

  }

  .cancel-collector {
    border: 1px solid gray;
    border-radius: 25px;
    color: gray;
  }

  .share {
    float: left;
    position: relative;
    left: 20px;
  }

  .praise {
    width: 120px;
    margin: 0 auto;
    position: relative;
    top: -20px;
  }

  .praise-number {
    position: relative;
    top: -60px;
    left: 70px;
  }

  .collector {
    float: right;
    position: relative;
    cursor: pointer;
    padding: 5px 20px;
    right: 25px;
    top: 10px;
  }

  .collector:hover {
    color: dodgerblue;
    border-color: dodgerblue;
  }

  .collector span {
    margin-left: 10px;
    font-size: 16px;
  }

  .author-article-attribute {
    margin-left: 10px;
    margin-top: -30px;
  }

  .article-content {
    background-color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .article-bottom {
    background-color: white;
  }

  .create-time {
    margin-top: 5px;
    position: relative;
    left: 680px
  }

  .create-time-icon {
    font-size: 8px;
    margin-top: -2px;
  }

  .article-footer {
    margin-top: 20px;
    height: 60px;
  }

  .input-tips span {
    color: orange
  }

  .author-other-article {
    margin-left: 10px;
    margin-top: 10px;
  }

  .title-picture {
    width: 100px;
    height: 70px;
  }

  .a-player {
    position: absolute;
    margin-left: 743px;
    margin-top: 40px;
  }

</style>
