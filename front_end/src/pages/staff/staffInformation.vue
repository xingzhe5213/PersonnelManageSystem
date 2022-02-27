<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                    clearable
                    @clear="initEmps"
                    style="width: 350px;margin-right: 10px" v-model="keyword"
                    @keydown.enter.native="initEmps" :disabled="showAdvanceSearchView"></el-input>
          <el-button icon="el-icon-search" type="primary" @click="search" :disabled="showAdvanceSearchView">
            搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
            <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
          <el-button @click="reset()">重置</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
            添加用户
          </el-button>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchView"
             style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 15px 20px;;margin: 10px 0px;font-size: 13px;">
          <el-row>
            <el-col :span="5">
              政治面貌：
              <el-select v-model="searchValue.politicId" placeholder="政治面貌" size="mini"
                         style="width: 140px;">
                <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5" style="margin-left: 30px;">
              民&emsp;&emsp;族：
              <el-select v-model="searchValue.nationId" placeholder="民族" size="mini"
                         style="width: 140px;">
                <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="5" style="margin-left: 30px;">
              职&emsp;&emsp;称：
              <el-select v-model="searchValue.jobLevelId" placeholder="职称" size="mini"
                         style="width: 140px;">
                <el-option
                    v-for="item in joblevels"
                    :disabled="!item.enabled"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="margin-left: 30px;">
              入职日期：
              <el-date-picker
                  v-model="searchValue.beginDateScope"
                  type="daterange"
                  size="mini"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:280px;">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="5">
              所属部门：
              <el-select-tree
                  size="mini"
                  placeholder="请选择内容"
                  :check-strictly="true"
                  :data="allDeps"
                  :props="defaultProps"
                  :disabled-values="inputDepName"
                  v-model="searchValue.departmentId"
                  @change="searvhViewHandleNodeClick"
                  style="width: 140px;"
              ></el-select-tree>
            </el-col>
            <el-col :span="5" style="margin-left: 30px;">
              职&emsp;&emsp;位：
              <el-select v-model="searchValue.posId" placeholder="职位" size="mini" style="width: 140px;">
                <el-option
                    v-for="item in positions"
                    :disabled="!item.enabled"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5" style="height: 28px;line-height: 28px;margin-left: 30px;margin-right: 230px;">
              聘用形式：
              <el-radio-group v-model="searchValue.engageForm">
                <el-radio label="劳动合同" style="margin-right: 20px;">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>

            <el-col :span="3">
              <el-button size="mini" @click="reset()">取消</el-button>
              <el-button size="mini" icon="el-icon-search" type="primary" @click="currentChange(1)" style="margin-left: 20px;">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          stripe
          border
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%">
        <el-table-column
            type="selection"
            align="center"
            width="50">
        </el-table-column>
        <el-table-column
            prop="name"
            fixed
            align="center"
            label="姓名"
            width="90">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="center"
            width="75">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            align="center"
            width="50">
        </el-table-column>
        <el-table-column
            prop="birthday"
            width="95"
            align="center"
            label="出生日期">
        </el-table-column>
        <el-table-column
            prop="idCard"
            width="155"
            align="center"
            label="身份证号码">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            width="80"
            align="center"
            label="婚姻状况">
        </el-table-column>
        <el-table-column
            prop="nationName"
            width="90"
            align="center"
            label="民族">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            width="120"
            align="center"
            label="籍贯">
        </el-table-column>
        <el-table-column
            prop="politicName"
            align="center"
            width="100"
            label="政治面貌">
        </el-table-column>
        <el-table-column
            prop="email"
            width="180"
            align="center"
            label="电子邮件">
        </el-table-column>
        <el-table-column
            prop="phone"
            width="100"
            align="center"
            label="电话号码">
        </el-table-column>
        <el-table-column
            prop="address"
            width="220"
            align="center"
            label="联系地址">
        </el-table-column>
        <el-table-column
            prop="departmentName"
            width="130"
            align="center"
            label="所属部门">
        </el-table-column>
        <el-table-column
            prop="positionName"
            width="100"
            align="center"
            label="职位">
        </el-table-column>
        <el-table-column
            prop="jobLevelName"
            width="100"
            align="center"
            label="职称">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            width="100"
            align="center"
            label="聘用形式">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            width="80"
            align="center"
            label="最高学历">
        </el-table-column>
        <el-table-column
            prop="specialty"
            width="150"
            align="center"
            label="专业">
        </el-table-column>
        <el-table-column
            prop="school"
            width="150"
            align="center"
            label="毕业院校">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            width="95"
            align="center"
            label="入职日期">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            width="95"
            align="center"
            label="转正日期">
        </el-table-column>
        <el-table-column
            prop="workState"
            width="95"
            align="center"
            label="员工状态">
        </el-table-column>
        <el-table-column
            prop="notWorkDate"
            width="95"
            align="center"
            label="离职日期">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            width="95"
            align="center"
            label="合同起始日期">
        </el-table-column>
        <el-table-column
            width="100"
            align="center"
            label="合同期限">
          <template slot-scope="scope" v-if="scope.row.contractTerm">
            <el-tag>{{scope.row.contractTerm}}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            align="center"
            width="100"
            label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditEmpView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除
            </el-button>
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
        :title="title"
        :visible.sync="dialogVisible"
        width="80%"
        style="text-align: center;">
      <div style="margin-left: 30px;">
        <el-form :model="emp" :rules="rules" ref="empForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名：" prop="name">
                <label slot="label">姓&emsp;&emsp;名：</label>
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.name"
                          placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别：" prop="gender">
                <label slot="label">性&emsp;&emsp;别：</label>
                <el-radio-group v-model="emp.gender" style="margin-top: 9px;">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="政治面貌：" prop="politicId">
                <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族：" prop="nationId">
                <label slot="label">民&emsp;&emsp;族：</label>
                <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="籍贯：" prop="nativePlace">
                <label slot="label">籍&emsp;&emsp;贯：</label>
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.nativePlace" placeholder="请输入籍贯"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱：" prop="email">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                          v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系地址：" prop="address">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.address" placeholder="请输入联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位：" prop="positionId">
                <label slot="label">职&emsp;&emsp;位：</label>
                <el-select v-model="emp.positionId" placeholder="职位" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in positions"
                      :disabled="!item.enabled"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职称：" prop="jobLevelId">
                <label slot="label">职&emsp;&emsp;称：</label>
                <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in joblevels"
                      :disabled="!item.enabled"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门：" prop="departmentId">
                <el-select-tree
                    size="mini"
                    placeholder="请选择内容"
                    :check-strictly="true"
                    :data="allDeps"
                    :props="defaultProps"
                    :disabled-values="inputDepName"
                    v-model="emp.departmentId"
                    @change="handleNodeClick"
                    style="width: 150px;"
                ></el-select-tree>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话号码：" prop="phone">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-phone"
                          v-model="emp.phone" placeholder="电话号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号：" prop="workID">
                <label slot="label">工&emsp;&emsp;号：</label>
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.workID" placeholder="工号" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学历：" prop="tiptopDegree">
                <label slot="label">学&emsp;&emsp;历：</label>
                <el-select v-model="emp.tiptopDegree" placeholder="学历" size="mini"
                           style="width: 150px;">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校：" prop="school">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.school" placeholder="毕业院校名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="专业名称：" prop="specialty">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期：" prop="beginDate">
                <label slot="label" style="padding-left: 10px;">入职日期：</label>
                <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正日期：" prop="conversionTime">
                <label slot="label" style="padding-left: 10px;">转正日期：</label>
                <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期：" prop="beginContract">
                <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 134px;"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同期限：" prop="contractTerm">
                <label slot="label" style="padding-left: 10px;">合同期限：</label>
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.contractTerm" placeholder="合同期限"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" style="margin-right: 25px;">
              <el-form-item label="身份证号码：" prop="idCard">
                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                          v-model="emp.idCard" placeholder="请输入身份证号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="margin-right: 10px;">
              <el-form-item label="员工状态：" prop="workState" style="padding-right: 8px;">
                <el-radio-group v-model="emp.workState" style="margin-top: 9px;">
                  <el-radio label="在职">在职</el-radio>
                  <el-radio label="离职">离职</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="margin-right: 10px;">
              <el-form-item label="聘用形式：" prop="engageForm">
                <el-radio-group v-model="emp.engageForm" style="margin-top: 9px;">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="婚姻状况：" prop="wedlock">
                <el-radio-group v-model="emp.wedlock" style="margin-top: 9px;">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "staffInformation",
  data() {
    return {
      searchValue: {
        politicId: null,
        nationId: null,
        jobLevelId: null,
        posId: null,
        engageForm: null,
        departmentId: null,
        beginDateScope: null
      },
      title: '',
      showAdvanceSearchView: false,
      allDeps: [],
      emps: [],
      loading: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      keyword: '',
      size: 10,
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      inputDepName: '所属部门',
      emp: {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: 5,
        jobLevelId: null,
        positionId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: null,
        workState: "",
        workID: "",
        contractTerm: null,
        conversionTime: null,
        notworkDate: null,
        beginContract: null
      },
      defaultProps: {
        value:'departmentId',
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          message: '身份证号码格式不正确',
          trigger: 'blur'
        }],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
        departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        positionId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {
    searvhViewHandleNodeClick(event, item) {
      this.inputDepName = item.name;
      this.searchValue.departmentId = item.id;
    },
    reset(){
      this.searchValue.politicId= null;
      this.searchValue.nationId= null;
      this.searchValue.jobLevelId= null;
      this.searchValue.posId= null;
      this.searchValue.engageForm= null;
      this.searchValue.departmentId= null;
      this.searchValue.beginDateScope= null;
      this.keyword="";
      this.showAdvanceSearchView = false;
      this.currentChange(1);
    },
    emptyEmp() {
      this.emp = {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        positionId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: null,
        workID: "",
        contractTerm: null,
        conversionTime: null,
        notworkDate: null,
        beginContract: null,
      }
      this.inputDepName = '';
    },
    showEditEmpView(data) {
      this.$nextTick(() => {
        this.$refs['empForm'].clearValidate()
      })
      this.initPositions();
      this.title = '编辑员工信息';
      this.emp = JSON.parse(JSON.stringify(data));
      this.inputDepName = data.departmentName;
      console.log(this.inputDepName);
      this.dialogVisible = true;
    },
    deleteEmp(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Delete("/api/employee/?id=" + data.id ).then(res => {
          if (res) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddEmp() {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            console.log(this.emp)
            this.Put("/api/employee/", this.emp).then(res => {
              if (res) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            console.log(this.emp)
            this.Post("/api/employee/", this.emp).then(res => {
              if (res) {
                this.$message({
                  message: 'message: 添加成功，工号：'+res.data,
                  type: 'success'
                });
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      }
    },
    handleNodeClick(event, item) {
      this.inputDepName = item.name;
      this.emp.departmentId = item.id;
    },
    initPositions() {
      this.Get('/api/base/getPositions').then(res => {
        if (res) {
          this.positions = res.data;
        }
      })
    },
    getMaxWordID() {
      this.Get("/api/employee/getMaxId").then(res => {
        if (res) {
          this.emp.workID = res.data;
        }
      })
    },
    initData() {
      if (!window.sessionStorage.getItem("nations")) {
        this.Get('/api/base/getNations').then(res => {
          if (res) {
            this.nations = res.data;
            window.sessionStorage.setItem("nations", JSON.stringify(res.data));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      if (!window.sessionStorage.getItem("joblevels")) {
        this.Get('/api/base/getJobLevels').then(res => {
          if (res) {
            this.joblevels = res.data;
            window.sessionStorage.setItem("joblevels", JSON.stringify(res.data));
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.Get('/api/base/getPoliticsstatus').then(res => {
          if (res) {
            this.politicsstatus = res.data;
            window.sessionStorage.setItem("politicsstatus", JSON.stringify(res.data));
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
      if (!window.sessionStorage.getItem("departments")) {
        this.Get('/api/base/getDepartments').then(res => {
          if (res) {
            this.allDeps = res.data;
            window.sessionStorage.setItem("departments", JSON.stringify(res.data));
          }
        })
        console.log(this.allDeps)
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("departments"));
        console.log(this.allDeps)
      }
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    search() {
      this.page = 1;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initEmps('advanced');
    },
    showAddEmpView() {
      this.$nextTick(() => {
        this.$refs['empForm'].clearValidate()
      })
      this.emptyEmp();
      this.title = '添加员工';
      this.getMaxWordID();
      this.dialogVisible = true;
    },
    initEmps(type) {
      this.loading = true;
      let url = '/api/employee/?page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.politicId) {
          url += '&politicId=' + this.searchValue.politicId;
        }
        if (this.searchValue.nationId) {
          url += '&nationId=' + this.searchValue.nationId;
        }
        if (this.searchValue.jobLevelId) {
          url += '&jobLevelId=' + this.searchValue.jobLevelId;
        }
        if (this.searchValue.posId) {
          url += '&posId=' + this.searchValue.posId;
        }
        if (this.searchValue.engageForm) {
          url += '&engageForm=' + this.searchValue.engageForm;
        }
        if (this.searchValue.departmentId) {
          url += '&departmentId=' + this.searchValue.departmentId;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
      } else {
        url += "&name=" + this.keyword;
      }
      this.Get(url).then(res => {
        this.loading = false;
        if (res) {
          this.emps = res.data.list;
          this.total = res.data.total;
        }
      });
    }
  }
}
</script>

<style>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
.el-radio{
  margin-right: 12px;
}
.el-radio__label{
  padding-left: 5px;
}
</style>