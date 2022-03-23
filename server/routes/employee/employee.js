const express = require('express');
const router = express.Router();
const db = require('../../mysql/mysql.js');
const date = require("silly-datetime");

/**
 * @api {get} /employee/ 查询员工
 * @apiGroup 人事管理-员工信息
 * @apiDescription 获取员工信息
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {object} data 查询的数据
 * @apiSuccessExample {json} 成功回调:
 *  {
 * code: 200
 * message: "成功"
 * data: {}
 *  }
 * @apiSampleRequest /employee/
 * @apiVersion 1.0.0
 */

let count = 0;
let dataList = null;
router.get('/', function (req, res, next) {
	let page = req.query.page;
	let size = req.query.size;
	let sql = "FROM " +
		"employee e, " +
		"nation n, " +
		"politicsstatus p, " +
		"department d, " +
		"joblevel j, " +
		"position pos " +
		"WHERE " +
		"e.nationId = n.id AND e.politicId = p.id AND e.departmentId = d.id AND e.jobLevelId = j.id AND e.positionId = pos.id";
	let sql1 = "SELECT count(*) as count ";
	let sql2 = "SELECT " +
		"e.id, " +
		"e.name, " +
		"e.gender, " +
		"left(e.birthday,10) AS birthday, " +
		"e.idCard, " +
		"e.wedlock, " +
		"e.nationId, " +
		"e.nativePlace, " +
		"e.politicId, " +
		"e.email, " +
		"e.phone, " +
		"e.address, " +
		"e.departmentId, " +
		"e.jobLevelId, " +
		"e.positionId, " +
		"e.engageForm, " +
		"e.tiptopDegree, " +
		"e.specialty, " +
		"e.school, " +
		"left(e.beginDate,10) AS beginDate, " +
		"e.workState, " +
		"e.workID, " +
		"e.contractTerm, " +
		"left(e.conversionTime,10) AS conversionTime, " +
		"left(e.notWorkDate,10) AS notWorkDate, " +
		"left(e.beginContract,10) AS beginContract, " +
		"p.name AS politicName, " +
		"n.name AS nationName, " +
		"d.name AS departmentName, " +
		"j.name AS jobLevelName, " +
		"pos.name AS positionName ";

	if (req.query.name != null && req.query.name != '') {
		sql = sql + " and e.name like '%" + req.query.name + "%'";
	}
	if (req.query.politicId != null) {
		sql = sql + " and e.politicId =" + req.query.politicId;
	}
	if (req.query.nationId != null) {
		sql = sql + " and e.nationId =" + req.query.nationId;
	}
	if (req.query.departmentId != null) {
		sql = sql + " and e.departmentId =" + req.query.departmentId;
	}
	if (req.query.jobLevelId != null) {
		sql = sql + " and e.jobLevelId =" + req.query.jobLevelId;
	}
	if (req.query.engageForm != null && req.query.engageForm != '') {
		sql = sql + " and e.engageForm ='" + req.query.engageForm + "'";
	}
	if (req.query.positionId != null) {
		sql = sql + " and e.positionId =" + req.query.positionId;
	}
	if (req.query.beginDateScope != null) {
		let str = req.query.beginDateScope.split(",");
		sql = sql + " and e.beginDate between '" + str[0] + "' and '" + str[1] + "'";
	}
	sql = sql + " order by e.id desc";

	if (page == 1 || dataList == null) {
		db.query(sql1 + sql, [], function (cou, fields) {
			count = cou[0].count;
			db.query(sql2 + sql, [], function (info, fields) {
				if (info) {
					dataList = info;
					res.json({
						code: 200,
						message: "成功",
						data: {
							list: dataList.slice((page - 1) * size, page * size),
							page: Number(page),
							pages: count / size,
							size: Number(size),
							total: count
						}
					});
				}
			})
		})
	} else {
		res.json({
			code: 200,
			message: "成功",
			data: {
				list: dataList.slice((page - 1) * size, page * size),
				page: Number(page),
				pages: count / size,
				size: Number(size),
				total: count
			}
		});
	}
});


/**
 * @api {get} /employee/getMaxId 获取待添加员工id
 * @apiGroup 人事管理-员工信息
 * @apiDescription 获取待添加员工id
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {number} data 待添加员工id
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *      data: "10010"
 *  }
 * @apiSampleRequest /employee/getMaxId
 * @apiVersion 1.0.0
 */

router.get('/getMaxId', function (req, res, next) {
	db.query('select max(workID) as maxWorkId from employee', [], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
			data: Number(info[0].maxWorkId) + 1
		});

	})
});

/**
 * @api {post} /employee/ 添加员工
 * @apiGroup 人事管理-员工信息
 * @apiDescription 添加新员工
 * @apiHeader {String} authorization token
 * @apiBody {string} name 姓名
 * @apiBody {string} gender 性别
 * @apiBody {date} birthday 出生日期
 * @apiBody {string} idCard 身份证号
 * @apiBody {string} wedlock 婚姻状况
 * @apiBody {number} nationId 民族id
 * @apiBody {string} nativePlace 籍贯
 * @apiBody {number} politicId 政治面貌id
 * @apiBody {string} email 邮箱
 * @apiBody {string} phone 联系电话
 * @apiBody {string} address 联系地址
 * @apiBody {number} departmentId 所属部门id
 * @apiBody {number} jobLevelId 职称id
 * @apiBody {number} positionId 职位id
 * @apiBody {string} engageForm 聘用形式
 * @apiBody {string} tiptopDegree 最高学历
 * @apiBody {string} specialty 所学专业
 * @apiBody {string} school 毕业院校
 * @apiBody {date} beginDate 入职日期
 * @apiBody {string} workState 在职状态
 * @apiBody {string} workID 员工工号
 * @apiBody {number} contractTerm 合同期限
 * @apiBody {date} conversionTime 转正日期
 * @apiBody {date} notWorkDate 离职日期
 * @apiBody {date} beginContract 入职日期
 * @apiParamExample {json} Request-Example:
 * {
 *    name: '李志凌',
 *    gender: '男',
 *    birthday: '1963-05-10',
 *    idCard: '330108196305100811',
 *    wedlock: '已婚',
 *    nationId: 34,
 *    nativePlace: '黑龙江齐齐哈尔',
 *    politicId: 1,
 *    email: '3549473730@qq.com',
 *    phone: '13008813062',
 *    address: '黑龙江省齐齐哈尔市******34号',
 *    departmentId: 3,
 *    jobLevelId: 2,
 *    positionId: 2,
 *    engageForm: '劳动合同',
 *    tiptopDegree: '博士',
 *    specialty: '地质工程',
 *    school: '中国地质大学(武汉)',
 *    beginDate: '2021-03-22',
 *    workState: '在职',
 *    workID: '10100',
 *    contractTerm: 4,
 *    conversionTime: null,
 *    notWorkDate: null,
 *    beginContract: '2021-03-22',
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {string} data  新员工工号
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *      data: "10011"
 *  }
 * @apiSampleRequest /employee/
 * @apiVersion 1.0.0
 */

router.post('/', function (req, res, next) {
	let notWorkDate = req.body.notWorkDate;
	let beginDate = req.body.beginDate;
	let contractTerm = req.body.contractTerm;
	let conversionTime = req.body.conversionTime;
	let beginContract = req.body.beginContract;

	if (notWorkDate == "") {
		notWorkDate = null;
	}
	if (beginDate == "") {
		beginDate = null;
	}
	if (contractTerm == "") {
		contractTerm = null;
	}
	if (conversionTime == "") {
		conversionTime = null;
	}
	if (beginContract == "") {
		beginContract = null;
	}

	db.query('INSERT INTO employee(name, gender, birthday, idCard, wedlock, nationId, nativePlace, politicId, email, phone, address, departmentId, jobLevelId, positionId, engageForm, tiptopDegree, specialty, school, beginDate, workState, workID, contractTerm, conversionTime, notWorkDate, beginContract) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
		[req.body.name, req.body.gender, req.body.birthday, req.body.idCard, req.body.wedlock, req.body.nationId,
			req.body.nativePlace, req.body.politicId, req.body.email, req.body.phone, req.body.address, req.body.departmentId,
			req.body.jobLevelId, req.body.positionId, req.body.engageForm, req.body.tiptopDegree, req.body.specialty, req.body.school,
			beginDate, req.body.workState, req.body.workID, contractTerm, conversionTime, notWorkDate,
			beginContract], function (info, fields) {
			if (info) {
				dataList = null;
				res.json({
					code: 200,
					message: "成功",
					data: req.body.workID
				});
			}
		})
});

/**
 * @api {put} /employee/ 修改员工信息
 * @apiGroup 人事管理-员工信息
 * @apiDescription 修改员工信息
 * @apiHeader {String} authorization token
 * @apiBody {number} id id
 * @apiBody {string} name 姓名
 * @apiBody {string} gender 性别
 * @apiBody {date} birthday 出生日期
 * @apiBody {string} idCard 身份证号
 * @apiBody {string} wedlock 婚姻状况
 * @apiBody {number} nationId 民族id
 * @apiBody {string} nativePlace 籍贯
 * @apiBody {number} politicId 政治面貌id
 * @apiBody {string} email 邮箱
 * @apiBody {string} phone 联系电话
 * @apiBody {string} address 联系地址
 * @apiBody {number} departmentId 所属部门id
 * @apiBody {number} jobLevelId 职称id
 * @apiBody {number} positionId 职位id
 * @apiBody {string} engageForm 聘用形式
 * @apiBody {string} tiptopDegree 最高学历
 * @apiBody {string} specialty 所学专业
 * @apiBody {string} school 毕业院校
 * @apiBody {date} beginDate 入职日期
 * @apiBody {string} workState 在职状态
 * @apiBody {string} workID 员工工号
 * @apiBody {number} contractTerm 合同期限
 * @apiBody {date} conversionTime 转正日期
 * @apiBody {date} notWorkDate 离职日期
 * @apiBody {date} beginContract 入职日期
 * @apiParamExample {json} Request-Example:
 * {
 *    id: 100,
 *    name: '李志凌',
 *    gender: '男',
 *    birthday: '1963-05-10',
 *    idCard: '330108196305100811',
 *    wedlock: '已婚',
 *    nationId: 34,
 *    nativePlace: '黑龙江齐齐哈尔',
 *    politicId: 1,
 *    email: '3549473730@qq.com',
 *    phone: '13008813062',
 *    address: '黑龙江省齐齐哈尔市******34号',
 *    departmentId: 3,
 *    jobLevelId: 2,
 *    positionId: 2,
 *    engageForm: '劳动合同',
 *    tiptopDegree: '博士',
 *    specialty: '地质工程',
 *    school: '中国地质大学(武汉)',
 *    beginDate: '2021-03-22',
 *    workState: '在职',
 *    workID: '10100',
 *    contractTerm: 4,
 *    conversionTime: null,
 *    notWorkDate: null,
 *    beginContract: '2021-03-22',
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /employee/
 * @apiVersion 1.0.0
 */

router.put('/', function (req, res, next) {
	let notWorkDate = req.body.notWorkDate;
	let beginDate = req.body.beginDate;
	let workState = req.body.workState;
	let contractTerm = req.body.contractTerm;
	let conversionTime = req.body.conversionTime;
	let beginContract = req.body.beginContract;

	if (workState == "离职" && notWorkDate == null) {
		notWorkDate = date.format(new Date(), 'YYYY-MM-DD');
	} else if (workState == "在职" && notWorkDate != null && beginDate != null) {
		notWorkDate = null;
		beginDate = date.format(new Date(), 'YYYY-MM-DD');
	}
	if (contractTerm == "") {
		contractTerm = null;
	}
	if (conversionTime == "") {
		conversionTime = null;
	}
	if (beginContract == "") {
		beginContract = null;
	}

	db.query('UPDATE employee SET name=?,gender=?,birthday=?,idCard=?,wedlock=?,nationId=?,nativePlace=?,politicId=?,' +
		'email=?,phone=?,address=?,departmentId=?,jobLevelId=?,positionId=?,engageForm=?,tiptopDegree=?,specialty=?,school=?,' +
		'beginDate=?,workState=?,workID=?,contractTerm=?,conversionTime=?,notWorkDate=?,beginContract=? WHERE id=?',
		[req.body.name, req.body.gender, req.body.birthday, req.body.idCard, req.body.wedlock, req.body.nationId,
			req.body.nativePlace, req.body.politicId, req.body.email, req.body.phone, req.body.address, req.body.departmentId,
			req.body.jobLevelId, req.body.positionId, req.body.engageForm, req.body.tiptopDegree, req.body.specialty, req.body.school,
			beginDate, workState, req.body.workID, contractTerm, conversionTime, notWorkDate,
			beginContract, req.body.id], function (info, fields) {
			if (info) {
				dataList = null;
				res.json({
					code: 200,
					message: "成功"
				});
			}

		})
});

/**
 * @api {delete} /employee/ 删除员工
 * @apiGroup 人事管理-员工信息
 * @apiDescription 删除员工
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /employee/
 * @apiVersion 1.0.0
 */

router.delete('/', function (req, res, next) {
	db.query('DELETE FROM employee WHERE id=?', [req.query.id], function (info, fields) {
		if (info) {
			dataList = null;
			res.json({
				code: 200,
				message: "成功",
			});
		}
	})
});

module.exports = router;