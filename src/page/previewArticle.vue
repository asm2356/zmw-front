<template>
  <div style="width: 850px;margin: 0 auto">
    <div>
      <a-player class="a-player " autoplay mini :float="true" v-if="myUtils.getStore('musicUrl')!=null"
                :music="{src:myUtils.getStore('musicUrl')}"
      />
    </div>
    <div v-html="content" class="content" :style="{'padding-top':myUtils.getStore('musicUrl')!=null?'0px':'20px'}"></div>
  </div>
</template>

<script>
  import APlayer from 'vue-aplayer'

  export default {
    name: "previewArticle",
    components: {
      APlayer
    },
    data() {
      return {
        content: ''
      }
    }, created() {
      this.content = localStorage.content;
    }
  }
</script>

<style scoped>
  .content {
    padding: 20px;
    word-wrap: break-word;
  }

  .a-player {
    position: absolute;
    margin-left: 743px;
    margin-top: 30px;
  }
</style>
