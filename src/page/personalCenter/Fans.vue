<template>
  <div>
    <Row style="margin-top: 20px" v-for="(item,index) in fansList" :key="index">
      <Col :span="3">
        <img :src="item.header" class="header" @click="myGlobal.goToPersonCenter(item.mwId)"/>
      </Col>
      <Col :span="21" style="margin-top: 10px;">
        <div style="float: left" :style="{width:$store.state.account == mwId?'580px':'100%'}">
          <div class="alias" @click="myGlobal.goToPersonCenter(item.mwId)">{{item.alias}}</div>
          <div class="introduction">{{item.introduction}}</div>
        </div>
        <SwitchBtn v-show="$store.state.account == mwId"
                   class="concerned"
                   :currentValue="item.isConcerned"
                   text="关注" @click.native="switchConcerned(item.mwId,index)">
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
  export default {
    name: "Fans",
    props: ['mwId', 'sumNum', 'pageNumber'],
    data() {
      return {
        fansList: [],
        pageSize: 5,
        text: '关注'
      }
    },
    mounted() {
      this.getFansList(0);
    }, watch: {
      pageNumber: function (newValue, oldValue) {
        this.getFansList(newValue);
      }
    },
    methods: {
      switchConcerned(mwId,index) {
        this.fansList[index].isConcerned = !this.fansList[index].isConcerned;
        this.myGlobal.switchConcernedAjax(mwId, this.fansList[index].isConcerned );
      },
      getFansList(newValue) {
        let _this = this;
        if (this.fansList.length != 0 && this.fansList.length >= this.sumNum) {
          return;
        }
        this.$ajax({
          url: _this.myBaseUrl.front + "/personCenter/getFansList.do",
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
              _this.fansList.push(data.data[i]);
              _this.$set(_this.fansList[i], 'isConcerned', true);
            }
            // _this.fansStartNum = _this.fansList.length;
          }
        }).catch((error) => {

        });
      }
    }
  }
</script>

<style scoped>
  .header {
    width: 100px;
    height: 100px;
    border-radius: 15px;
    padding: 10px;
  }

  .alias {
    font-size: 18px;
    text-decoration: none;
    cursor: pointer;
    font-weight: 600;
    color: #2c2c2c;
  }

  .alias:hover {
    color: dodgerblue;
  }

  .introduction {
    margin-top: 8px;
  }

  .concerned {
    float: right;
    margin-top: 25px;
    margin-right: 20px;
  }
</style>
