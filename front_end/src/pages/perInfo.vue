<template>
  <div v-if="per">
    <el-card class="box-card" style="width: 400px">
      <div slot="header" class="clearfix">
        <span>{{ per.name }}</span>
      </div>
      <div>
        <div style="display: flex;justify-content: center">
          <el-upload
              :show-file-list="false"
              :on-success="Success"
              :on-error="Error"
              action="/api/person/face">
            <img title="点击修改用户图像" :src="faceImg" style="width: 100px;height: 100px;border-radius: 50px"
                 alt="">
          </el-upload>
        </div>
        <div style="margin: 10px 5px;">手机号码：
          <el-tag>{{ per.phone }}</el-tag>
        </div>
        <div style="margin: 10px 5px;">居住地址：
          <el-tag>{{ per.address }}</el-tag>
        </div>
        <div style="margin: 10px 5px;">用户标签：
          <el-tag type="success" style="margin-right: 5px" v-for="(r,index) in per.roles" :key="index">
            {{ r.nameZH }}
          </el-tag>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 20px">
          <el-button type="primary" @click="showInfoView">修改信息</el-button>
          <el-button type="danger" @click="showPasswdView">修改密码</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="修改用户信息"
        :visible.sync="InfoView"
        width="25%">
      <div>
        <table>
          <tr height="40px">
            <td width="80px">
              <el-tag>用户昵称：</el-tag>
            </td>
            <td width="250px">
              <el-input v-model="per2.name"></el-input>
            </td>
          </tr>
          <tr height="40px">
            <td width="80px">
              <el-tag>手机号码：</el-tag>
            </td>
            <td width="250px">
              <el-input v-model="per2.phone"></el-input>
            </td>
          </tr>
          <tr height="40px">
            <td width="80px">
              <el-tag>用户地址：</el-tag>
            </td>
            <td width="250px">
              <el-input v-model="per2.address"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="InfoView = false">取 消</el-button>
    <el-button type="primary" @click="updateperInfo">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="修改密码"
        :visible.sync="passwdView"
        width="25%">
      <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="请输入旧密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请输入新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "perInfo",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度为6-16位'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      faceImg: "/face.png",
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass1, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      per: null,
      per2: null,
      InfoView: false,
      passwdView: false
    }
  },
  mounted() {
    this.initPer();
  },
  methods: {
    initPer() {
      this.Get('/api/person/info').then(res => {
        if (res) {
          this.per = res.data;
          this.per2 = Object.assign({}, this.per);
          if (res.data.userface) {
            this.faceImg = res.data.userface;
          } else {
            this.faceImg = "/face.png";
          }
          window.sessionStorage.setItem("user", JSON.stringify(res.data));
          this.$store.commit('initCurrentUser', res.data);
        }
      })
    },
    // 头像上传成功
    Success() {
      this.$notify.success({
        title: '成功',
        message: `头像修改成功`
      });
      this.initPer();
    },
    // 头像上传失败
    Error() {
      this.$notify.error({
        title: '错误',
        message: `头像修改失败`
      });
    },
    showInfoView() {
      this.InfoView = true;
    },
    showPasswdView() {
      this.passwdView = true;
    },
    updateperInfo() {
      console.log(this.per2)
      this.Put("/api/person/info", {
        name: this.per2.name,
        phone: this.per2.phone,
        address: this.per2.address
      }).then(res => {
        if (res) {
          this.InfoView = false;
          this.initPer();
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.Put("/api/person/passwd", {
            oldpassword: (this.$md5(this.ruleForm.oldPass)).toUpperCase(),
            password: (this.$md5(this.ruleForm.pass)).toUpperCase()
          }).then(res => {
            if (res.code == 200) {
              Message.success({
                message: '密码修改成功，请重新登陆！！',
                duration: 2000,
                onClose: () => {
                  window.sessionStorage.removeItem("user");
                  this.$store.commit('initToken', null);
                  this.$store.commit('initRoutes', []);
                  this.$router.replace("/");
                }
              });
            } else {
              Message.error(res.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>