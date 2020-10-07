<template>
  <div>
    <Affix>
      <MyHeader></MyHeader>
    </Affix>
    <div class="main-body">
      <div class="letter-header">
        <div class="recent-contact">最近联系</div>
        <Button style="float: right" type="primary" @click="letterModal=true">写私信</Button>
      </div>
      <div v-for="(item,index) in allLetterList">
        <div style="padding: 10px;height: 80px;">
          <img class="user-header" :src="item.userBaseInfo.header"/>
          <div class="letter-content-list">
            <!--对方发给自己-->
            <div class="letter-title"
                 v-if="item.toUserBaseInfo.mwId==$store.state.account">
              <span class="to-alias" @click="myGlobal.goToPersonCenter(item.userBaseInfo.mwId)">{{item.userBaseInfo.alias}}</span>
              <span>:</span>
            </div>
            <!--自己发给对方的-->
            <div class="letter-title"
                 v-if="item.userBaseInfo.mwId==$store.state.account">
              <span>我发送给</span>
              <span class="to-alias" @click="myGlobal.goToPersonCenter(item.toUserBaseInfo.mwId)">{{item.toUserBaseInfo.alias}}</span>
              <span>:</span>
            </div>
            <div class="letter-content">
              {{item.content}}
            </div>
            <div style="margin-top: 10px;">
              <div class="send-time"> {{item.sendTime | timestampToTime}}</div>
              <span class="letter-operation" @click="deleteLetter(item.id)">
                 删除
              </span>
              <div class="letter-operation"
                   v-if="item.toUserBaseInfo.mwId==$store.state.account">
                <span @click="replyModelShow(item.userBaseInfo)">回复</span>
              </div>
              <div class="letter-operation"
                   v-if="item.userBaseInfo.mwId!=item.toUserBaseInfo.mwId && item.userBaseInfo.mwId==$store.state.account">
                <span @click="replyModelShow(item.toUserBaseInfo)">回复</span>
              </div>
            </div>
          </div>
        </div>
        <Divider/>
      </div>
    </div>
    <send-letter :isShow="letterModal" @closeModal="letterModal=false" @sendLetter="returnLetter"/>
    <send-letter :user="replyUser" :isShow="replyModel" @closeModal="replyModel=false" @sendLetter="returnLetter"/>
  </div>
</template>
<script>
  import sendLetter from "../components/sendLetter";

  export default {
    name: "allLetter",
    components: {sendLetter},
    data() {
      return {
        sendContent: '',
        letterModal: false,
        allLetterList: [],
        pageSize: 5,
        startNum: 0,
        replyModel: false,
        replyUser: null
      }
    },
    mounted() {
      this.loadMore();
      window.addEventListener('scroll', this.scrollMethod);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.scrollMethod);
    },
    methods: {
      deleteLetter(id) {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/chat/deleteLetter.do",
          method: "post",
          params: {
            id: id
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < this.allLetterList.length; i++) {
              if (this.allLetterList[i].id == id) {
                this.allLetterList.delete(i);
                this.$Message.success("删除成功")
              }
            }
          } else {
            this.$Message.error("删除失败");
          }
        }).catch((error) => {
        })
      },
      replyModelShow(user) {
        this.replyModel = true;
        this.replyUser = user;
      },
      returnLetter(value) {
        this.allLetterList.insert(0, value);
      },
      loadMore() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/chat/getLetterList.do",
          method: "post",
          params: {
            startNum: _this.startNum,
            pageSize: _this.pageSize,
            readStatus: this.constant.letterStatus.all,
            bothStatus: true//true 查出双方消息
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.allLetterList.push(data[i]);
            }
            _this.startNum = _this.allLetterList.length;
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
          this.loadMore();
        }
      },
    }
  }
</script>
<style scoped>
  .letter-header {
    padding: 10px;
    border-bottom: 1px solid gray;
    height: 55px;
  }

  .recent-contact {
    font-size: 14px;
    color: black;
    float: left;
    position: relative;
    top: 10px;
  }

  .user-header {
    width: 70px;
    height: 70px;
    float: left;
    border-radius: 6px;
  }

  .letter-content-list {
    position: relative;
    left: 10px;
  }

  .main-body {
    width: 1000px;
  }

  .letter-content {
    margin-top: 20px;
    font-size: 14px;
  }

  .send-time {
    float: left;
    color: #959595;
    font-size: 12px;
  }

  .letter-operation {
    float: right;
    font-size: 13px;
    color: dodgerblue;
    cursor: pointer;
    margin-left: 10px;
  }

  .letter-title span {
    font-size: 17px;
  }

  .to-alias {
    color: dodgerblue;
    cursor: pointer;
    text-decoration: none;
  }

  .to-alias:hover {
    text-decoration: underline;
  }
</style>
