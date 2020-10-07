<template>
  <div style="height: 100%">
    <div class="page1">
      <div :class="{menuHeaderWhiteScroll:menuHeader.menuHeaderWhiteScroll,
        menuHeaderWhite:menuHeader.menuHeaderWhite,
        menuHeaderOpacity:menuHeader.menuHeaderOpacity,
        menuHeaderOpacityScroll:menuHeader.menuHeaderOpacityScroll,
      menuColor:menuHeader.menuColor,menuColorScroll:menuHeader.menuColorScroll}">
        <div class="logo-head">
          MW
        </div>
        <div class="menu">
          <span>首页</span>
          <span @click="$router.push('/Home')">发现</span>
          <span @click="$router.push('/about')">关于</span>
          <span @click="$router.push('/login')">登陆</span>
        </div>
      </div>
      <div class="page1-content">
        <div class="title animated" :class="{fadeInUp:myAnimated.page1ContentTitle}">美文分享与创作</div>
        <div class="describe animated" :class="{fadeInLeft:myAnimated.page1ContentDescribe}">
          <p>朋友圈9张图，微博140个字</p>
          <p>你是不是已经习惯这样克制的表达？</p>
          <p>你创作的思路不该受到束缚，所以美篇来了</p>
          <p>分享生活，感悟人生</p>
        </div>
      </div>
    </div>
    <!--图片文字-->
    <Row>
      <Col :span="16" :push="4">
        <Row type="flex" align="middle">
          <Col :span="9" :push="2"><img class="animated page2-image"
                                        :class="{page2ImageScroll:myAnimated.page2Image}"
                                        src="../../static/images/happy.jpg"/></Col>
          <Col :span="9" :push="4">
            <div class="animated" :class="{rotateInDownRight:myAnimated.page2Content}"
                 style="font-size: 18px;color: black">每天分享一篇文章
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
    <!--两张图片-->
    <Row class="page6" :class="{page6Scroll:myAnimated.page6Scroll}">
      <Col :span="12">
        <div class="page6-left ">
          <div class="page6-left-title animated slow" :class="{bounceInUp:myAnimated.page6Content}">无所不能</div>
          <div class="page6-left-content animated slow" :class="{bounceInUp:myAnimated.page6Content}">
            <p>除了文章</p>
            <p>也可发图片</p>
            <p>还可放背景音乐和视频</p>
          </div>
        </div>
      </Col>
      <Col :span="12">
        <div class="page6-right"></div>
      </Col>
    </Row>
    <!--三张图片-->
    <Row type="flex" justify="center" align="middle">
      <Col :span="6">
        <div class="page4-col page4-first" :class="{page4FirstScroll:myAnimated.page4FirstScroll}">
          <div><img src="../../static/images/meinv2.jpg"></div>
          <div class="page4-content-describe">可以进行点赞</div>
        </div>
      </Col>
      <Col :span="6">
        <div class="page4-col page4-second" :class="{page4SecondScroll:myAnimated.page4SecondScroll}">
          <div><img src="../../static/images/xiongmao.jpg"/></div>
          <div class="page4-content-describe">可以评论文章</div>
        </div>
      </Col>
      <Col :span="6">
        <div class="page4-col page4-third" :class="{page4ThirdScroll:myAnimated.page4ThirdScroll}">
          <div><img src="../../static/images/xiangji.jpg"/></div>
          <div class="page4-content-describe">还可关注收藏文章</div>
        </div>
      </Col>
    </Row>
    <!--一张图片-->
    <div class="page3">
      <div class="page3-content animated" :class="{lightSpeedIn:myAnimated.page3ContentScroll}">
        <div class="page3-title">这世界的精彩，超乎你的想象</div>
        <div class="page3-btn" @click="$router.push('/Home')">开启我们的文学旅行吧</div>
      </div>
    </div>
    <Row class="page5">
      <Col :span="16" :push="4" class="copyright">
        <div>违法和不良信息举报：011-123456</div>
        <div>版权声明：您应尊重相关作品著作权人合法权益，未经著作权人合法授权，不能违法上传、存储、分享他人作品</div>
        <div>Copyright © 2018.Company name All rights reserved.</div>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "logo",
    data() {
      return {
        myBarOption: {
          barColor: "#0000ff",   //滚动条颜色
          barWidth: 6,           //滚动条宽度
          railColor: "#eee",     //导轨颜色
          horizrailenabled: false
        },
        menuHeader: {
          menuHeaderWhiteScroll: false,
          menuHeaderWhite: true,
          menuHeaderOpacity: false,
          menuHeaderOpacityScroll: false,
          menuColor: true,
          menuColorScroll: false
        },
        myAnimated: {
          page1ContentTitle: false,
          page1ContentDescribe: false,
          page2Image: false,
          page2Content: false,
          page4FirstScroll: false,
          page4SecondScroll: false,
          page4ThirdScroll: false,
          page6Scroll: false,
          page6Content: false,
          page3ContentScroll: false
        }
      }
    }
    ,
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.myAnimated.page1ContentTitle = true;
        this.myAnimated.page1ContentDescribe = true;
        let _this = this;
        let page2Finish = false;
        let page3Finish = false;
        let page4Finish = false;
        let page6Finish = false;
        window.addEventListener("scroll", () => {
          let scrollTop = document.documentElement.scrollTop;
          if (scrollTop >= 50) {
            this.menuHeader.menuHeaderWhiteScroll = true;
            this.menuHeader.menuHeaderWhite = true;
            this.menuHeader.menuHeaderOpacity = false;
            this.menuHeader.menuHeaderOpacityScroll = false;
            this.menuHeader.menuColor = false;
            this.menuHeader.menuColorScroll = true
          } else {
            this.menuHeader.menuHeaderWhiteScroll = false;
            this.menuHeader.menuHeaderWhite = false
            this.menuHeader.menuHeaderOpacity = true;
            this.menuHeader.menuHeaderOpacityScroll = true;
            this.menuHeader.menuColor = true;
            this.menuHeader.menuColorScroll = false
          }
          if (scrollTop >= 400 && !page2Finish) {
            _this.myAnimated.page2Image = true;
            _this.myAnimated.page2Content = true;
            page2Finish = true;
          }
          if (scrollTop >= 500 && !page6Finish) {
            _this.myAnimated.page6Scroll = true;
            _this.myAnimated.page6Content = true;
            page2Finish = true;
          }
          if (scrollTop >= 900 && !page4Finish) {
            _this.myAnimated.page4FirstScroll = true;
            _this.myAnimated.page4SecondScroll = true;
            _this.myAnimated.page4ThirdScroll = true;
            page4Finish = true;
          }
          if (scrollTop >= 1300 && !page3Finish) {
            _this.myAnimated.page3ContentScroll = true;
            page3Finish = true;
          }
        });
      }
    },
    destroyed() {

    }
  }
</script>

<style scoped>
  .page1 {
    background-image: url('../../static/images/yangwang.jpg');
    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    height: 100vh;
  }

  .menuHeaderWhite {
    float: right;
    position: fixed;
    width: 100%;
    z-index: 555;
    background-color: rgba(255, 255, 255, 0);
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
  }

  .menuHeaderWhiteScroll {
    background-color: rgba(255, 255, 255, 1);
  }

  .menuHeaderOpacity {
    background-color: rgba(255, 255, 255, 1);
    float: right;
    position: fixed;
    width: 100%;
    z-index: 666;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -ms-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
  }

  .menuHeaderOpacityScroll {
    background-color: rgba(255, 255, 255, 0);
  }

  .menu {
    float: right;
    font-size: 18px;
    margin-right: 200px;
    padding: 12px;
  }

  .menu span {
    margin-left: 15px;
  }

  .menu span:first-child {
    color: blue;
  }

  .menu span:hover {
    color: gray;
    cursor: pointer;
  }

  .menuColor {
    color: white;
  }

  .menuColorScroll {
    color: black;
  }

  .logo-head {
    float: left;
    margin-left: 250px;
    font-size: 26px;
    z-index: 777;
    padding: 8px;
    font-family: Cambria;
    font-style: italic;
  }

  .page1-content {
    position: absolute;
    width: 300px;
    height: 50px;
    top: 50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -200px;
    text-align: center;
  }

  .page1-content .title {
    font-size: 38px;
    color: white;
  }

  .page1-content .describe {
    margin-top: 50px;
    font-size: 14px;
    color: white;
  }

  .page2-image {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: relative;
    right: 200px;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -ms-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
  }

  .page2ImageScroll {
    opacity: 1;
    right: 0px;
  }

  .page3 {
    background-image: url("../../static/images/yuhui.jpg");
    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    height: 500px;
  }

  .page3-title {
    color: white;
    font-size: 38px;
    text-align: center;
  }

  .page3-content {
    position: relative;
    top: 30%;
  }

  .page3-btn {
    margin: 0 auto;
    width: 400px;
    font-size: 38px;
    text-align: center;
    cursor: pointer;
    color: white;
    border-radius: 25px;
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
    -ms-transition: all 1s;
    -o-transition: all 1s;
    transition: all 1s;
  }

  .page3-btn:hover {
    color: wheat;
  }

  .page4-content-describe {
    text-align: center;
    width: 300px;
    padding: 8px;
    font-size: 15px;
  }

  .page4-col {
    margin-top: 5px;
  }

  .page4-col img {
    width: 300px;
    height: 200px;
  }

  .page4-first {
    opacity: 0;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -ms-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
  }

  .page4FirstScroll {
    opacity: 1;
  }

  .page4-second {
    position: relative;
    right: 500px;
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
  }

  .page4SecondScroll {
    right: 0px;
  }

  .page4-third {
    position: relative;
    right: 500px;
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
  }

  .page4ThirdScroll {
    right: 0px;

  }

  .page5 {
  }

  .page6 {
    position: relative;
    left: 100vw;
    -webkit-transition: all 0.5s ease-out;
    -moz-transition: all 0.5s ease-out;
    -ms-transition: all 0.5s ease-out;
    -o-transition: all 0.5s ease-out;
    transition: all 0.5s ease-out;
  }

  .page6Scroll {
    left: 0vw;
  }

  .page6-left {
    background-color: dodgerblue;
    height: 500px
  }

  .page6-left-title {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -150px;
    margin-left: -100px;
    color: white;
    font-size: 48px;
  }

  .page6-left-content {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -70px;
    margin-left: -80px;
    font-size: 15px;
    text-align: center;
    color: white;
  }

  .page6-right {
    background-image: url('../../static/images/diannao.jpg');
    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
    background-size: 100% 100%;
    width: 100%;
    height: 500px;
  }

  .copyright {
    margin-top: 30px;
    text-align: center;
  }

  .copyright div {
    margin-top: 8px;
  }
</style>
