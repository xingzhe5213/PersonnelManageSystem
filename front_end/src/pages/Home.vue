<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">人事管理系统</div>
        <div>
          <el-dropdown class="userInfo" @command="commandHandler">
            <span class="el-dropdown-link">
              {{user.name}}<i>
              <img v-if="user.userface" :src="user.userface" alt="">
              <img v-if="!user.userface" src="/face.png" alt="">
            </i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened :style="{height: divHeight}">
            <el-submenu :index="index+''" v-for="(item,index) in routes"  :key="index">
              <template slot="title">
                <i style="color: #409eff;margin-right: 5px" :class="item.iconClass"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                {{child.name}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到黄石市***公司人事管理系统！
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      divHeight: null,
      faceImg:"/face.png"
    }
  },
  computed: {
    routes() {
      console.log(this.$store.state.routes);
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentHr;
    }
  },
  mounted() {
    this.setHeight();
    if(this.user.userface){
      this.faceImg=this.user.userface;
    }
  },
  methods: {
    setHeight(){
      let windowHeight = window.innerHeight;
      windowHeight = windowHeight - 62;
      this.divHeight = windowHeight + "px";
    },
    commandHandler(cmd) {
      if (cmd == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.sessionStorage.removeItem("user");
          this.$store.commit('initToken', null);
          this.$store.commit('initRoutes', []);
          this.$router.replace("/");
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }else if (cmd == 'userinfo') {
        this.$router.push('/perInfo');
      }
    }
  }
}
</script>

<style>
.homeRouterView {
  margin-top: 10px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409eff;
  padding-top: 50px;
}

.homeHeader {
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文行楷;
  color: #ffffff
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style>