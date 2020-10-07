<template>
  <div class="header-background">
    <Row class="header-main">
      <Col :span="5">
        <Row>
          <Col :span="4">
            <svg class="icon" aria-hidden="true" style="font-size: 40px;margin-top: 5px;margin-right: -10px">
              <use xlink:href="#icon-wenzhangzhuantishouye"></use>
            </svg>
          </Col>
          <Col :span="8">
            <div class="logo-font">美文</div>
          </Col>
          <Col :span="6">
            <span class="label-font link" @click="$router.push('/')">首页</span>
          </Col>
          <Col :span="6">
            <a class="label-font" style="color: #3E3E3E " @click="$router.push({
                    name: 'Home'
                });">发现</a>
          </Col>
        </Row>
      </Col>
      <Col :span="14">
        <Row>
          <Col :span="14">
            <div>
              <Input v-show="showSearch" search enter-button v-model="searchContent" class="search"
                     @on-search="searchMethod"
                     @on-enter="searchMethod" placeholder="请输入"/>
            </div>
          </Col>
          <Col :span="10">&nbsp;</Col>
        </Row>
      </Col>
      <Col :span="5" :push="3">
        <div class="badge">
          <Poptip placement="bottom" v-show="$store.state.account!=null">
            <Badge dot :count="unReadCount">
              <Icon type="ios-notifications-outline" size="26"></Icon>
            </Badge>
            <div slot="content" style="width: 360px;">
              <div class="letter-title">我的私信</div>
              <div class="letter-content">
                <div style="padding: 10px;" v-for="(item,index) in letterList" @click="lookLetter(item)">
                  <div style="float:left;">
                    <img :src="item.userBaseInfo.header" class="letter-title-picture"/>
                  </div>
                  <div class="letter-detail">
                    <div class="letter-detail-title">{{item.userBaseInfo.alias}}</div>
                    <div class="letter-detail-content">
                      <div>{{item.content | strOmit(14)}}</div>
                    </div>
                  </div>
                  <div style="display:inline-block;float:right;height: 50px;width: 50px;">
                    <div class="send-date">{{item.sendTime | timestampToSimpleTime}}</div>
                    <span v-show="item.isRead==1" class="letter-tip"></span>
                  </div>
                </div>
              </div>
              <div class="letter-footer">
                <div class="writer-letter-btn" @click="sendLetterModal=true">
                  <svg class="icon" aria-hidden="true" style="font-size: 16px;">
                    <use xlink:href="#icon-tubiao09"></use>
                  </svg>
                  <span>写私信</span>
                </div>
                <div class="look-all-letter" @click="$router.push({path:'/allLetter'})">查看所有私信</div>
              </div>
            </div>
          </Poptip>
          <send-letter :isShow="sendLetterModal" @closeModal="sendLetterModal=false"></send-letter>
          <Modal
            ok-text="回复"
            @on-ok="replyUser"
            v-model="letterContentControl">
            <div slot="header">
              <img :src="currentMessage.userBaseInfo.header" style="width: 40px;height: 40px;"/>
              <span
                style="font-size: 16px;font-weight: bold;color: #242424;position: relative;top: -15px;left: 10px;">{{currentMessage.userBaseInfo.alias}}</span>
            </div>
            <div style="word-wrap: break-word;max-height: 300px;overflow-x: hidden;overflow-y:scroll">
              {{currentMessage.content}}
            </div>
            <div>
              <Input type="textarea" v-model="replyContent"/>
            </div>
          </Modal>
          <Poptip v-show="$store.state.account!=null" style="margin-left: 36px" placement="bottom">
            <Avatar shape="square" icon="ios-person"/>
            <CellGroup slot="content">
              <Cell @click.native="goToPersonCenter">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yonghu-tianchong"></use>
                </svg>
                <span>我的主页</span>
              </Cell>
              <Cell @click.native="$router.push('/setting')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-ai-set"></use>
                </svg>
                <span>设置</span>
              </Cell>
              <Cell @click.native="$router.push('/home')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-faxian"></use>
                </svg>
                <span>发现</span>
              </Cell>
              <Cell @click.native="$router.push('/make')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-writing"></use>
                </svg>
                <span>开始写作</span>
              </Cell>
              <Cell @click.native="loginOut">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-app_icons--"></use>
                </svg>
                <span>退出</span>
              </Cell>
            </CellGroup>
          </Poptip>
          <span title="登录">
        <svg class="icon" v-show="$store.state.account==null" aria-hidden="true"
             style="margin-left: 30px;font-size: 20px;" @click="$router.push({name:'login'})">
             <use xlink:href="#icon-yonghu1"></use>
        </svg>
        </span>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import sendLetter from "./sendLetter";

  export default {
    name: "myheader",
    components: {sendLetter},
    props: {
      showSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        searchContent: '',
        hasLogin: true,
        sendLetterModal: false,
        letterList: [],
        letterContentControl: false,
        currentMessage: {
          userBaseInfo: {
            header: '',
            alias: ''
          }
        },
        replyContent: '',
        articleList: [],
        unReadCount: 0
      }
    },
    mounted() {
      if (this.$store.state.account != null) {
        this.getLetterList();
      }
    },
    methods: {
      lookLetter(item) {
        let _this = this;
        let hasReadCount = 0;
        //去掉 通知的红 点
        for (let i = 0; i < this.letterList.length; i++) {
          if (this.letterList[i].id == item.id) {
            this.letterList[i].isRead = this.constant.letterStatus.alreadyRead;
          }
          if (this.letterList[i].isRead == this.constant.letterStatus.alreadyRead) {
            hasReadCount++;
          }
        }
        this.unReadCount = this.letterList.length - hasReadCount;
        this.replyContent = '';
        //标记已读
        this.$ajax({
          url: _this.myBaseUrl.front + "/chat/readLetter.do",
          method: "post",
          params: {
            id: item.id
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
          }
        }).catch((error) => {
        });
        this.letterContentControl = true;
        this.currentMessage = item;
      },
      getLetterList() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/chat/getLetterList.do",
          method: "post",
          params: {
            startNum: 0,
            pageSize: 10,
            readStatus: 1,//未读
            bothStatus: false//只查询对方发过来的消息不查询自己发送的消息
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < data.data.length; i++) {
              _this.letterList.push(data.data[i]);
              _this.unReadCount += data.data.length;
            }
          }
        }).catch((error) => {

        });
      },
      replyUser() {
        if (this.replyContent === '') {
          this.$Message.info("请输入要回复的内容");
          return;
        }
        let _this = this;
        let params = {
          letterJson: {
            toUserBaseInfo: {
              mwId: this.currentMessage.userBaseInfo.mwId
            },
            sendTime: new Date().getTime(),
            content: this.replyContent,
            isRead: 1
          }
        };

        this.$ajax({
          url: _this.myBaseUrl.front + "/chat/writeLetter.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
          }
        }).catch((error) => {

        })
      },
      goToPersonCenter() {
        this.$router.push({
          path: '/personalCenter',
          query: {
            mwId: this.$store.state.account
          }
        });
      },
      loginOut() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/loginOut.do",
          method: "post",
          params: {}
        }).then((response) => {
          if (response.data.code === 1) {
            _this.$store.commit("LOGIN", null);

            _this.$router.push({
              path: "/login"
            });
          } else {
            _this.$Message.error("退出失败");
          }
        }).catch((error) => {
        })

      },
      searchMethod() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/home/getArticleListByTitle.do",
          method: "post",
          params: {
            title: _this.searchContent
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.articleList = data.data;
            _this.$emit("searchResult", _this.articleList);
          }
        }).catch((error) => {

        });
      }
    }
  }
</script>
<style scoped>
  .header-background {
    background-color: white;
    border-bottom: 1px darkgrey solid;
  }

  .logo-font {
    font-family: "KaiTi";
    font-size: 24px;
    line-height: 50px;
  }

  .header-main {
    width: 1200px;
    margin: 0 auto;
    height: 50px;
  }

  .search {
    margin-top: 8px;
  }

  .badge {
    margin-top: 8px;
  }

  .label-font {
    font-size: 18px;
    line-height: 50px;
  }

  .link {
    color: #B3B4B9;
    transition: 0.5s;
  }

  .link:hover {
    color: #0084FF;
    cursor: pointer;
  }

  .letter-title {
    margin: 0 auto;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    height: 35px;
    border-bottom: 1px #d8d5f6 solid;
  }

  .letter-title:hover {
    color: #918f8f;
  }

  .letter-content {
    overflow-y: scroll;
    width: 360px;
    height: 420px;
    overflow-x: hidden;
  }

  .letter-footer {
    padding: 10px;
    border-top: 1px #d8d5f6 solid;
    height: 40px;
  }

  .writer-letter-btn {
    font-size: 16px;
    display: inline-block;
    cursor: pointer;
  }

  .letter-title-picture {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  .letter-detail {
    display: inline-block;
    height: 50px;
    margin-left: 10px;
    cursor: pointer;
  }

  .letter-detail-title {
    font-size: 15px;
    font-weight: 500;
    color: black;
    cursor: pointer;
  }

  .letter-detail-content {
    font-size: 14px;
    color: #8590a5;
    cursor: pointer;
  }

  .look-all-letter {
    float: right;
    font-size: 16px;
    cursor: pointer;
  }

  .letter-tip {
    display: block;
    background: #f00;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    top: 5px;
    left: 35px;
    position: relative;
  }

  .send-date {
    position: relative;
    left: 20px;
  }
</style>
