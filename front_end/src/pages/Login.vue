<template>
  <div>
    <el-form
        :rules="rules"
        ref="loginForm"
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :model="loginForm"
        class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                  placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input size="normal" type="text" v-model="loginForm.code" auto-complete="off"
                  placeholder="点击图片更换验证码" @keydown.enter.native="submitLogin" style="width: 250px"></el-input>
        <div @click="updateVerifyCode" style="cursor: pointer;height: 40px;" v-html="svg"></div>
      </el-form-item>
      <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      svg:"",
      loginForm: {
        username: '',
        password: '',
        code:''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  mounted(){
    this.updateVerifyCode();
  },
  methods: {
    updateVerifyCode() {
      this.Get('/api/verifyCode').then(res => {
          this.svg = res.data;
      })
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.Post('/api/login', {
            username: this.loginForm.username,
            password: (this.$md5(this.loginForm.password)).toUpperCase(),
            code: this.loginForm.code
          }).then(res => {
            this.loading = false;
            if (res && res.code==200) {
              window.sessionStorage.setItem("token", res.token);
              this.$store.commit('initCurrentUser', res.data);
              window.sessionStorage.setItem("user", JSON.stringify(res.data));
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
            }else if(res.code==201){
              this.$message.error({message:res.message});
              this.updateVerifyCode();
            }else{
              this.$message.error({message:res.message});
              this.updateVerifyCode();
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}
.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}
.el-form-item__content{
  display: flex;
  align-items: center;
}
</style>
