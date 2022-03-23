<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button icon="el-icon-plus" type="primary" @click="showAddSalaryView">添加基本工资</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initSalaries"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="salaries" border stripe>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column width="200" align="center" prop="name" label="基本工资名称"></el-table-column>
        <el-table-column width="100" align="center" prop="basicSalary" label="基本工资"></el-table-column>
        <el-table-column width="100" align="center" prop="trafficSalary" label="交通补助"></el-table-column>
        <el-table-column width="100" align="center" prop="lunchSalary" label="午餐补助"></el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column width="80" align="center" prop="pensionPer" label="比率"></el-table-column>
          <el-table-column width="100" align="center" prop="pensionBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column width="80" align="center" prop="medicalPer" label="比率"></el-table-column>
          <el-table-column width="100" align="center" prop="medicalBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column width="80" align="center" prop="accumulationFundPer" label="比率"></el-table-column>
          <el-table-column width="100" align="center" prop="accumulationFundBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="showEditSalaryView(scope.row)">编辑</el-button>
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
        :title="dialogTitle"
        style="text-align: center;"
        :visible.sync="dialogVisible"
        width="39%">
      <div>
        <el-form :model="salary" :rules="rules" ref="empForm" style="padding: 0 30px;">
          <el-row>
            <el-col :span="13">
              <el-form-item label="名称：" prop="name">
                <label slot="label">名&emsp;&emsp;称：</label>
                <el-input size="mini" style="width: 165px" prefix-icon="el-icon-edit" v-model="salary.name"
                          placeholder="请输入基本工资名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="基本工资：" prop="basicSalary">
                <label slot="label">基本工资：</label>
                <el-input size="mini" style="width: 130px" prefix-icon="fa fa-jpy" v-model="salary.basicSalary"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="交通补助：" prop="trafficSalary">
                <label slot="label">交通补助：</label>
                <el-input size="mini" style="width: 130px" prefix-icon="fa fa-jpy" v-model="salary.trafficSalary"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="午餐补助：" prop="lunchSalary">
                <label slot="label">午餐补助：</label>
                <el-input size="mini" style="width: 130px" prefix-icon="fa fa-jpy" v-model="salary.lunchSalary"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="养老金基数" prop="pensionBase">
                <label slot="label">养&nbsp;老&nbsp;金&nbsp;基&nbsp;数：</label>
                <el-input size="mini" style="width: 100px" prefix-icon="fa fa-jpy" v-model="salary.pensionBase"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="养老金比率：" prop="pensionPer">
                <label slot="label">养&nbsp;老&nbsp;金&nbsp;比&nbsp;率：</label>
                <el-input size="mini" style="width: 100px" prefix-icon="fa fa-jpy" v-model="salary.pensionPer"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="医疗保险基数：" prop="medicalBase">
                <label slot="label">医疗保险基数：&thinsp;</label>
                <el-input size="mini" style="width: 100px" prefix-icon="fa fa-jpy" v-model="salary.medicalBase"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="医疗保险比率：" prop="medicalPer">
                <label slot="label">医疗保险比率：&thinsp;</label>
                <el-input size="mini" style="width: 100px" prefix-icon="fa fa-jpy" v-model="salary.medicalPer"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="公积金基数：" prop="accumulationFundBase">
                <label slot="label">公&nbsp;积&nbsp;金&nbsp;基&nbsp;数：</label>
                <el-input size="mini" style="width: 100px" prefix-icon="fa fa-jpy" v-model="salary.accumulationFundBase"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公积金比率：" prop="accumulationFundPer">
                <label slot="label">公&nbsp;积&nbsp;金&nbsp;比&nbsp;率：</label>
                <el-input size="mini" style="width: 100px" prefix-icon="fa fa-jpy" v-model="salary.accumulationFundPer"
                          placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
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
  name: "baseSalary",
  data() {
    return {
      total: 0,
      page: 1,
      size: 10,
      dialogVisible: false,
      dialogTitle: '添加基本工资',
      salaries: [],
      salary: {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        pensionBase: 0,
        pensionPer: 0,
        medicalBase: 0,
        medicalPer: 0,
        accumulationFundBase: 0,
        accumulationFundPer: 0,
      },
      rules: {
        name: [{required: true, message: '请输入基本工资名称', trigger: 'blur'}],
        basicSalary: [{required: true, message: '请输入基本工资', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods: {
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initSalaries();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initSalaries();
    },
    showEditSalaryView(data) {
      console.log(data)
      this.$nextTick(() => {
        this.$refs['empForm'].clearValidate()
      })
      this.dialogTitle = '修改基本工资';
      this.dialogVisible = true;
      this.salary = data;
    },
    deleteSalary(data) {
      this.$confirm('此操作将删除【' + data.name + '】基本工资，是否继续？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        this.Delete("/api/salary/baseSalary/?id=" + data.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initSalaries();
          } else if (res.code == 201) {
            this.$message({
              message: '删除失败，该基本工资尚在使用中！',
              type: 'error'
            });
            this.initSalaries();
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
      this.salary = {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        pensionBase: 0,
        pensionPer: 0,
        medicalBase: 0,
        medicalPer: 0,
        accumulationFundBase: 0,
        accumulationFundPer: 0,
      }
      this.dialogTitle = '添加基本工资';
    },
    add() {
      if (this.salary.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            console.log(this.salary)
            this.Put("/api/salary/baseSalary", this.salary).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.initSalaries();
              } else if (res.code == 201) {
                this.$message({
                  message: '修改失败，请检查名称是否重复！',
                  type: 'error'
                });
              }
            })
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            console.log(this.salary)
            this.Post("/api/salary/baseSalary", this.salary).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.initSalaries();
              } else if (res.code == 201) {
                this.$message({
                  message: '添加失败，请检查名称是否重复！',
                  type: 'error'
                });
              }
            })
          }
        });
      }
    },
    initSalaries() {
      this.Get("/api/salary/baseSalary?size=" + this.size + "&page=" + this.page).then(res => {
        if (res) {
          this.salaries = res.data.list;
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
        this.initSalaries();
      }
    }
  }
}
</script>