<template>
  <div>
    <div v-for="(item,index) in discussList">
      <div>
        <img :src="item.article.userBaseInfo.header"
             style="width: 50px;height: 50px;vertical-align:middle;border-radius: 50%;"/>
        <span style="line-height: 50px;">{{item.article.userBaseInfo.alias}}</span>
        <span style="float: right">{{item.discuss.discussTime | timestampToTime}}</span>
      </div>
      <div style="margin-left: 50px;">
        <div v-if="item.replyDiscuss==null">
          {{item.discuss.content}}
        </div>
        <div v-if="item.replyDiscuss!=null">
          <!--评论人相互评论-->
          <div v-if="item.replyDiscuss.toContent!=null">
            {{item.replyDiscuss.content}}@
            {{item.replyDiscuss.targetUserBaseInfo.alias}}
            :{{item.replyDiscuss.toContent}}
          </div>
          <!--评论楼主-->
          <div v-if="item.replyDiscuss.toContent==null">
            {{item.replyDiscuss.content}}@
            {{item.discuss.userBaseInfo.alias}}
            :{{item.discuss.content}}
          </div>
        </div>
      </div>
      <Row class="discuss-footer">
        <Col :span="5">
          <img @click="myGlobal.goToArticleShow(item.article.articleId)"
               v-lazy="item.article.titlePicture" class="title-picture"/>
        </Col>
        <Col :span="19">
          <div @click="myGlobal.goToArticleShow(item.article.articleId)"
               class="article-title">{{item.article.title}}
          </div>
          <Row>
            <Col :span="14" style="margin-top: 30px;">
              <div style="cursor: pointer" @click="myGlobal.goToPersonCenter(item.article.userBaseInfo.mwId)">
                <img :src="item.article.userBaseInfo.header"
                     class="user-header"/>
                <div class="author">{{item.article.userBaseInfo.alias}}</div>
              </div>
            </Col>
            <Col :span="5">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-z-like"></use>
              </svg>
              <span>{{item.article.articleAttribute.praiseNumber}}</span>
            </Col>
            <Col :span="5">
              <svg class="icon" aria-hidden="true" style="font-size: 18px">
                <use xlink:href="#icon-ico_yueduliang"></use>
              </svg>
              <span>{{item.article.articleAttribute.readingNumber}}</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider/>
    </div>
  </div>
</template>
<script>
  export default {
    name: "discuss",
    props: ['mwId', 'sumNum', 'pageNumber'],
    data() {
      return {
        discussList: [],
        pageSize: 5
      }
    },
    mounted() {
      this.getDiscussList(0);
    },
    watch: {
      pageNumber: function (newValue, oldValue) {
        this.getDiscussList(newValue);
      }
    },
    methods: {
      getDiscussList(newValue) {
        let _this = this;
        if (this.discussList.length != 0 && this.discussList.length >= this.sumNum) {
          return;
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getDiscussList.do",
          method: "post",
          params: {
            startNum: newValue * _this.pageSize,
            pageSize: _this.pageSize,
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.discussList.push({
                header: data[i].article.userBaseInfo.header,
                alias: data[i].article.userBaseInfo.alias,
                article: data[i].article,
                discuss: data[i].discuss,
                replyDiscuss: data[i].replyDiscuss
              });
            }
          }
        }).catch((error) => {
        });
      }
    }
  }
</script>
<style scoped>
  .user-header {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    float: left;
  }

  .discuss-footer {
    margin-top: 20px;
    padding: 10px;
    background-color: #F5F6F7;
  }

  .title-picture {
    width: 150px;
    height: 100px;
  }

  .author {
    display: inline;
    margin-left: 5px;
  }

  .author:hover {
    color: dodgerblue;
  }

  .article-title {
    margin-top: 10px;
    font-weight: 600;
    color: #242424;
    cursor: pointer;
  }

  .article-title:hover {
    color: dodgerblue;
  }
</style>
