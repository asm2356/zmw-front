<template>
  <div>
    <div v-for="(item,index) in articleList" :key="index">
      <div style="margin-top: 20px">
        <div style="float: left">
          <img :src="item.titlePicture" class="title-picture"
               @click="myGlobal.goToArticleShow(item.articleId)"/>
        </div>
        <div style="float: left">
          <div class="article-title"
               @click="myGlobal.goToArticleShow(item.articleId)">
            {{item.title}}
          </div>
          <div style="margin-top: 40px;">
            <span class="article-category">{{item.articleAttribute.categoryName}}</span>
            <span class="article-release-time">{{item.articleAttribute.releaseTime | timestampToTime}}</span>
          </div>
        </div>
        <div style="margin-left:800px;">
          <Dropdown trigger="click" style="margin-left: 20px;top:30px;" v-if="$store.state.account==mwId"
                    @on-click="changeDropdown($event,item.articleId)">
            <a href="javascript:void(0)">
              <svg class="icon" aria-hidden="true" style="font-size: 22px;">
                <use xlink:href="#icon-caidan"></use>
              </svg>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="delete">删除</DropdownItem>
              <DropdownItem name="settingOpenness">设置公开度</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div style="float: right;margin-top: 55px;margin-right: 15px">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-z-like"></use>
          </svg>
          <span>{{item.articleAttribute.praiseNumber}}</span>
          <svg class="icon" aria-hidden="true" style="font-size: 18px;margin-left: 10px;">
            <use xlink:href="#icon-ico_yueduliang"></use>
          </svg>
          <span>{{item.articleAttribute.readingNumber}}</span>
          <svg class="icon" aria-hidden="true" style="font-size: 18px;margin-left: 10px;">
            <use xlink:href="#icon-pinglun"></use>
          </svg>
          <span>{{item.articleAttribute.commentNumber}}</span>
        </div>
      </div>
      <Divider/>
    </div>
    <Modal
      v-model="opennessSetting"
      title="公开度设置"
      width="200"
      @on-ok="opennessSure">
      <RadioGroup class="openness-radio-group" v-model="currentOpenness">
        <Radio label="1" style="display: block">
          <span>公开</span>
        </Radio>
        <Radio label="3" style="display: block">
          <span>加密</span>
          <Input v-model="articlePwd" size="small" style="width: 110px" placeholder="请输入密码"/>
        </Radio>
        <Radio label="2" style="display: block">
          <span>私密</span>
        </Radio>
      </RadioGroup>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "personalArticle",
    props: ['mwId', 'sumNum', 'pageNumber', 'currentCustomTheme'],
    data() {
      return {
        articleList: [],
        pageSize: 5,
        currentOpenness: 1,
        articlePwd: '',
        currentSetArticleId: 0,//当前设置公开度文章的id
        opennessSetting: false
      }
    },
    mounted() {
      this.getArticleList();
    },
    methods: {
      getArticleList() {
        let _this = this;
        if (this.articleList.length != 0 && this.articleList.length >= this.sumNum) {
          return;
        }
        let params = {
          mwId: _this.mwId,
          startNum: _this.pageNumber * _this.pageSize,
          pageSize: _this.pageSize,
          customTheme: _this.currentCustomTheme
        };
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getArticleList.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < data.data.length; i++) {
              _this.articleList.push(data.data[i]);
            }
          }
        }).catch((error) => {
        });
      }, //文章下拉列表设置
      opennessSure() {
        let _this = this;
        if (this.currentOpenness == null) {
          this.currentOpenness = 1;
        }
        if (this.currentOpenness != 3) {
          this.articlePwd = null;
        }
        if (this.currentOpenness == 3) {
          if (this.articlePwd == '' || this.articlePwd == null) {
            this.$Message.info("请输入加密文章密码");
            return;
          }
          if (this.articlePwd.length > 18) {
            this.$Message.info("密码长度过长");
            return;
          }
        }
        let params = {
          articleId: this.currentSetArticleId,
          openness: this.currentOpenness,
          pwd: this.articlePwd
        };
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/changeArticleOpenness.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {

          }
        }).catch((error) => {

        })
      },
      changeDropdown(name, articleId) {
        let _this = this;
        if (name == 'delete') {
          this.$Modal.confirm({
            title: "删除文章",
            content: "您确认要永久删除文章吗?",
            onOk: function () {
              _this.$ajax({
                url: _this.myBaseUrl.front + "/personCenter/deleteArticle.do",
                method: "post",
                params: {
                  articleId: articleId
                }
              }).then((response) => {
                let data = response.data;
                if (data.code === 1) {
                  for (let i = 0; i < _this.articleList.length; i++) {
                    if (_this.articleList[i].articleId == articleId) {
                      _this.articleList.delete(i);
                      break;
                    }
                  }
                  _this.$emit("deleteArticle");
                  _this.$Message.info("删除成功");
                }
              }).catch((error) => {
              })
            }
          })
        } else if (name == 'settingOpenness') {
          _this.opennessSetting = true;
          _this.currentSetArticleId = articleId;
        }
      }
    },
    watch: {
      pageNumber: function (newValue, oldValue) {
        this.getArticleList();
      },
      currentCustomTheme:function (newValue, oldValue) {
        this.articleList =[];
        this.getArticleList();
      }
    }
  }
</script>

<style scoped>

  .title-picture {
    width: 150px;
    height: 100px;
    border-radius: 5px;
  }

  .article-title {
    margin-top: 10px;
    font-weight: 600;
    color: #242424;
    cursor: pointer;
    margin-left: 20px;
  }

  .article-title:hover {
    color: dodgerblue;
  }

  .article-category {
    margin-left: 20px;
  }

  .article-release-time {
    margin-left: 10px;
  }

  .article {
    background-color: white;
    border: 2px;
  }

  .article:hover {
    background-color: #eaeaea;
  }
</style>
