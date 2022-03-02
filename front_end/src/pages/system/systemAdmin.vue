<template>
  <div>
    <div style="margin-top: 10px;display: flex;justify-content: center">
      <el-input v-model="keywords" placeholder="通过姓名搜索用户..." prefix-icon="el-icon-search"
                style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
      <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
      <el-button icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
    </div>
    <div class="hr-container">
      <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ hr.name }}</span>
          <el-button style="float: right; padding: 3px 0;color: #e30007;" type="text"
                     icon="el-icon-delete" @click="deleteHr(hr)"></el-button>
        </div>
        <div>
          <div class="img-container">
            <img v-if="hr.userface" :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
            <img v-if="!hr.userface" src="/face.png" :alt="hr.name" :title="hr.name" class="userface-img">
          </div>
          <div class="userinfo-container">
            <div style="font-size: 12px;margin:10px 0;">姓&emsp;&emsp;名：{{ hr.name }}</div>
            <div style="font-size: 12px;margin:10px 0;">用&ensp;户&ensp;名：{{ hr.username }}</div>
            <div style="font-size: 12px;margin:10px 0;">手机号码：{{ hr.phone }}</div>
            <div style="font-size: 12px;margin:10px 0;">地&emsp;&emsp;址：{{ hr.address }}</div>
            <div style="font-size: 12px;margin:10px 0;line-height: 20px;">用户状态：
              <el-switch
                  v-model="hr.enabled"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="启用"
                  @change="enabledChange(hr)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  inactive-text="禁用">
              </el-switch>
            </div>
            <div style="font-size: 12px;margin:10px 0;">用户角色：
              <el-tag type="success" style="margin-right: 4px" v-for="(role,indexj) in hr.roles"
                      :key="indexj">{{ role.nameZH }}
              </el-tag>
              <el-popover
                  placement="right"
                  title="角色列表"
                  @show="showPop(hr)"
                  @hide="hidePop(hr)"
                  width="200"
                  trigger="click">
                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                  <el-option
                      v-for="(r,indexk) in allroles"
                      :key="indexk"
                      :label="r.nameZH"
                      :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="添加管理员"
        style="text-align: center;"
        :visible.sync="dialogVisible"
        width="28%">
      <div>
        <el-form :model="admin" :rules="rules" ref="empForm" style="padding: 0 30px;">
          <el-row>
            <el-form-item label="姓名：" prop="name">
              <label slot="label">姓&emsp;&emsp;名：</label>
              <el-input size="mini" style="width: 220px" prefix-icon="el-icon-edit" v-model="admin.name"
                        placeholder="请输入管理员姓名"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="用户名：" prop="username">
              <label slot="label">用&ensp;户&ensp;名：</label>
              <el-input size="mini" style="width: 220px" prefix-icon="el-icon-edit" v-model="admin.username"
                        placeholder="请输入管理员用户名"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="手机号：" prop="phone">
              <label slot="label">手&ensp;机&ensp;号：</label>
              <el-input size="mini" style="width: 220px" prefix-icon="el-icon-phone" v-model="admin.phone"
                        placeholder="请输入管理员手机号码"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="地址：" prop="address">
              <label slot="label">地&emsp;&emsp;址：</label>
              <el-input size="mini" style="width: 220px" prefix-icon="el-icon-edit" v-model="admin.address"
                        placeholder="请输入管理员所在地"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="add">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "systemAdmin",
  data() {
    return {
      keywords: '',
      hrs: [],
      selectedRoles: [],
      allroles: [],
      dialogVisible: false,
      admin: {
        name: "",
        username: "",
        phone: "",
        address: "",
      },
      rules: {
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入所在地', trigger: 'blur'}],

      }
    }
  },
  mounted() {
    this.initHrs();
  },
  methods: {
    add(){
      this.$refs['empForm'].validate(valid => {
        if (valid) {
          console.log(this.admin)
          this.Post("/api/sys/adm/leader", this.admin).then(res => {
            if (res.code==200) {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.initHrs();
              this.admin = {
                name: "",
                username: "",
                phone: "",
                address: "",
              };
              this.dialogVisible = false;
            }else{
              this.$message({
                message: '添加失败，请检查职位名称是否重复！',
                type: 'error'
              });
            }
          })
        }
      });
    },
    deleteHr(hr) {
      this.$confirm('此操作将永久删除【' + hr.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Delete("/api/sys/adm/leader/?id=" + hr.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initHrs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doSearch() {
      this.initHrs();
    },
    hidePop(hr) {
      let roles = [];
      Object.assign(roles, hr.roles);
      let flag = false;
      if (roles.length != this.selectedRoles.length) {
        flag = true;
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j];
            if (role.id == sr) {
              roles.splice(i, 1);
              i--;
              break;
            }
          }
        }
        if (this.selectedRoles.length != 0) {
          flag = true;
        }
      }
      if (flag && this.selectedRoles.length != 0) {
        this.Put("/api/sys/adm/leader/roles", {
          id: hr.id,
          rids: this.selectedRoles
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.initHrs();
          } else {
            this.$message({
              message: '修改失败，请检查职称名称是否重复！',
              type: 'error'
            });
          }
        })
      } else if (this.selectedRoles.length == 0) {
        this.$message({
          type: 'info',
          message: '至少保留一个角色'
        });
      }
    },
    showPop(hr) {
      this.initAllRoles();
      let roles = hr.roles;
      this.selectedRoles = [];
      roles.forEach(r => {
        this.selectedRoles.push(r.id);
      })
    },
    enabledChange(hr) {
      this.Put("/api/sys/adm/leader", {
        id:hr.id,
        enabled:hr.enabled
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
        }
      })
    },
    initAllRoles() {
      this.Get("/api/sys/base/permiss/roles").then(res => {
        if (res) {
          this.allroles = res.data;
        }
      })
    },
    initHrs() {
      this.Get("/api/sys/adm/leader?keyword=" + this.keywords).then(res => {
        if (res) {
          this.hrs = res.data;
        }
      })
    }
  },
  watch: {
    'dialogVisible': function (val) {
      if(val==false){
        this.$nextTick(() => {
          this.$refs['empForm'].clearValidate()
        })
      }
    }
  }
}
</script>

<style>
.userinfo-container div {
  font-size: 12px;
  color: #409eff;
}

.userinfo-container {
  margin-top: 20px;
}

.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userface-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.hr-container {
  margin: 10px 20px;
  display: flex;
  flex-wrap: wrap;
}

.hr-card {
  width: 350px;
  margin: 20px;
}
</style>