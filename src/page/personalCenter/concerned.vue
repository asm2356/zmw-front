<template>
  <div  >
    <Row :key ="index" style="margin-top: 20px" v-for="(item,index) in noticerList">
      <Col :span="3">
        <img :src="item.header" class="noticer-header" @click="myGlobal.goToPersonCenter(item.mwId)"/>
      </Col>
      <Col :span="21" style="margin-top: 10px;">
        <div style="float: left" :style="{width:$store.state.account == mwId?'580px':'100%'}">
          <div class="noticer-alias" @click="myGlobal.goToPersonCenter(item.mwId)">{{item.alias}}</div>
          <div class="noticer-introduction">
            {{item.introduction}}
          </div>
        </div>
        <SwitchBtn :key="index" v-show="$store.state.account == mwId"
                   class="concerned" text="关注"
                   :currentValue="item.isConcerned"
                   @click.native="switchConcerned(item.mwId,index)">
          <svg slot="icon" class="icon" aria-hidden="true" font-size="20px">
            <use xlink:href="#icon-jia"></use>
          </svg>
        </SwitchBtn>
      </Col>
    </Row>
    <Divider/>
  </div>
</template>

<script>
  import SwitchBtn from "../../components/switchBtn";

  export default {
    name: "concerned",
    props: ['mwId', 'sumNum', 'pageNumber'],
    components: {SwitchBtn},
    data() {
      return {
        noticerList: [],
        pageSize: 5
      }
    },
    mounted() {
      this.getNoticerList(0);
    },
    watch: {
      pageNumber: function (newValue, oldValue) {
        this.getNoticerList(newValue);
      }
    },
    methods: {
      switchConcerned(mwId, index) {
        this.noticerList[index].isConcerned = !this.noticerList[index].isConcerned;
        this.myGlobal.switchConcernedAjax(mwId, this.noticerList[index].isConcerned);
      },
      getNoticerList(newValue) {
        let _this = this;
        if (this.noticerList.length != 0 && this.noticerList.length >= this.sumNum) {
          return;
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getNoticerList.do",
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
              _this.noticerList.push(data.data[i]);
              _this.$set(_this.noticerList[i], 'isConcerned', true);
            }
          }
        }).catch((error) => {
        });
      }
    }
  }
</script>

<style scoped>
  .noticer-header {
    width: 100px;
    height: 100px;
    border-radius: 15px;
    padding: 10px;
  }

  .noticer-alias {
    font-size: 18px;
    text-decoration: none;
    cursor: pointer;
    font-weight: 600;
    color: #2c2c2c;
  }

  .noticer-alias:hover {
    color: dodgerblue;
  }

  .noticer-introduction {
    margin-top: 8px;
  }

  .concerned {
    float: right;
    margin-top: 25px;
    margin-right: 20px;
  }
</style>
