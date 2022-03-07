<template>
  <div style="margin:100px auto;">
    <div class="img-404">
    </div>
    <p class="notfound-p">未找到页面...</p>
    <div class="notfound-reason">
      <p style="margin-top: 13px">可能的原因：</p>
      <ul>
        <li style="margin-top: 10px;">原来的页面不存在了</li>
        <li style="margin-top: 10px;">我们的服务器被外星人劫持了</li>
      </ul>
    </div>
    <div style="margin: 40px auto 0;text-align: center">
      <el-button type="primary" @click="toHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "404",
  methods: {
    toHome() {
      this.$router.replace('/home');
    }
  }
}
</script>

<style scoped>
.img-404 {
  height: 155px;
  background: url(../../public/404.png) center center no-repeat;
  -webkit-background-size: 150px auto;
  margin-top: 40px;
  margin-bottom: 20px
}

.notfound-p {
  line-height: 22px;
  font-size: 17px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f6f6f6;
  text-align: center;
  color: #262b31
}

.notfound-reason {
  color: #9ca4ac;
  font-size: 13px;
  line-height: 13px;
  text-align: left;
  width: 210px;
  margin: 0 auto
}
</style>