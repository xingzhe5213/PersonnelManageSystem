<template>
  <div>
    <div>
      <el-input size="small" v-model="jl.name" style="width: 300px;" prefix-icon="el-icon-plus"
                placeholder="添加职称..."></el-input>
      <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small"
                 style="margin-left: 5px;margin-right: 5px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addJobLevel">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="jls"
          border
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          size="small"
          @selection-change="handleSelectionChange"
          style="width: 80%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            type="index"
            label="序号"
            align="center"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称级别">
        </el-table-column>
        <el-table-column
            label="是否启用">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0"
                 @click="deleteMany">批量删除
      </el-button>

    </div>
    <el-dialog
        title="修改职称"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>职&ensp;称&ensp;名</el-tag>
            </td>
            <td>
              <el-input size="small" v-model="updateJl.name"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>职称级别</el-tag>
            </td>
            <td>
              <el-select v-model="updateJl.titleLevel" placeholder="职称等级" size="small"
                         style="margin-left: 5px;margin-right: 5px">
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>是否启用</el-tag>
            </td>
            <td>
              <el-switch
                  v-model="updateJl.enabled"
                  active-text="启用"
                  :active-value="1"
                  inactive-text="禁用"
                  :inactive-value="0">
              </el-switch>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JobLevelManage",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      multipleSelection: [],
      updateJl: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      jl: {
        name: '',
        titleLevel: ''
      },
      jls: [],
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级',
      ]
    }
  },
  mounted() {
    this.initJls();
  },
  methods: {
    deleteMany() {
      let count=0;
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item => {
          count++;
          this.Delete("/api/sys/base/joblevel/?id=" + item.id).then(res => {
            if (res.code == 200) {
              this.initJls();
            }
          })
          if (count == this.multipleSelection.length) {
            this.$message({
              type: 'success',
              message: '删除成功 ' + this.multipleSelection.length + ' 条！'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doUpdate() {
      this.Put("/api/sys/base/joblevel", this.updateJl).then(res => {
        if (res.code==200) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.initJls();
          this.dialogVisible = false;
        }else{
          this.$message({
            message: '修改失败，请检查职称名称是否重复！',
            type: 'error'
          });
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showEditView(data) {
      Object.assign(this.updateJl, data);
      this.dialogVisible = true;
    },
    deleteHandler(data) {
      this.$confirm('此操作将永久【' + data.name + '】职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Delete("/api/sys/base/joblevel/?id=" + data.id).then(res => {
          if (res.code==200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initJls();
          }else if(res.code==201){
            this.$message({
              type: 'info',
              message: '该职位人数不为0，删除失败！'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.Post("/api/sys/base/joblevel", this.jl).then(res => {
          if (res.code==200) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.initJls();
          }else{
            this.$message({
              message: '添加失败，请检查职称名称是否重复！',
              type: 'error'
            });
          }
        });
      } else {
        this.$message.error("添加字段不可以为空!");
      }
    },
    initJls() {
      this.loading = true;
      this.Get("/api/sys/base/joblevel").then(res => {
        this.loading = false;
        if (res) {
          this.jls = res.data;
          this.jl = {
            name: '',
            titleLevel: ''
          };
        }
      })
    }
  }
}
</script>

<style scoped>

</style>