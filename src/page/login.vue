<template>
  <div>
    <div class="slideshow">
      <div class="slideshow-image" style="background-image: url('../../static/images/shu.jpg')"></div>
      <div class="slideshow-image" style="background-image: url('../../static/images/kafei.jpg')"></div>
      <div class="slideshow-image" style="background-image: url('../../static/images/zihua.jpg')"></div>
      <div class="slideshow-image" style="background-image: url('../../static/images/menghuan.jpg')"></div>
    </div>
    <div class="form-container">
      <div v-show="isLogin" id="login">
        <div slot="title">
          <div class="title">美文</div>
          <div class="describe">登陆美文,记录美好生活</div>
        </div>
        <Input placeholder="请输入手机号或者美文号" id="username" v-model="loginUsername">
             <span slot="prepend">
                <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-yonghu"></use>
                </svg>
             </span>
        </Input>
        <Input placeholder="请输入密码" id="pwd" type="password" v-model="loginPwd">
             <span slot="prepend">
                <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-mima"></use>
                </svg>
             </span>
        </Input>
        <Row>
          <Col :span="14">
            <Input id="verificationCode" placeholder="请输入验证码" v-model="loginVerificationCode">
                <span slot="prepend">
                   <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-yanzhengma"></use>
                  </svg>
                </span>
            </Input>
          </Col>
          <Col :span="10">
            <img :src="verificationCodeImage" class="verificationCodeImage" @click="getVerificationCodeImage"/>
          </Col>
        </Row>
        <a style="float: right;color: blue" href="">忘记密码？</a>
        <Button type="primary" :loading="loginLoading" class="confirm" @click="login">
        <span v-if="loginLoading">
                登陆中...
              </span>
          <span v-else>
                登录
              </span>
        </Button>
        <div class="switch">
          没有账号?
          <span class="switch" @click="changeWay">注册</span>
        </div>
      </div>
      <div id="register" v-show="!isLogin">
        <div slot="title">
          <div class="title">美文</div>
          <div class="describe">注册美文,记录美好生活</div>
        </div>
        <Input placeholder="请输入手机号码" v-model="phone"></Input>
        <Input placeholder="设置登陆密码" type="password" v-model="registerPwd"/>
        <div>
          <Input placeholder="请输入验证码" style="width: 190px;" v-model="registerVerificationCode"/>
          <div class="verification-code-text">{{getVerificationCodeText}}</div>
        </div>
        <Button style="margin-top: 42px;" class="confirm" type="primary" @click="register">注册</Button>
        <div class="switch">已经有账号
          <span @click="changeWay">登陆</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "login",
    data() {
      return {
        isLogin: true,
        loginLoading:false,
        verificationCodeImage: "../../static/images/loadingCode.gif",
        loginUsername: '',
        loginPwd: '',
        loginVerificationCode: '',
        phone: '',
        registerPwd: '',
        registerVerificationCode: '',
        getVerificationCodeText: '获取验证码',
        codeKey: ""
      }
    },
    create() {

    },
    mounted() {
      this.getVerificationCodeImage();
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
      changeWay() {
        this.isLogin = !this.isLogin;
      },
      register() {
        if (this.phone === "") {
          this.$Message.error("请输入手机号");
          return;
        }
        if (this.registerPwd === '"') {
          this.$Message.error("请输入密码");
          return;
        }
        if (this.registerVerificationCode === "") {
          this.$Message.error("请输入验证码");
        }
        let _this = this;
        this.$ajax({
          method: "post",
          url: _this.myBaseUrl.ucenter + "/register.do",
          params: {
            username: this.phone,
            pwd: this.registerPwd,
            code: this.registerVerificationCode
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success("注册成功");
          }
        }).catch((error) => {
        });
      }
      ,
      login() {
        if (this.loginUsername === "") {
          this.$Message.warning('账号不能为空');
          return;
        }
        if (this.loginPwd === "") {
          this.$Message.warning('密码不能为空');
          return;
        }
        if (this.loginVerificationCode === "") {
          this.$Message.warning('验证码不能为空');
          return;
        }
        let _this = this;
        this.loginLoading = true;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/login.do",
          method: "post",
          params: {
            username: this.loginUsername,
            pwd: this.loginPwd,
            key: this.codeKey,
            code: this.loginVerificationCode
          }
        }).then((response) => {
          this.loginLoading = false;
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success('登录成功');
            _this.$store.commit("LOGIN", data.data);
            _this.$router.push("/Home")
          } else {
            _this.getVerificationCodeImage();
          }
        }).catch((error) => {
          this.loginLoading = false;
        })
      }
    }
  }
</script>
<style>
  body {
    background-color: #F6F6F6;
  }
</style>
<style scoped>
  .form-container {
    width: 300px;
    height: 330px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 1111;
    padding: 10px;
    border-radius: 10px;
    background: rgba(5, 5, 5, 0.5);
  }

  .switch {
    text-align: center;
    margin-top: 10px;
    color: #fff7b1;
  }

  .switch span {
    color: blue;
    cursor: Pointer;
  }

  .confirm {
    margin-left: 25px;
    width: 220px;
    margin-top: 25px;
  }

  #login > div, #register > div {
    margin-top: 10px;
  }

  .title {
    text-align: center;
    font-size: 20px;
    color: #fff7b1;
  }

  .describe {
    text-align: center;
    margin-top: 10px;
    color: #fff7b1;
  }

  .verificationCodeImage {
    width: 105px;
    height: 25px;
    margin-top: 4px;
    margin-left: 5px
  }

  .verification-code-text {
    float: right;
    margin-top: 8px;
    color: blue;
    cursor: pointer;
  }
</style>
