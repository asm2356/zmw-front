<template>
  <Modal v-model="childShow">
    <div slot="header">
      <div style="text-align: center">
        <svg class="icon" aria-hidden="true" font-size="24px">
          <use xlink:href="#icon-sixin1"></use>
        </svg>
        <span class="send-letter">&nbsp;发送私信</span>
      </div>
    </div>
    <div>
      <div style="color: black;font-size: 15px" v-if="user==null">
        <Select
          filterable
          remote
          @on-change="changeAutoUserList"
          :remote-method="loadUser"
          :loading="loading">
          <Option v-for="(option, index) in autoShowUserList" :value="option.mwId" :key="index"
                  :label="option.alias">
            <div style="padding: 8px;">
              <div style="display: inline-block">
                <img :src="option.header" style="width: 50px;height: 50px;"/>
              </div>
              <div style="display: inline-block;margin-left: 10px;">
                <div style="font-size: 16px;font-weight: 600;color: #242424">{{option.alias}}({{option.mwId}})</div>
                <div style="margin-top: 8px;">{{option.introduction}}</div>
              </div>
            </div>
          </Option>
        </Select>
      </div>
      <div style="color: black;font-size: 15px" v-if="user!=null">
        <img :src="user.header" style="width: 50px;height: 50px;border-radius: 5px;"/>
        <span style="font-weight: bold;position: relative;top: -20px;margin-left: 10px;">{{user.alias}}</span>
      </div>
      <Input v-model="sendContent" type="textarea" :rows="8" style="margin-top: 10px;" placeholder="请输入信息内容"/>
    </div>
    <div slot="footer">
      <Button type="primary" style="width: 300px;margin-right: 80px" @click="sendLetter">发送</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "searchSendLetter",
    props: {
      isShow: {
        default: false
      },
      user: {
        default: null
      }
    },
    data() {
      return {
        childShow: this.isShow,
        sendContent: '',
        selectUser: '',
        loading: false,
        autoShowUserList: [],
        mwId: ''
      }
    },
    watch: {
      isShow: function (newValue, oldValue) {
        this.childShow = newValue;
      },
      childShow: function (newValue, oldValue) {
        if (newValue == false) {
          this.$emit("closeModal", false);
        }
      }
    },
    methods: {
      changeAutoUserList(result) {
        this.selectUser = result;
      },
      loadUser(query) {
        this.autoShowUserList = [];
        let _this = this;
        this.$ajax({
          url: _this.myBaseUrl.ucenter + "/user/getMatchUserBaseInfoList.do",
          method: "post",
          params: {
            startNum: 0,
            pageSize: 10,
            value: query
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.autoShowUserList.push(data[i])
            }
          }
        }).catch((error) => {
        });
      },
      sendLetter() {
        if (this.user != null) {
          this.mwId = this.user.mwId;
        } else {
          //模糊搜索的mwID
          if (this.selectUser == null || this.selectUser === '') {
            this.$Message.error("请选择要发送到人");
            return;
          } else {
            this.mwId = this.selectUser;
          }
        }
        if (this.sendContent == '') {
          this.$Message.error("请在发送区域填写内容");
        } else {
          let _this = this;
          let params = {
            letterJson: {
              toUserBaseInfo: {
                mwId: this.mwId
              },
              sendTime: new Date().getTime(),
              content: this.sendContent,
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
              _this.$Message.success("发送成功");
              //返回的内容
              _this.$emit("sendLetter", data.data);
            }
          }).catch((error) => {
          })
          this.childShow = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
