<template>
  <div>
    <Affix>
      <MyHeader :showSearch="true" @searchResult="searchResult"></MyHeader>
    </Affix>
    <div class="main-body">
      <Row>
        <Col :span="3">
          <div style="margin-top: 25px" id="menu" v-for="(item,index) in  menuList">
            <div class="category"
                 :style="{'background-color':activeIndex===index?'#2887f0':'','color':activeIndex===index?'white':''}"
                 @click="menuClick(index)">{{item}}
            </div>
          </div>
        </Col>
        <Col :span="15">
          <div class="main-info">
            <Card v-for="(item, index) in articleList" :key="index" style="width:100%;" :padding="5"
                  @click.native="myGlobal.goToArticleShow(item.articleId)">
              <Row class="main-info-content main-info-card">
                <Col :span="6">
                  <img v-lazy="item.titlePicture" style="height: 110px;width: 160px"/>
                </Col>
                <Col :span="18">
                  <div class="main-info-content-title">{{item.title}}</div>
                  <div style="margin-top: 50px">
                    <Row>
                      <Col :span="14">
                        <div style="cursor: pointer">
                          <img :src="item.userBaseInfo.header" class="user-header"/>
                          <div class="main-info-content-author">{{item.userBaseInfo.alias}}</div>
                        </div>
                      </Col>
                      <Col :span="3">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-z-like"></use>
                        </svg>
                        <span>{{item.articleAttribute.praiseNumber}}</span>
                      </Col>
                      <Col :span="3">
                        <svg class="icon" aria-hidden="true" style="font-size: 18px">
                          <use xlink:href="#icon-ico_yueduliang"></use>
                        </svg>
                        <span>{{item.articleAttribute.readingNumber}}</span>
                      </Col>
                      <Col :span="4">
                        <svg class="icon" aria-hidden="true" style="font-size: 18px">
                          <use xlink:href="#icon-pinglun"></use>
                        </svg>
                        <span>{{item.articleAttribute.commentNumber}}</span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card v-if="articleList==null||articleList.length==0 && hashLoad==true" style="height: 300px;text-align: center;">
              <div class="not-found-article">文章飞到火星去啦.....</div>
            </Card>
            <div class="loading" v-show="loadingShow" style="margin: 0 auto"></div>
          </div>
        </Col>
        <Col :span="6">
          <Card class="hot-article">
            <span slot="title" class="hot-article-card-title">最热文章</span>
            <div v-for="item in hotArticleList"
            >
              <Row>
                <Col :span="10">
                  <img v-lazy="item.titlePicture" @click="myGlobal.goToArticleShow(item.articleId)"
                       style="height: 80px;width: 100px"/>
                </Col>
                <Col :span="14">
                  <div class="hot-article-title" @click="myGlobal.goToArticleShow(item.articleId)">{{item.title | strOmit(10)}}</div>
                  <div class="hot-article-author">作者:<span @click="myGlobal.goToPersonCenter(item.userBaseInfo.mwId)">{{item.userBaseInfo.alias | strOmit(7)}}</span>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <MyBackTop/>
  </div>
</template>
<script>
  import MyBackTop from "../components/MyBackTop";

  export default {
    name: "Home",
    components: {
      MyBackTop
    },
    data() {
      return {
        articleList: [],
        isMenuActive: true,
        menuList: this.constant.categoryList,
        activeIndex: 0,
        scrollFinished: false,
        pageSize: 5,
        startNum: 0,
        articleCount: 0,
        loadingShow: true,//loading显示
        recentArticleList: [],//最新文章
        hotArticleList: [],//最热文章
        hashLoad: false
      }
    },
    mounted() {
      this.articleList = [];
      this.getArticleList(true);
      this.menuClick(0);
      window.addEventListener('scroll', this.scrollMethod);
    }, beforeDestroy() {
      window.removeEventListener('scroll', this.scrollMethod);
    },
    methods: {
      searchResult(result) {
        this.articleList = [];
        this.articleList = result;
      },
      getArticleCount() {
        let _this = this;
        let params = {
          categoryName: null
        };
        if (this.activeIndex != 0) {
          params.categoryName = this.menuList[this.activeIndex];
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/home/getArticleCount.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.articleCount = data.data;
          }
        }).catch((error) => {
        })
      },
      getArticleList(hot) {
        let _this = this;
        let params = {
          startNum: this.startNum,
          pageSize: this.pageSize,
          categoryName: null,
          timeOrder: "asc",
          hot: hot
        };
        if (this.activeIndex != 0) {
          params.categoryName = this.menuList[this.activeIndex];
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/home/getArticleList.do",
          method: "post",
          params: params
        }).then((response) => {
          _this.hashLoad = true;
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            if (params.hot) {
              _this.hotArticleList = data;
            } else {
              for (let i = 0; i < data.length; i++) {
                _this.articleList.push(data[i]);
              }
              _this.startNum = _this.articleList.length;
            }
          }
        }).catch((error) => {
        })
      },
      scrollMethod() {
        //距离顶端的高度
        let scrollTop = document.documentElement.scrollTop;
        //document.documentElement.clientHeight 滚动条的高度
        if (scrollTop + document.documentElement.clientHeight + 30 <= document.documentElement.scrollHeight) {
          this.scrollFinished = false;
        }
        if (!this.scrollFinished && scrollTop + document.documentElement.clientHeight + 30 >= document.documentElement.scrollHeight) {
          this.scrollFinished = true;
          this.getArticleList(false);
        }
      },
      initData() {
        this.startNum = 0;//页码重新开始
        this.articleList = [];//清空文章列表
      },
      menuClick(index) {
        this.activeIndex = index;
        this.initData();
        //如果没有 滚动加载 文章列表
        if (!this.scrollFinished) {
          this.getArticleList(false);
        }
        this.getArticleCount();
      }
    },
    watch: {
      articleList: function (oldValue, newValue) {
        if (newValue.length >= this.articleCount) {
          this.loadingShow = false;
        }
      }
    }, created() {

    }
  }
</script>
<style>
  body {
    background-color: #f6f6f6;
  }
</style>
<style scoped>
  .main-body {
    width: 1200px;
    margin: 0 auto;
    height: 50px;
  }

  .category {
    width: 100px;
    height: 50px;
    background-color: #F6F6F6;
    text-align: center;
    margin: 0 auto;
    line-height: 50px;
    font-size: 16px;
    position: relative;
    border-radius: 9px;
    -webkit-border-radius: 9px;
    -moz-border-radius: 9px;
    transition: 0.8s;
  }

  .category:hover {
    background-color: #2887f0;
    color: white;
    cursor: pointer;
  }

  .main-info {
    margin-top: 30px;
  }

  .user-header {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    float: left
  }

  .hot-article {
    margin-top: 30px;
    margin-left: 5px;
  }

  .hot-article-card-title {
    font-size: 20px;
    color: #333;
  }

  .main-info-content {
    padding: 12px;
  }

  .main-info-card {
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    -ms-transition: all 0.5s;
    -o-transition: all 0.5s;
    transition: all 0.5s;
    border: 1px solid transparent;
  }

  .main-info-card:hover {
    border: 1px solid dodgerblue;
  }

  .main-info-content-title {
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    color: #333;
  }

  .main-info-content-author {
    display: inline;
    margin-left: 5px;
  }

  .main-info-content-author:hover {
    color: dodgerblue;
  }

  .hot-article-title {
    font-size: 18px;
    cursor: pointer;
  }

  .hot-article-title:hover {
    color: dodgerblue;
  }

  .hot-article-author {
    margin-top: 15px;
    cursor: pointer;
    color: #767676;
  }

  .hot-article-author span:hover {
    color: dodgerblue;
  }

  .not-found-article {
    line-height: 300px;
    margin-top: -50px;
    color: black;
    font-size: 25px;
  }
</style>
