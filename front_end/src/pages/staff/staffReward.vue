<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddSalaryView">添加记录</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initSalaries"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="rewards" border stripe>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column width="150" align="center" prop="name" label="姓名"></el-table-column>
        <el-table-column width="150" align="center" prop="workID" label="工号"></el-table-column>
        <el-table-column width="150" align="center" label="金额">
          <template slot-scope="scope" v-if="scope.row.rpMoney">
            ￥：
            <el-tag v-if="scope.row.rpType==0">{{ scope.row.rpMoney }}</el-tag>
            <el-tag v-if="scope.row.rpType==1"
                    style="color: red;background-color: rgba(255,193,193,0.3);border-color: #ffcece;">
              {{ scope.row.rpMoney }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" prop="rpDate" label="时间"></el-table-column>
        <el-table-column align="center" prop="rpReason" label="原因"></el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteSalary(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top:15px">
        <el-pagination
            background
            :current-page.sync="page"
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        title="添加记录"
        style="text-align: center;"
        :visible.sync="dialogVisible"
        width="35%">
      <div>
        <el-form :model="reward" :rules="rules" ref="empForm" style="padding: 0 30px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号：" prop="eid">
                <label slot="label">工号：</label>
                <el-input size="mini" style="width: 130px" prefix-icon="el-icon-edit" v-model="reward.eid"
                          placeholder="请输入工号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额：" prop="rpMoney">
                <label slot="label">金额：</label>
                <el-input size="mini" style="width: 130px" prefix-icon="fa fa-jpy" v-model="reward.rpMoney"
                          placeholder="请输入金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="类别：" prop="rpType">
                <label slot="label">类别：</label>
                <el-radio-group v-model="reward.rpType" style="margin-top: 9px;">
                  <el-radio label="0">奖</el-radio>
                  <el-radio label="1">罚</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="原因：" prop="rpReason">
              <label slot="label">原因：</label>
              <el-input size="mini" type="textarea" style="width: 360px;" prefix-icon="fa fa-jpy"
                        v-model="reward.rpReason"
                        placeholder="请输入"></el-input>
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
  name: "staffReward",
  data() {
    return {
      total: 0,
      page: 1,
      size: 10,
      dialogVisible: false,
      rewards: [],
      reward: {
        eid: '',
        rpMoney: "",
        rpType: null,
        rpReason: ""
      },
      rules: {
        eid: [{required: true, message: '请输入员工id', trigger: 'blur'}],
        rpMoney: [{required: true, message: '请输入奖惩金额', trigger: 'blur'}],
        rpType: [{required: true, message: '请选择奖惩类型', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initRewards();
  },
  methods: {
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initRewards();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initRewards();
    },
    deleteSalary(data) {
      this.$confirm('此操作将删除【' + data.name + '】的奖惩记录，是否继续？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        this.Delete("/api/employee/reward?id=" + data.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initRewards();
          }
        })
      }).catch(() => {
        this.$message.info("取消删除!");
      })
    },
    showAddSalaryView() {
      this.$nextTick(() => {
        this.$refs['empForm'].clearValidate()
      })
      this.dialogVisible = true;
      this.reward = {
        eid: '',
        rpMoney: "",
        rpType: null,
        rpReason: ""
      }
    },
    add() {
      this.$refs['empForm'].validate(valid => {
        if (valid) {
          this.Post("/api/employee/reward", this.reward).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.initRewards();
            } else if (res.code == 201) {
              this.$message({
                message: '该员工不存在，请检查工号是否正确！',
                type: 'info'
              });
            }
          })
        }
      });
    },
    initRewards() {
      this.Get("/api/employee/reward?size=" + this.size + "&page=" + this.page).then(res => {
        if (res) {
          this.rewards = res.data.list;
          this.total = res.data.total;
        }
      })
    }
  },
  watch: {
    'dialogVisible': function (val) {
      if (val == false) {
        this.$nextTick(() => {
          this.$refs['empForm'].clearValidate()
        })
        this.initRewards();
      }
    }
  }
}
</script>

<style scoped>
.el-radio {
  margin-right: 12px;
}

.el-radio__label {
  padding-left: 5px;
}
</style>