<template>
  <div
      v-loading="globalLoading"
      element-loading-text="正在添加..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
      </el-input>
      <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZH"
                @keydown.enter.native="doAddRole"></el-input>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse v-model="activeName"
                   v-loading="loading"
                   element-loading-text="正在加载..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   accordion
                   @change="change">
        <el-collapse-item :title="r.nameZH" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0;color: #ff0000;" icon="el-icon-delete"
                         type="text" @click="deleteRole(r)"></el-button>
            </div>
            <div>
              <el-tree
                  show-checkbox
                  node-key="id"
                  ref="tree"
                  :key="index"
                  :default-checked-keys="selectedMenus"
                  :data="allmenus" :props="defaultProps"></el-tree>
              <div style="display: flex;justify-content: flex-end">
                <el-button v-if="!display" type="primary" @click="update">修&emsp;改</el-button>
                <el-button v-if="display" @click="cancelUpdate">取消修改</el-button>
                <el-button v-if="display" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "jurisdictionManage",
  data() {
    return {
      display:false,
      role: {
        name: '',
        nameZH: ''
      },
      allmenus: [],
      activeName: -1,
      selectedMenus: [],
      roles: [],
      loading: false,
      globalLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    deleteRole(role) {
      this.$confirm('此操作将永久删除【' + role.nameZH + '】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Delete("/api/sys/base/permiss/?id=" + role.id).then(res => {
          if (res.code==200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddRole() {
      if (this.role.name && this.role.nameZH) {
        this.globalLoading = true;
        this.Post("/api/sys/base/permiss", this.role).then(res => {
          this.globalLoading = false;
          if (res.code==200) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.role.name = '';
            this.role.nameZH = '';
            this.initRoles();
          }else{
            this.$message({
              message: '添加失败，请检查角色名称是否重复！',
              type: 'error'
            });
          }
        })
      } else {
        this.$message.error('数据不可以为空');
      }
    },
    update(){
      this.display=true;
    },
    cancelUpdate() {
      this.display=false;
      this.activeName = -1;
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      this.Put("/api/sys/base/permiss", {
        id:rid,
        mids:selectedKeys
      }).then(res => {
        if (res.code==200) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.activeName = -1;
          this.display=false;
        }else{
          this.$message({
            message: '修改失败，请检查职称名称是否重复！',
            type: 'error'
          });
        }
      })
    },
    change(rid) {
      this.display=false;
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    initSelectedMenus(rid) {
      this.Get("/api/sys/base/permiss/?rid=" + rid).then(res => {
        if (res) {
          this.selectedMenus = res.data;
        }
      })
    },
    initAllMenus() {
      this.Get("/api/sys/base/permiss/menus").then(res => {
        if (res) {
          this.allmenus = res.data;
        }
      })
    },
    initRoles() {
      this.loading = true;
      this.Get("/api/sys/base/permiss/roles").then(res => {
        this.loading = false;
        if (res) {
          this.roles = res.data;
        }
      })
    }
  }
}
</script>

<style>
.permissManaTool {
  display: flex;
  justify-content: flex-start;
}

.permissManaTool .el-input {
  width: 300px;
  margin-right: 6px;
}

.permissManaMain {
  margin-top: 10px;
  width: 700px;
}
</style>