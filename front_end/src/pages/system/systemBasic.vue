<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DepManage">
        <DepManage></DepManage>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="PosManage">
        <PosManage></PosManage>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="JobLevelManage">
        <JobLevelManage></JobLevelManage>
      </el-tab-pane>
      <el-tab-pane label="权限组" name="jurisdictionManage">
        <jurisdictionManage></jurisdictionManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepManage from '@/components/system/DepManage'
import PosManage from '@/components/system/PosManage'
import JobLevelManage from '@/components/system/JobLevelManage'
import jurisdictionManage from '@/components/system/jurisdictionManage'

export default {
  name: "systemBasic",
  data() {
    return {
      activeName: 'DepManage'
    }
  },
  components: {
    DepManage,
    PosManage,
    JobLevelManage,
    jurisdictionManage
  }
}
</script>