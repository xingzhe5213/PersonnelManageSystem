const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {get} /salary/staffSalary 员工基本工资
 * @apiGroup 薪资管理-员工工资
 * @apiDescription 获取员工基本工资
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {object} data 查询的数据
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *      data: {}
 *  }
 * @apiSampleRequest /salary/staffSalary
 * @apiVersion 1.0.0
 */

let count=0;
let dataList=null;
router.get('/',function(req,res,next){
	let page=req.query.page;
	let size=req.query.size;
	let sql="SELECT " +
		"e.id, " +
		"e.name, " +
		"e.email, " +
		"e.phone, " +
		"e.workID, " +
		"e.departmentId, " +
		"d.name AS departmentName, " +
		"e.salaryId, " +
		"s.name AS salaryName, " +
		"s.basicSalary, " +
		"s.lunchSalary, " +
		"s.trafficSalary, " +
		"s.pensionBase, " +
		"s.pensionPer, " +
		"s.medicalBase, " +
		"s.medicalPer, " +
		"s.accumulationFundBase, " +
		"s.accumulationFundPer " +
		"FROM employee e " +
		"LEFT JOIN department d " +
		"ON e.departmentId = d.id " +
		"LEFT JOIN salary s " +
		"ON e.salaryId = s.id";

	if(page==1||dataList==null){
		db.query("SELECT count(*) as count FROM employee e LEFT JOIN department d ON e.departmentId = d.id LEFT JOIN salary s ON e.salaryId = s.id", [],function(cou,fields) {
			count=cou[0].count;
			db.query(sql,[],function(info,fields) {
				if(info){
					dataList=info;
					res.json({
						code: 200,
						message: "成功",
						data: {
							list: dataList.slice((page-1)*size,page*size),
							page: Number(page),
							pages: count/size,
							size: Number(size),
							total: count
						}
					});
				}
			})
		})
	}else{
		res.json({
			code: 200,
			message: "成功",
			data: {
				list: dataList.slice((page-1)*size,page*size),
				page: Number(page),
				pages: count/size,
				size: Number(size),
				total: count
			}
		});
	}
});


/**
 * @api {get} /salary/staffSalary/salaries 基本工资
 * @apiGroup 薪资管理-员工工资
 * @apiDescription 获取所有基本工资
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {object} data 查询的数据
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *      data: {}
 *  }
 * @apiSampleRequest /salary/staffSalary/salaries
 * @apiVersion 1.0.0
 */

router.get('/salaries',function(req,res,next){
	db.query("SELECT * FROM salary",[],function(info,fields) {
		if(info){
			res.json({
				code: 200,
				message: "成功",
				data: info
			});
		}
	})
});


/**
 * @api {put} /salary/staffSalary 修改员工基本工资
 * @apiGroup 薪资管理-员工工资
 * @apiDescription 修改员工基本工资
 * @apiHeader {String} authorization token
 * @apiBody {number} eid 员工id
 * @apiBody {number} sid 基本工资id
 * @apiParamExample {json} Request-Example:
 * {
 *    eid:3,
 *    sid:5,
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /salary/staffSalary
 * @apiVersion 1.0.0
 */

router.put('/',function(req,res,next){
	db.query("UPDATE employee SET salaryId=? WHERE id=?",[req.body.sid,req.body.eid],function(info,fields) {
		if(info){
			res.json({
				code: 200,
				message: "成功"
			});
		}
	})
});

module.exports = router;