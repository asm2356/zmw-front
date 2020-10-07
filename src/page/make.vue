<template>
  <div>
    <Affix>
      <div class="header">
        <Row>
          <Col :span="2">&nbsp;</Col>
          <Col :span="20">
            <div class="header-write-article"><p>写文章</p></div>
            <div class="header-person">
              <Button @click="drawer=true">操作</Button>
              <Badge>
                <Poptip style="margin-left: 36px" placement="bottom">
                  <Avatar shape="square" icon="ios-person"/>
                  <CellGroup slot="content">
                    <Cell>
                      <div @click="myGlobal.goToPersonCenter($store.state.account)">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-yonghu-tianchong"></use>
                        </svg>
                        <span>我的主页</span>
                      </div>
                    </Cell>
                    <Cell>
                      <div @click="$router.push('/setting')">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-ai-set"></use>
                        </svg>
                        <span>设置</span>
                      </div>
                    </Cell>
                    <Cell>
                      <div>
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-app_icons--"></use>
                        </svg>
                        <span @click="loginOut">退出</span>
                      </div>
                    </Cell>
                  </CellGroup>
                </Poptip>
              </Badge>
            </div>
          </Col>
          <Col :span="2">&nbsp;</Col>
        </Row>
      </div>
    </Affix>
    <div style="display: none" id="temp"></div>
    <div class="make-main-body">
      <div>
        <label v-show="coverImgVar==''">
          <Icon class="upload-icon" type="ios-cloud-upload" size="100"/>
          <div class="upload-icon-text">上传封面</div>
          <input type="file" style="opacity: 0;" id="coverImgId" @change="coverImgChange"/>
        </label>
        <img :src="coverImgVar" @click="coverImgClick" style="width: 100%"/>
      </div>
      <Card>
        <Input v-model="articleTitle" placeholder="请输入标题,不能超过50字"/>
        <div style="margin-top: 20px;">
          <Row>
            <Col :span="6">
              <div id="abbr-list" class="abbr-list">
                <div class="abbr" v-for="(item,index) in abbrShowList" :key="index">
                  <div class="abbr-content"
                       @click="abbrBtn(index)"
                       :style="{'border':activeAbbr===index?'2px solid #E16412':'2px solid slategray'}" v-html="item">
                  </div>
                  <div class="abbr-btn">
                    <div class="abbr-btn-delete" @click="deleteAbbr(index)">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                      </svg>
                    </div>
                    <div class="abbr-btn-add" @click="addAbbr(index)">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-tianjia"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span="18">
              <div style="margin-left: 5px;">
                <span>
                  <input type="file" name="multipartMusic" id="multipartMusic" class="music-input"
                         @change="insertMusic($event)"/>
                  <svg class="icon " style="margin-bottom: -22px;font-size: 20px" aria-hidden="true">
                    <use xlink:href="#icon-yinyue"></use>
                  </svg>
                </span>
              </div>
              <div style="margin-left:690px">
                <span>
                  <input type="file" name="multipartImg" id="multipartImg" class="input-img"
                         @change="insertImg($event)"/>
                  <svg class="icon new-icon" aria-hidden="true">
                    <use xlink:href="#icon-photo"></use>
                  </svg>
                </span>
                <span>
                  <input type="file" name="multipartVideo" id="multipartVideo" multiple="multiple" class="input-video"
                         @change="insertVideo($event)"/>
                  <svg class="icon new-icon" aria-hidden="true">
                    <use xlink:href="#icon-shipin"></use>
                  </svg>
                </span>
              </div>
              <textarea id="editor" autofocus></textarea>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
    <Drawer title="操作" width="360" :closable="false" v-model="drawer">
      <!--<Card>-->
      <!--<p slot="title">-->
      <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-daima"></use>-->
      <!--</svg>-->
      <!--代码插入-->
      <!--</p>-->
      <!--<Input type="textarea" placeholder="css代码">插入css代码</Input>-->
      <!--<Divider/>-->
      <!--<Input type="textarea" placeholder="js或JQuery代码">插入js代码</Input>-->
      <!--</Card>-->
      <!--<Card>-->
      <!--<p slot="title">-->
      <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-yangshi"></use>-->
      <!--</svg>-->
      <!--样式-->
      <!--</p>-->
      <!--</Card>-->
      <Card>
        <p slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fabu"></use>
          </svg>
          <span>标签</span>
        </p>
        <Row>
          <Col :span="14">
            <Select v-model="customThemeName" clearable>
              <Option v-for="item in tagList" :value="item.customThemeName" :key="item.id">{{ item.customThemeName
                }}
              </Option>
            </Select>
          </Col>
          <Col :span="5">
            <Button style="margin-left: 5px;" @click="showCustomTag=!showCustomTag">新建</Button>
          </Col>
          <Col :span="5">
            <Button style="margin-left: 5px;" @click="deleteTag">删除</Button>
          </Col>
        </Row>
        <transition name="create-tag">
          <div style="margin-top: 10px;height: 70px" v-show="showCustomTag">
            <Input v-model="newCustomTagName"></Input>
            <div style="float: right;margin-top: 5px;">
              <Button type="primary" @click="createNewTag">确认</Button>
              <Button @click="showCustomTag=!showCustomTag">取消</Button>
            </div>
          </div>
        </transition>
      </Card>
      <Card style="margin-top: 20px;">
        <p slot="title">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fabu"></use>
          </svg>
          发布
        </p>
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongkai"></use>
          </svg>
          公开度:<span class="current-openness">{{currentOpenness}}</span>
          <Button size="small" type="text" v-show="!showOpenness"
                  @click="showOpenness=!showOpenness">修改
          </Button>
          <transition name="openness-con">
            <div v-show="showOpenness" style="height: 130px;">
              <RadioGroup class="openness-radio-group" v-model="currentOpenness">
                <Radio label="公开">
                  <span>公开</span>
                </Radio>
                <Radio label="加密">
                  <span>加密</span>
                  <Input v-model="articlePwd" size="small" style="width: 110px" placeholder="请输入密码"/>
                </Radio>
                <Radio label="私密">
                  <span>私密</span>
                </Radio>
              </RadioGroup>
              <div style="margin-left: 40px">
                <Button type="primary" @click="opennessConfirm">确认</Button>
                <Button @click="showOpenness=!showOpenness">取消</Button>
              </div>
            </div>
          </transition>
        </div>
        <div style="margin-top:8px">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-riqi"></use>
          </svg>
          <span>发布时间</span>
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" confirm placeholder="请选择发布时间"
                      style="width: 155px;"
                      @on-change="changeReleaseTime"
          ></DatePicker>
        </div>
        <div style="margin-top: 10px;">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-leibie"></use>
          </svg>
          <label title="首页的类别">类别</label>
          <Select v-model="categoryName" style="width: 100px;">
            <Option v-for="(item,index) in categoryList" :value="item" :key="index">{{item}}</Option>
          </Select>
        </div>
        <div style="margin-top: 8px">
          <Button @click="preview">预览</Button>
          <Button type="primary" @click="releaseArticle">发布</Button>
        </div>
      </Card>
    </Drawer>
  </div>
</template>
<script>
  export default {
    name: "make",
    data() {
      return {
        articleTitle: '',//文章标题
        drawer: false,
        openness: '公开',
        showOpenness: false,
        showCustomTag: false,
        currentOpenness: '公开',
        articlePwd: null,//文章密码
        categoryName: this.constant.categoryList[1],
        categoryList: this.constant.categoryList,//类别列表
        previewArticle: false,
        newCustomTagName: '',//新建的标签名,
        customThemeName: '',//当前选择的标签名
        tagList: [],
        editor: null,
        abbrShowList: [''],//显示的缩略图列表
        activeAbbr: 0,
        coverImgVar: "",
        releaseTime: -1,
        simditorTxt: ''
      }
    },
    methods: {
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
          }
        }).catch((error) => {
        })

      },
      getCustomThemeList() {
        let _this = this;
        this.tagList = [];
        this.$ajax({
          url: _this.myBaseUrl.front + "/make/getCustomThemeList.do",
          method: "post",
          param: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < data.data.length; i++) {
              _this.tagList.push(data.data[i]);
            }
          }
        }).catch((error) => {
        })
      },
      coverImgClick() {
        document.getElementById("coverImgId").click();
      },
      coverImgChange() {
        let file = document.getElementById("coverImgId").files[0];
        let _this = this;
        if (!this.myGlobal.imageIsCorrect(file)) {
          return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
          _this.coverImgVar = e.target.result;
        };
      },
      handleHtml() {
        let title = "<div style='font-size: 25px;text-align: left;color: black;margin-bottom: 5px;'>" + this.articleTitle + "</div>";
        let html = title;
        for (let temp of this.abbrShowList) {
          html += temp;
        }
        return html;
      },
      preview() {

        localStorage.content = this.handleHtml();
        const {href} = this.$router.resolve({
          name: 'previewArticle'
        });
        window.open(href, '_blank', 'toolbar=yes, width=900')
      },
      opennessConfirm() {
        this.showOpenness = false;
      },
      changeReleaseTime(e) {
        this.releaseTime = this.myUtils.timeToTimestamp(e);
      },
      getUserCustomThemeList() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/make/getUserCustomThemeList.do",
          method: "post",
          params: {}
        }).then((response) => {
          let data = response.data;
        }).catch((error) => {
        })
      },
      createNewTag() {
        if (this.newCustomTagName.length !== 0) {
          for (let i = 0; i < this.tagList.length; i++) {
            if (this.tagList[i].customThemeName == this.newCustomTagName) {
              this.$Message.error("该标签已经存在了");
              return;
            }
          }
          this.showCustomTag = !this.showCustomTag;
          let _this = this;
          this.$ajax({
            url: _this.myBaseUrl.front + "/make/createCustomTheme.do",
            method: "post",
            params: {
              customThemeName: _this.newCustomTagName
            }
          }).then((response) => {
            let data = response.data;
            if (data.code === 1) {
              _this.tagList.push({
                customThemeName: _this.newCustomTagName,
                mwId: data.data
              });
            }
          }).catch((error) => {

          });
        } else {
          this.$Message.error('请输入标签名');
        }
      },
      deleteTag() {
        let _this = this;
        let id = 0;
        for (let i = 0; i < this.tagList.length; i++) {
          if (_this.tagList[i].customThemeName == _this.customThemeName) {
            id = _this.tagList[i].id;
            break;
          }
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/make/deleteCustomTheme.do",
          method: "post",
          params: {
            id: id
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < _this.tagList.length; i++) {
              if (_this.tagList[i].customThemeName == _this.customThemeName) {
                _this.tagList.delete(i);
                break;
              }
            }
          }
        }).catch((error) => {

        });
      },
      uploadFile(file) {
        this.$Loading.start();
        return new Promise((resolve, reject) => {
          let formData = new FormData();
          formData.append("file", file);
          this.$ajax({
            url: this.myBaseUrl.front + "/make/uploadFile.do",
            method: "post",
            headers: {'Content-Type': 'multipart/form-data'},
            data: formData
          }).then((response) => {
            let data = response.data;
            if (data.code === 1) {
              this.$Loading.finish();
              resolve(data.data);
            } else {
              this.$Loading.error();
            }
          }).catch((error) => {
            this.$Loading.error();
            reject(error)
          })
        });
      },
      deleteFile(url) {
        this.$ajax({
          url: this.myBaseUrl.front + "/make/deleteFile.do",
          method: "post",
          params: {
            url: url
          }
        }).then((response) => {
        }).catch((error) => {
        })
      },
      insertMusic(e) {
        let file = e.target.files[0];
        if (!this.myGlobal.musicIsCorrect(file)) {
          return
        }
        let oldMusicUrl = this.myUtils.getStore("musicUrl");
        if (oldMusicUrl != null) {
          this.deleteFile(oldMusicUrl);
        }
        this.uploadFile(file).then((response) => {
          this.myUtils.setStore("musicUrl", response);
          this.saveContent();
        }).catch((error) => {
        });
      },
      deleteSrc() {
        let src = $($(".simditor-body").html()).attr("src");
        if (src != undefined) {
          this.deleteFile(src);
        }
      },
      insertImg(e) {
        this.deleteSrc();
        let file = e.target.files[0];
        if (!this.myGlobal.imageIsCorrect(file)) {
          return
        }
        this.uploadFile(file).then((data) => {
          let currentHtml = $(".simditor-body").html();
          $(".simditor-body").html(currentHtml + "<img style='width: 100%;height: 100%;margin-top: 15px;' src='" + data + "'>");
          this.saveContent();
        }).catch((error) => {
        });
      },
      insertVideo(e) {
        this.deleteSrc();
        let file = e.target.files[0];
        if (!this.myGlobal.videoIsCorrect(file)) {
          return;
        }
        this.uploadFile(file).then((data) => {
          let video = "<div style='text-align: center'><video src='" + data + "' style='height: 600px%;display: inline-block' controls=\"controls\">" + "</video></div>";
          $(".simditor-body").html(video);
          this.saveContent();
        }).catch((error) => {
        });
      },
      //保存编辑器内容
      saveContent() {
        this.$set(this.abbrShowList, this.activeAbbr, $(".simditor-body").html());
      },
      //初始化编辑器
      initSimditor() {
        let _this = this;
        Simditor.locale = 'zh-CN';
        this.editor = new Simditor({
          textarea: $('#editor'),
          toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', '|', 'link', 'hr', '|', 'indent', 'outdent', 'alignment']
        });
        this.editor.on("valuechanged", function () {
          _this.saveContent();//自动保存文本
          //处理图片和文本样式丢失问题
          $(".simditor-body img").css("width", "100%");
        });
      },
      //添加缩略图
      addAbbr(index) {
        this.abbrShowList.insert(index + 1, '');
        this.activeAbbr++;
      },
      //删除缩略图
      deleteAbbr(index) {
        this.$Modal.confirm({
          title: "警告",
          content: "您确认要永久删除该页",
          okText: "确认删除",
          cancelText: "取消",
          onOk: () => {
            let html = this.abbrShowList[index];
            let url = $(html).attr("src");
            if (url != null) {
              this.deleteFile(url);
            }
            this.abbrShowList.delete(index);
            //改变活动缩略图
            this.activeAbbr = index;
            if (index === 0) {
              this.addAbbr(0);
            }
          }
        });
      },
      //点击缩略图
      abbrBtn(index) {
        this.activeAbbr = index;
        $(".simditor-body").html(this.abbrShowList[index]);
      },
      //发布文章
      releaseArticle() {
        let _this = this;
        if (document.getElementById("coverImgId").files[0] == null) {
          this.$Message.error("请选择文章封面图片");
          return;
        }
        if (this.articleTitle == "") {
          this.$Message.error("请输入文章标题");
          return;
        }
        let formData = new FormData();
        let articleAttribute = {};
        if (this.currentOpenness == '公开') {
          articleAttribute.openness = 1;
        } else if (this.currentOpenness == '加密') {
          articleAttribute.openness = 3;
          articleAttribute.pwd = this.articlePwd;
        } else {
          articleAttribute.openness = 2;
        }
        if (this.releaseTime < 1000) {
          this.releaseTime = new Date().getTime();
        }
        articleAttribute.releaseTime = this.releaseTime;
        articleAttribute.categoryName = this.categoryName;
        for (let i = 0; i < _this.tagList.length; i++) {
          if (_this.tagList[i].customThemeName == _this.customThemeName) {
            articleAttribute.customTheme = {
              id: _this.tagList[i].id
            };
            break;
          }
        }
        let file = document.getElementById("coverImgId").files[0];
        formData.append("coverImg", file);
        if (this.myUtils.getStore("musicUrl") != null) {
          formData.append("music", this.myUtils.getStore("musicUrl"));
        }
        formData.append("articleTitle", this.articleTitle);
        formData.append("articleAttributeJson", JSON.stringify(articleAttribute));
        formData.append("contentList", this.handleHtml());
        this.$ajax({
          url: _this.myBaseUrl.front + "/make/uploadArticle.do",
          method: "post",
          headers: {'Content-Type': 'multipart/form-data'},
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success("发布成功");
            _this.getCustomThemeList();
            _this.myUtils.removeStore("musicUrl")
            _this.myUtils.removeStore("content");
            $(".simditor-body").html("");
            _this.initData();
          }
        }).catch((error) => {
        })
      },
      initData() {
        this.articleTitle = '';
        this.drawer = false;
        this.tagList = [];
        this.editor = null;
        this.abbrShowList = [''];
        this.activeAbbr = 0;
        this.coverImgVar = "";
        this.releaseTime = -1;
        this.simditorTxt = '';
      }
    },
    mounted() {
      this.categoryList.delete(0);//删除全部类别
      this.initSimditor();
      this.getCustomThemeList();
    }
  }
</script>
<style scoped>
  body {
    background-color: #F6F6F6;
  }

  .simditor-body {
    height: 500px !important;
  }

  .music-input {
    opacity: 0;
    position: absolute;
    width: 45px;
    top: 15px;
  }

  .header {
    background-color: white;
    height: 50px
  }

  .header-person {
    float: right;
    margin-right: 10px;
    margin-top: 10px
  }

  .header-write-article {
    float: left;
    line-height: 50px
  }

  .make-main-body {
    width: 1100px;
    margin: 0 auto;
    margin-top: 13px
  }

  .upload-icon {
    color: #3399ff;
    position: relative;
    left: 500px;
  }

  .upload-icon-text {
    color: #3399ff;
    position: relative;
    font-size: 20px;
    left: 510px;
    cursor: pointer;
  }

  .openness-con-enter-active {
    transition: all .3s ease;
  }

  .openness-con-leave-active {
    transition: all .5s linear;
  }

  .openness-con-enter, .openness-con-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  .release-time-enter-active {
    transition: all .3s ease;
  }

  .release-time-leave-active {
    transition: all .5s linear;
  }

  .release-time-enter, .release-time-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  .create-tag-enter-active {
    transition: all .3s linear;
  }

  .create-tag-leave-active {
    transition: all .3s linear;
  }

  .create-tag-enter-to {
    height: 70px;
  }

  .create-tag-leave {
    height: 70px;
  }

  .create-tag-leave-to {
    height: 0;
  }

  .openness-radio-group {
    margin-left: 40px;
    border-left: 1px dashed #ebe9f3;
    padding: 10px
  }

  .block {

  }

  .block > div {
    width: 85%;
    height: 130px;
    margin: 0 auto;
    margin-top: 10px;
  }

  .block > div img {
    width: 130px;
    height: 130px;
  }

  .block > div:nth-child(1) {
    background-color: #e13d13;
  }

  .block > div:nth-child(2) {
    background-color: darkgoldenrod;
  }

  .block > div:nth-child(3) {
    background-color: darkgreen;
  }

  .block > div:nth-child(4) {
    background-color: blueviolet;
  }

  .block > div:nth-child(5) {
    background-color: dodgerblue;
  }

  .abbr-list {
    overflow: scroll;
    height: 550px;
  }

  .abbr-content {
    margin: 0 auto;
    height: 180px;
    margin-top: 5px;
    overflow: hidden;
  }

  .abbr-btn {
    height: 35px;
    width: 100%;
    margin-top: -25px;
    opacity: 0;
    transition: all 0.5s;
    -moz-transition: all 0.5s; /* Firefox 4 */
    -webkit-transition: all 0.5s; /* Safari 和 Chrome */
    -o-transition: all 0.5s;
  }

  .abbr:hover .abbr-btn {
    opacity: 1;
  }

  .abbr-btn-add {
    font-size: 35px;
    display: inline-block;
  }

  .abbr-btn-delete {
    font-size: 35px;
    display: inline-block;
    margin-left: 140px;
  }

  .new-icon {
    font-size: 25px;
    margin-bottom: -2px;
    display: inline;
    margin-left: 15px;
  }

  .input-img {
    opacity: 0;
    position: absolute;
    width: 45px;
  }

  .input-video {
    opacity: 0;
    position: absolute;
    width: 45px;
  }

  .current-openness {
    font-weight: bold;
    color: black;
    font-size: 13px;
  }
</style>
