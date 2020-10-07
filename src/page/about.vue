<template>
  <div class="container">
    <div class="header">
      <div class="menu">
        <span @click="$router.push('/')">首页</span>
        <span @click="$router.push('/Home')">发现</span>
        <span @click="$router.push('/about')">关于</span>
        <span @click="$router.push('/login')">登陆</span>
      </div>
    </div>
    <div class="main-body">
      <div class="title">关于项目</div>
      <div class="introduce">
        <timeline>
          <timeline-item>
            <p class="time introduce-title">作者赠语</p>
            <div class="content introduce-content">
              <div>人生很短，江湖太大，目标还在，让我们在成长路上彼此祝福。</div>
              <div>其实我们每个人的生活都是一个世界， 即使最平凡的人也要为他生活的那个世界努力。</div>
              <div>你还年轻，别凑活过；接下来的人生，还有万万种可能。</div>
            </div>
          </timeline-item>
          <timeline-item>
            <p class="time introduce-title">项目介绍</p>
            <div class="content introduce-content">
              页面参考美篇(https://www.meipian.cn/),实现了前后端分离,Session共享，可以将应用部署到多个服务器运行
              <div>使用技术框架:</div>
              <div style="margin-left: 10px;">前端:Vue全家桶,axios,iview,阿里巴巴图标库</div>
              <div style="margin-left: 10px;">
                后端:Spring,SpringMVC,Mybatis,Mysql,Redis,Elasticsearch,Xxl-job,ActiveMq,FastDFS,Zookeeper,Dubbo,Swagger
              </div>
            </div>
          </timeline-item>
          <timeline-item>
            <p class="time introduce-title">项目结构</p>
            <div class="content introduce-content">
              用户模块,搜索模块，配置中心,前台页面,后台页面,业务中心
            </div>
          </timeline-item>
        </timeline>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "about"
  }
</script>
<style scoped>
  .container {
    background-image: url('/static/images/menghuan.jpg');
    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    height: 100vh;
  }

  .header {
    width: 100%;
    text-align: right;
    background-color: white;
  }

  .menu {
    margin-right: 200px;
    padding: 12px;
    font-size: 18px;
  }

  .menu span {
    margin-left: 15px;
  }

  .menu span:nth-child(3) {
    color: blue;
  }

  .menu span:hover {
    color: #090805;
    cursor: pointer;
  }

  .main-body {
    position: absolute;
    left: 0;
    right: 0;
    top: 70px;
    width: 800px;
    height: 500px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
  }

  .main-body .title {
    position: relative;
    left: 0;
    right: 0;
    font-size: 30px;
    text-align: center;
  }

  .introduce {
    margin-top: 50px;
  }

  .introduce-title {
    font-size: 15px;
    color: black;

  }

  .introduce-content {
    font-size: 13px;
  }
</style>
