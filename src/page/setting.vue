<template>
  <div>
    <Affix>
      <MyHeader></MyHeader>
    </Affix>
    <div class="main-body">
      <div class="menu">
        <Menu active-name="1" style="height: 550px;" @on-select="onMenuSelect">
          <MenuItem name="1">
            <svg class="icon" aria-hidden="true" style="font-size: 30px;color: white">
              <use xlink:href="#icon-yonghu-tianchong"></use>
            </svg>
            账户密码
          </MenuItem>
          <MenuItem name="2">
            <svg class="icon" aria-hidden="true" style="font-size: 30px;color: white">
              <use xlink:href="#icon-gerenxinxi"></use>
            </svg>
            个人信息
          </MenuItem>
        </Menu>
      </div>
      <div class="main-content">
        <div v-if="currentMenu==1">
          <div>账号xxx</div>
          <Form label-position="right" class="account-menu" :label-width="100">
            <FormItem label="原密码">
              <Input v-model="originalPwd" type="password"/>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="newPwd" type="password"/>
            </FormItem>
            <FormItem label="再次输入密码">
              <Input v-model="againPwd" type="password"/>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="updatePwd">确认修改</Button>
              <Button style="margin-left: 8px" @click="resetPwdInfo">重置</Button>
            </FormItem>
          </Form>
        </div>
        <div v-else-if="currentMenu==2">
          <Form label-position="right" class="person-info" :label-width="100">
            <FormItem label="用户名">
              <Input v-model="userBaseInfo.alias" type="text"></Input>
            </FormItem>
            <FormItem label="Radio">
              <RadioGroup v-model="userBaseInfo.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
                <Radio label="未知">未知</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="微信号">
              <Input v-model="userBaseInfo.wechat" type="text"></Input>
            </FormItem>
            <FormItem label="DatePicker">
              <DatePicker @on-change="changeBirthday"
                          v-model="userBaseInfo.birthday"
                          type="date"
                          placeholder="请选择生日"></DatePicker>
            </FormItem>
            <FormItem label="个人介绍">
              <Input v-model="userBaseInfo.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                     placeholder="请输入...."></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="updatePersonInfo">确认修改</Button>
              <Button style="margin-left: 8px" @click="resetPersonInfo">重置</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import MyHeader from '@/components/myHeader'
  export default {
    name: "setting",
    components: {MyHeader},
    data() {
      return {
        currentMenu: 1,
        originalPwd: '',
        newPwd: '',
        againPwd: '',
        userBaseInfo: ''
      }
    },
    mounted() {
      this.getPersonInfo();
    },
    methods: {
      changeBirthday(e) {
        this.userBaseInfo.birthday = e;
      },
      onMenuSelect(index) {
        this.currentMenu = index;
      },
      updatePwd() {
        if (this.originalPwd == '') {
          this.$Message.error("请输入原来的密码");
          return;
        }
        if (this.newPwd == '' || this.againPwd == '') {
          this.$Message.error("请输入新密码");
          return;
        }
        if (this.newPwd != this.againPwd) {
          this.$Message.error("两次密码输入不一致请重新输入");
          this.newPwd = "";
          this.againPwd = '';
          return;
        }
        let _this = this;
        _this.$ajax({
          url: _this.myBaseUrl.ucenter + "/changePwd.do",
          method: "post",
          params: {
            originalPwd: _this.originalPwd,
            newPwd: _this.againPwd
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$ajax({
              url: _this.myBaseUrl.ucenter + "/loginOut.do",
              method: "post",
              params: {}
            }).then((loginOut) => {
              data = loginOut.data;
              if (data.code === 1) {
                this.$Message.error("正在退出...");
                setTimeout(() => {
                  _this.$store.state.account = false;
                  _this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              }
            })
          } else {
            _this.$Message.error("修改失败");
          }
        }).then((error) => {
        });
      },
      resetPwdInfo() {
        this.originalPwd = '';
        this.newPwd = '';
        this.againPwd = '';
      },
      updatePersonInfo() {
        let _this = this;
        if (this.userBaseInfo.alias == '') {
          this.$Message.info("用户名不能为空");
          return;
        }
        // 时间转化
        let date = new Date(this.userBaseInfo.birthday);
        let strTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        this.userBaseInfo.birthday = strTime;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/user/changeUserBaseInfo.do",
          method: "post",
          params: {
            userBaseInfoJson: JSON.stringify(_this.userBaseInfo)
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            this.$Message.success("修改成功");
          }
        }).catch((error) => {
        });
      },
      resetPersonInfo() {
        this.userBaseInfo.alias = '';
        this.userBaseInfo.birthday = '';
        this.userBaseInfo.wechat = '';
        this.userBaseInfo.introduction = '';
      },
      getPersonInfo() {
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/user/getUserBaseInfo.do",
          method: "post",
          params: {
            mwId:_this.$store.state.account
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.userBaseInfo = data.data;
          }
        }).catch((error) => {
        });
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
  .main-body {
    width: 800px;
    margin-top: 20px;
  }

  .menu {
    width: 200px;
    float: left;
  }

  .main-content {
    width: 600px;
    height: 550px;
    float: left;
    background-color: white;
  }

  .account-menu {
    width: 400px;
    margin: 0 auto;
    margin-top: 40px;
  }

  .person-info {
    width: 500px;
    margin: 0 auto;
    margin-top: 40px;
  }
</style>
