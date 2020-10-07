<template>
  <div class="discuss-container">
    <div class="article-discuss">
      <label>
        <Input type="textarea" :rows="4" ::maxlength="500" v-model="discussArticleContent"/>
      </label>
      <p class="text-limit">
        <span>还可以输入</span>
        <span style="color: orange">{{500-discussArticleContent.length}}</span>字
      </p>
      <Button type="primary" class="comment-btn" @click="articleDiscuss">评论</Button>
    </div>
    <div v-for="(item,index) in discussList">
      <Divider/>
      <!--评论-->
      <Row>
        <Col :span="2">
          <img class="comment-header"
               :src="item.userBaseInfo.header"
               @click="myGlobal.goToPersonCenter(item.userBaseInfo.mwId)"/>
        </Col>
        <Col :span="18">
          <div>
            <div>
              <span class="alias"
                    @click="myGlobal.goToPersonCenter(item.userBaseInfo.mwId)">{{item.userBaseInfo.alias}}</span>
              <span class="comment-time">{{item.discussTime | timestampToTime}}</span>
            </div>
            <div class="comment-content">
              {{item.content}}
            </div>
            <div class="reply">
              <div v-show="activeDiscuss==index ">
                <Input type="textarea" :rows="4" :maxlength="500" v-model="replyDiscussContent"/>
                <p class="input-tips">还可以输入
                  <span>{{500-replyDiscussContent.length}}</span>字
                </p>
                <div style="float: right">
                  <span class="cancel-comment" @click="activeDiscuss=-1">取消</span>
                  <Button type="primary" @click="replyComment(index,item.discussId)">评论</Button>
                </div>
              </div>
              <div class="reply-text" @click="discussClick(index)">回复</div>
              <div style="display: inline-block" @click="spreadReply(index)">
                <p
                  v-show="!discussList[index].discussControl &&item.replyDiscussList!=null &&item.replyDiscussList.length>0">
                  {{item.replyDiscussList.length}}条回复
                  <svg class="icon" aria-hidden="true" font-size="15px">
                    <use xlink:href="#icon-open"></use>
                  </svg>
                </p>
                <p v-show="discussList[index].discussControl">
                  收起回复
                  <svg class="icon" aria-hidden="true" font-size="15px">
                    <use xlink:href="#icon-shouqishangjiantou-"></use>
                  </svg>
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col :span="4">
          <div @click="praiseDiscuss(item.discussId,index)">
            <svg v-show="item.discussPraiseControl" class="icon discuss-praise praise-ok" aria-hidden="true"
                 font-size="20px">
              <use xlink:href="#icon-dianzan_active"></use>
            </svg>
            <svg v-show="!item.discussPraiseControl" class="icon discuss-praise" aria-hidden="true" font-size="20px">
              <use xlink:href="#icon-zan2"></use>
            </svg>
          </div>
          <div class="comment-number">{{item.praiseNumber}}</div>
        </Col>
      </Row>
      <!--回复评论-->
      <div class="reply-discuss" v-show="discussList[index].discussControl">
        <div v-for="(reply,replyIndex) in item.replyDiscussList" :key="replyIndex">
          <Divider/>
          <Row v-if="reply!=null">
            <Col span="1" offset="2">
              <img class="reply-header" :src="reply.userBaseInfo.header"
                   @click="myGlobal.goToPersonCenter(item.userBaseInfo.mwId)"/>
            </Col>
            <Col span="17">
              <div>
                <span class="alias" @click="myGlobal.goToPersonCenter(item.userBaseInfo.mwId)">{{reply.userBaseInfo.alias}}</span>
                <span class="comment-time">{{reply.discussTime | timestampToTime}}</span>
              </div>
              <div class="comment-content" v-if="reply.toContent==null">
                {{reply.content}}
              </div>
              <div class="comment-content" v-if="reply.toContent!=null">
                {{reply.content}}
                <span class="target-user" @click="myGlobal.goToPersonCenter(reply.targetUserBaseInfo.mwId)">
                        @{{reply.targetUserBaseInfo.alias}}
                      </span>
                :{{reply.toContent}}
              </div>
              <div class="reply">
                <!--输入框输入-->
                <div v-if="activeReplyDiscuss==replyIndex">
                  <Input type="textarea" :rows="4" v-model="replyDiscussContent" :maxlength="500"/>
                  <p class="input-tips" style="margin-left: 480px;">
                    还可以输入
                    <span>{{500-replyDiscussContent.length}}</span>字
                  </p>
                  <div style="float: right">
                    <span class="cancel-comment" @click="activeReplyDiscuss=-1">取消</span>
                    <Button type="primary"
                            @click="toReplyDiscuss(index,reply.content,item.discussId,reply.userBaseInfo.mwId)">
                      评论
                    </Button>
                  </div>
                </div>
                <div style="margin-top: 8px;" @click="replyDiscussClick(replyIndex)">回复</div>
              </div>
            </Col>
            <Col span="4">
              <div @click="praiseReplyDiscuss(index,replyIndex,reply.replyDiscussId)">
                <svg v-show="reply.replyDiscussPraiseControl" class="icon discuss-praise praise-ok" aria-hidden="true">
                  <use xlink:href="#icon-dianzan_active"></use>
                </svg>
                <svg v-show="!reply.replyDiscussPraiseControl" class="icon discuss-praise" aria-hidden="true">
                  <use xlink:href="#icon-zan2"></use>
                </svg>
              </div>
              <div class="reply-number">{{reply.replyPraiseNumber}}</div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div @click="getDiscussList" class="lookComment"
         v-show="commentNumber!=undefined && commentNumber!=0 && discussList.length<commentNumber">
      查看更多评论
    </div>
    <br/><br/>
  </div>
</template>
<script>
  export default {
    name: "ArticleDiscuss",
    props: ['articleId', 'commentNumber'],
    data() {
      return {
        discussArticleContent: '',//评论文章的textarea
        discussList: [],
        activeReplyDiscuss: -1,//当前活动的textarea
        activeDiscuss: -1,//当前活动的textarea
        replyDiscussContent: '',//相互评论的textarea
        discussStartNum: 0,//评论开始页
        discussPageSize: 5,//页大小
        discussCount: 0
      }
    },
    methods: {
      initData() {
        this.discussList = [];
        this.activeReplyDiscuss = -1;//当前活动的textarea
        this.activeDiscuss = -1;//当前活动的textarea
        this.replyDiscussContent = '';//相互评论的textarea
        this.discussArticleContent = '';//评论文章的textarea
        this.discussStartNum = 0;//评论开始页
        this.discussCount = 0
      },
      getDiscussList() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/getDiscussList.do",
          method: "post",
          params: {
            articleId: _this.articleId,
            startNum: _this.discussStartNum,
            pageSize: _this.discussPageSize
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.discussList.push(...data.data);
            for (let i = 0; i < _this.discussList.length; i++) {
              _this.$set(_this.discussList[i].replyDiscussList, 'replyDiscussPraiseControl', false);
            }
            _this.discussStartNum = _this.discussList.length;
          }
        }).catch((error) => {
        });
      },
      //收起展开回复
      spreadReply(index) {
        let newValue = !this.discussList[index].discussControl;
        this.$set(this.discussList[index], 'discussControl', newValue);
      },
      //评论文章
      articleDiscuss() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/writeDiscuss.do",
          method: "post",
          params: {
            discussTime: new Date().getTime(),
            articleId: _this.articleId,
            content: _this.discussArticleContent
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            _this.discussList.insert(0, {
              articleId: _this.articleId,
              content: _this.discussArticleContent,
              discussId: data.discussId,
              discussTime: new Date().getTime(),
              praiseNumber: 0,
              replyDiscussList: [],
              userBaseInfo: data.userBaseInfo
            });
          }
        }).catch((error) => {
        })
      },
      //点击回复
      discussClick(index) {
        this.activeDiscuss = index;
        //评论和回复评论相互排斥
        if (this.activeReplyDiscuss > 0) {
          this.activeReplyDiscuss = -1;
        }
        this.replyDiscussContent = '';
        //自评论框不显示
        this.activeReplyDiscuss = -1;
      },
      //子评论之间的点击回复
      replyDiscussClick(index) {
        this.activeReplyDiscuss = index;
        if (this.activeDiscuss > 0) {
          this.activeDiscuss = -1;
        }
        this.replyDiscussContent = '';
        this.activeDiscuss = -1;
      },
      //回复主评论人 主评论人评论表Id
      replyComment(index, discussId) {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/replyComment.do",
          method: "post",
          params: {
            discussId: discussId,
            content: _this.replyDiscussContent,
            discussTime: new Date().getTime()
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            _this.discussList[index].replyDiscussList.insert(0, {
              content: _this.replyDiscussContent,
              discussId: discussId,
              discussTime: new Date().getTime(),
              replyDiscussId: data.replyDiscussId,
              replyPraiseNumber: 0,
              targetUserBaseInfo: [],
              toContent: null,
              userBaseInfo: data.userBaseInfo
            });
            _this.activeDiscuss = -1;//关闭评论框
          }
        }).catch((error) => {
        });
      },
      //回复评论人之间的评论 主评论人评论表Id,子评论人id,content @的内容
      toReplyDiscuss(index, toContent, discussId, targetUserMwId) {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/toReplyDiscuss.do",
          method: "post",
          params: {
            discussId: discussId,
            targetUserMwId: targetUserMwId,
            toContent: toContent,
            content: _this.replyDiscussContent,
            discussTime: new Date().getTime()
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            _this.discussList[index].replyDiscussList.insert(0, {
              content: _this.replyDiscussContent,
              discussId: discussId,
              discussTime: new Date().getTime(),
              replyDiscussId: data.replyDiscussId,
              replyPraiseNumber: 0,
              targetUserBaseInfo: data.targetUserBaseInfo,
              toContent: toContent,
              userBaseInfo: data.userBaseInfo
            });
            _this.activeReplyDiscuss = -1;//关闭评论框
          }
        }).catch((error) => {
        })
      }, //为评论者点赞
      praiseDiscuss(discussId, index) {
        let _this = this;
        let newValue = !this.discussList[index].discussPraiseControl;
        this.$set(this.discussList[index], 'discussPraiseControl', newValue);
        if (newValue) {
          this.discussList[index].praiseNumber++;
        } else {
          this.discussList[index].praiseNumber--;
        }
        //对评论点赞缓存
        let cookieKey = this.discussList[index].discussId;
        let expire = this.constant.time.day;
        if (this.myUtils.getCookie(cookieKey) != null) {
          _this.myUtils.setCookie(cookieKey, newValue, expire);
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/updateDiscussPraise.do",
          method: "post",
          params: {
            discussId: discussId,
            praiseNumber: _this.discussList[index].praiseNumber
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.myUtils.setCookie(cookieKey, newValue, expire);
          }
        }).catch((error) => {
        })
      },
      //index=>discuss,replyIndex==>replyDiscuss
      praiseReplyDiscuss(index, replyIndex, replyDiscussId) {
        let _this = this;
        let newValue = !this.discussList[index].replyDiscussList[replyIndex].replyDiscussPraiseControl;
        this.discussList[index].replyDiscussList[replyIndex].replyDiscussPraiseControl = newValue;
        if (newValue) {
          this.discussList[index].replyDiscussList[replyIndex].replyPraiseNumber++;
        } else {
          this.discussList[index].replyDiscussList[replyIndex].replyPraiseNumber--;
        }
        let cookieKey = this.discussList[index].replyDiscussList[replyIndex].replyDiscussId;
        let expire = this.constant.time.day;
        if (this.myUtils.getCookie(cookieKey) != null) {
          _this.myUtils.setCookie(cookieKey, newValue, expire);
          return;
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/updateReplyDiscussPraise.do",
          method: "post",
          params: {
            replyDiscussId: replyDiscussId,
            praiseNumber: _this.discussList[index].replyDiscussList[replyIndex].replyPraiseNumber
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.myUtils.setCookie(cookieKey, newValue, expire);
          }
        }).catch((error) => {

        })
      },
    },
    mounted() {
      this.initData();
      this.getDiscussList();
    }, watch: {
      commentNumber: function (newValue, oldValue) {
        if (newValue != null && newValue != '') {
          this.getDiscussList();
        }
      }
    }
  }
</script>
<style scoped>
  .article-discuss {
    width: 800px;
    margin: 0 auto;
  }

  .reply-header {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .comment-header {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: 32px;
  }

  .lookComment {
    width: 100%;
    margin: 0 auto;
    background-color: #d8d5f6;
    color: #406599;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
  }

  .alias {
    font-size: 14px;
    color: #527f99;
    cursor: pointer;
    font-weight: bold;
  }

  .comment-time {
    font-size: 12px;
    color: gray;
    margin-left: 10px;
  }

  .comment-content {
    font-size: 14px;
    margin-top: 8px;
    word-wrap: break-word;
  }

  .reply {
    color: #1c96ff;
    cursor: pointer;
    margin-top: 8px;
    font-size: 14px;
  }

  .reply-number {
    position: relative;
    left: 70px;
    top: 20px;
  }

  .comment-number {
    position: relative;
    left: 70px;
    top: 20px;
  }

  @keyframes praise-expand {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.25);
    }
    50% {
      transform: scale(1.5);
    }
    75% {
      transform: scale(1);
    }
  }

  .praise-ok {
    -webkit-animation: praise-expand ease 0.5s;
    -o-animation: praise-expand ease 0.5s;
    animation: praise-expand ease 0.5s;
  }

  .discuss-praise {
    font-size: 20px;
    position: relative;
    left: 40px;
    top: 40px;
  }

  .word-prompt span {
    color: orange;
    font-weight: bold
  }

  .cancel-comment {
    margin-right: 5px;
    color: #838b85;
  }

  .cancel-comment:hover {
    color: dodgerblue;
  }

  .reply-discuss {
    margin-top: 5px;

  }

  .discuss-container {
    background-color: white;
    margin-bottom: 20px;
  }

  .text-limit {
    position: absolute;
    margin-left: 695px;
    margin-top: -25px;
  }

  .comment-btn {
    float: right;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .target-user {
    color: dodgerblue;
    cursor: pointer;
  }

  .input-tips {
    position: absolute;
    margin-left: 520px;
    margin-top: -25px;
  }

  .reply-text {
    margin-top: 8px;
    display: inline-block;
  }
</style>
