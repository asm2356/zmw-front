<template>
  <div>
    <div v-for="(item,index) in collectArticleList" :key="index">
      <Row style="margin-top: 20px">
        <Col :span="5">
          <img v-lazy="item.titlePicture" class="title-picture"
               @click="myGlobal.goToArticleShow(item.articleId)"/>
        </Col>
        <Col :span="19">
          <div style="cursor: pointer;float: left"
               :style="{width:$store.state.account == mwId?'400px':'100%'}">
            <div class="article-title"
                 @click="myGlobal.goToArticleShow(item.articleId)">{{item.title}}
            </div>
            <div style="margin-top: 35px;">
              <img :src="item.userBaseInfo.header"
                   class="user-header"
                   @click="myGlobal.goToPersonCenter(item.mwId)"/>
              <div class="author">
                <span @click="myGlobal.goToPersonCenter(item.mwId)">{{item.userBaseInfo.alias}}</span>
                <span style="margin-left: 10px;">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-z-like"></use>
                    </svg>
                    {{item.articleAttribute.praiseNumber}}
                 </span>
                <span>
                  <svg class="icon" aria-hidden="true" style="font-size: 18px">
                    <use xlink:href="#icon-ico_yueduliang"></use>
                  </svg>
                  {{item.articleAttribute.readingNumber}}
                 </span>
                <span>
                    <svg class="icon" aria-hidden="true" style="font-size: 18px">
                      <use xlink:href="#icon-pinglun"></use>
                    </svg>
                    {{item.articleAttribute.commentNumber}}
                </span>
              </div>
            </div>
          </div>
          <SwitchBtn class="switch-btn"
                     v-show="$store.state.account == mwId"
                     @click.native="switchCollect(item.articleId,index)"
                     :currentValue="item.isCollect" text="收藏">
            <svg slot="icon" class="icon" aria-hidden="true" font-size="20px">
              <use xlink:href="#icon-shoucang-copy"></use>
            </svg>
          </SwitchBtn>
        </Col>
      </Row>
      <Divider/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "collect",
    props: ['mwId', 'sumNum', 'pageNumber'],
    data() {
      return {
        collectArticleList: [],
        pageSize: 5
      }
    },
    mounted() {
      this.getCollectArticleList(0);
    },
    pageNumber: function (newValue, oldValue) {
      this.getCollectArticleList(newValue);
    },
    methods: {
      getCollectArticleList(newValue) {
        let _this = this;
        if (this.collectArticleList.length != 0 && this.collectArticleList.length >= this.sumNum) {
          return;
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getCollectArticleList.do",
          method: "post",
          params: {
            startNum: newValue * _this.pageSize,
            pageSize: _this.pageSize,
            mwId: _this.mwId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < data.data.length; i++) {
              _this.collectArticleList.push(data.data[i]);
              _this.$set(_this.collectArticleList[i], 'isCollect', true);
            }
          }
        }).catch((error) => {
        });
      },
      switchCollect(articleId, index) {
        this.collectArticleList[index].isCollect = !this.collectArticleList[index].isCollect;
        this.myGlobal.switchCollectAjax(articleId, this.collectArticleList[index].isCollect);
      }
    }
  }
</script>

<style scoped>
  .title-picture {
    width: 150px;
    height: 100px;
  }

  .article-title {
    font-size: 18px;
    cursor: pointer;
    font-weight: 600;
    color: #2c2c2c;
    margin-top: 10px;
  }

  .article-title:hover {
    color: dodgerblue;
  }

  .author {
    display: inline;
    margin-left: 5px;
  }

  .author:hover {
    color: dodgerblue;
  }

  .switch-btn {
    float: right;
    margin-top: 25px;
    margin-right: 20px;
  }

  .user-header {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    float: left;
  }
</style>
