<template>
  <Modal
    width="420"
    :closable="false"
    v-model="articlePwdModal"
    title="密码输入">
    <div>
      <p>文章被作者加密了,输入密码之后才能查看</p>
      <Input placeholder="请输入密码" style="width: 390px;margin-top: 10px;" id="pwd" type="password" v-model="articlePwd">
             <span slot="prepend">
                <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-mima"></use>
                </svg>
             </span>
      </Input>
      <Row style="margin-top: 10px;">
        <Col :span="17">
          <Input id="verificationCode" placeholder="请输入验证码" v-model="verificationCode">
                <span slot="prepend">
                   <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-yanzhengma"></use>
                  </svg>
                </span>
          </Input>
        </Col>
        <Col :span="7">
          <img :src="verificationCodeImage" class="verificationCodeImage" @click="getVerificationCodeImage"/>
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button size="large" long type="primary" @click="getArticleByPwd">确定</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "articlePwd",
    prop: ['articleId'],
    data() {
      return {
        articlePwd: '',
        verificationCode: '',
        articleId: this.$route.query.articleId,
        codeKey: '',
        verificationCodeImage: "../../static/images/loadingCode.gif",
        articlePwdModal: false
      }
    },
    methods: {
      getVerificationCodeImage() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/getVerificationCode.do",
          method: "post",
          responseType: 'arraybuffer',
          param: {}
        }).then((response) => {
          _this.verificationCodeImage = 'data:image/png;base64,' + btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          _this.codeKey = response.headers.key;
        }).catch((error) => {
        });
      },
      getArticleByPwd() {
        let _this = this;
        if (this.articlePwd == '') {
          this.$Message.error("文章密码不能为空");
          return;
        }
        if (this.verificationCode == '') {
          this.$Message.error("验证码不能为空");
          return;
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/getArticleByPwd.do",
          method: "post",
          params: {
            articleId: _this.articleId,
            pwd: _this.articlePwd,
            key: _this.codeKey,
            code: _this.verificationCode
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.article = data.data;
            _this.$Message.success("验证通过");
            _this.$emit("getArticleContent", data.data);
            _this.articlePwdModal = false;
          } else {
            _this.getVerificationCodeImage();
            _this.articlePwd = '';
            _this.verificationCode = '';
          }
        }).catch((error) => {
          _this.$router.push({
            name: "notFound"
          });
        });
      },
      getArticle() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.front + "/articleShow/getArticle.do",
          method: "post",
          params: {
            articleId: _this.articleId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$emit("getArticleContent", data.data);
            _this.articlePwdModal = false;
          } else if (data.code === 10023) {
            _this.$router.push({
              name: "notOpenArticle"
            });
          } else if (data.code === 10024) {
            _this.getVerificationCodeImage();
            _this.articlePwdModal = true;
          } else if (data.code === 10022) {
            _this.$router.push({
              name: "notFound"
            });
          }
        }).catch((error) => {
          _this.$router.push({
            name: "notFound"
          });
        });
      }
    }, mounted() {
      this.getArticle();
    }
  }
</script>

<style scoped>
  .verificationCodeImage {
    width: 105px;
    height: 25px;
    margin-top: 4px;
    margin-left: 5px;
  }
</style>
