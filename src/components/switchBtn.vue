<template>
  <div>
    <Button :style="{backgroundColor:concernedBtnBackground,borderColor:concernedBtnBorder}" size="large"
            type="primary" style="width: 100px;" >
      <div v-show="!isConcerned">
        <slot name="icon">
        </slot>
        {{text}}
        <slot>
        </slot>
      </div>
      <div v-show="isConcerned" @mouseenter="mouseEnterMethod"
           @mouseleave="mouseLeaveMethod">
        {{concernedBtnContent}}
      </div>
    </Button>
  </div>
</template>

<script>
  export default {
    name: "SwitchBtn",
    props: ['currentValue', 'text'],
    data() {
      return {
        concernedBtnBackground: null,
        concernedBtnBorder: null,
        isConcerned: this.currentValue,
        concernedBtnContent: null
      }
    },
    watch: {
      currentValue: function (newValue, oldValue) {
        this.isConcerned = newValue;
        this.changeBtn();
      }
    },
    mounted(){
      this.changeBtn();
    },
    methods: {
      mouseLeaveMethod() {
        this.concernedBtnContent = '已' + this.text;
      },
      mouseEnterMethod() {
        this.concernedBtnContent = '取消' + this.text;
      },
      changeBtn() {
        if (this.isConcerned) {
          this.concernedBtnBackground = "#c5c8ce"
          this.concernedBtnBorder = "#c5c8ce";
          this.concernedBtnContent = "已" + this.text;
        } else {
          this.concernedBtnBackground = "#2d8cf0"
        }
      }
    }
  }
</script>

<style scoped>

</style>
