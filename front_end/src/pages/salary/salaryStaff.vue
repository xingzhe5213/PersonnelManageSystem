<template>
  <div>
    <div>
      <el-table :data="emps" border stripe size="mini">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" fixed width="120" align="center"></el-table-column>
        <el-table-column prop="workID" label="工号" width="120" align="center"></el-table-column>
        <el-table-column prop="email" label="电子邮件" width="200" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="120" align="center"></el-table-column>
        <el-table-column prop="departmentName" label="所属部门" width="180" align="center"></el-table-column>
        <el-table-column label="基本工资" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salaryId">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{ scope.row.basicSalary }}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{ scope.row.trafficSalary }}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{ scope.row.lunchSalary }}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{ scope.row.pensionPer }}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{ scope.row.pensionBase }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{ scope.row.medicalPer }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{ scope.row.medicalBase }}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{ scope.row.accumulationFundPer }}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{ scope.row.accumulationFundBase }}</td>
                  </tr>
                </table>
              </div>
              <el-tag>{{ scope.row.salaryName }}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popover
                placement="left"
                title="修改员工基本工资"
                @show="showPop(scope.row.salaryId)"
                @hide="hidePop(scope.row)"
                width="200"
                trigger="click">
              <div>
                <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                  <el-option
                      v-for="item in salaries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-button slot="reference" type="danger">修改基本工资</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top:15px">
        <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "salaryStaff",
  data() {
    return {
      emps: [],
      total: 0,
      page: 1,
      size: 10,
      currentSalary: null,
      salaries: []
    }
  },
  mounted() {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    sizeChange(size) {
      this.size = size;
      this.initEmps();
    },
    currentChange(page) {
      this.page = page;
      this.initEmps();
    },
    hidePop(data) {
      if (this.currentSalary) {
        this.Put('/api/salary/staffSalary', {
          eid: data.id,
          sid: this.currentSalary
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.initEmps()
          }
        });
      }
    },
    showPop(data) {
      if (data) {
        this.currentSalary = data;
      } else {
        this.currentSalary = null;
      }
    },
    initSalaries() {
      this.Get("/api/salary/staffSalary/salaries").then(res => {
        if (res) {
          this.salaries = res.data;
        }
      })
    },
    initEmps() {
      this.Get("/api/salary/staffSalary?page=" + this.page + '&size=' + this.size).then(res => {
        if (res) {
          this.emps = res.data.list;
          this.total = res.data.total;
        }
      })
    }
  }
}
</script>