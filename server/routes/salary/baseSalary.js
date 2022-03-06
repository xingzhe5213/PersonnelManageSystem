const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {get} /salary/baseSalary 基本工资
 * @apiGroup 薪资管理-基础工资
 * @apiDescription 获取基本工资
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
 * @apiSampleRequest /salary/baseSalary
 * @apiVersion 1.0.0
 */

let count=0;
let dataList=null;
router.get('/',function(req,res,next){
	let page=req.query.page;
	let size=req.query.size;
	if(page==1||dataList==null){
		db.query("SELECT count(*) as count FROM salary", [],function(cou,fields) {
			count=cou[0].count;
			db.query("SELECT * FROM salary",[],function(info,fields) {
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
 * @api {post} /salary/baseSalary 添加基本工资
 * @apiGroup 薪资管理-基础工资
 * @apiDescription 添加基本工资
 * @apiHeader {String} authorization token
 * @apiBody {string} name 基本工资名称
 * @apiBody {number} basicSalary 基本工资
 * @apiBody {number} lunchSalary 餐补
 * @apiBody {number} trafficSalary 交通补贴
 * @apiBody {number} pensionBase 养老金基数
 * @apiBody {number} pensionPer 养老金比率
 * @apiBody {number} medicalBase 养老保险基数
 * @apiBody {number} medicalPer 养老保险比率
 * @apiBody {number} accumulationFundBase 公积金基数
 * @apiBody {number} accumulationFundPer 公积金比率
 * @apiParamExample {json} Request-Example:
 * {
 *    name:"财务部基本工资",
 *    basicSalary:"5000",
 *    lunchSalary:"500",
 *    trafficSalary:"600",
 *    pensionBase:"2000",
 *    pensionPer:"0.07",
 *    medicalBase:"2000",
 *    medicalPer:"0.07",
 *    accumulationFundBase:"2000",
 *    accumulationFundPer:"0.07"
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /salary/baseSalary
 * @apiVersion 1.0.0
 */

router.post('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM salary WHERE name =?', [req.body.name],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('INSERT INTO salary(name,basicSalary,lunchSalary,trafficSalary,pensionBase,pensionPer,medicalBase,medicalPer,accumulationFundBase,accumulationFundPer) VALUES (?,?,?,?,?,?,?,?,?,?)',
				[req.body.name,req.body.basicSalary,req.body.lunchSalary,req.body.trafficSalary,req.body.pensionBase,req.body.pensionPer,
					req.body.medicalBase,req.body.medicalPer,req.body.accumulationFundBase,req.body.accumulationFundPer],function(info,fields) {
				if(info){
					dataList=null;
					res.json({
						code: 200,
						message: "成功"
					});
				}
			})
		}else{
			res.json({
				code: 201,
				message: "成功"
			});
		}
	})
});


/**
 * @api {put} /salary/baseSalary 修改基本工资
 * @apiGroup 薪资管理-基础工资
 * @apiDescription 修改基本工资
 * @apiHeader {String} authorization token
 * @apiBody {number} id 基本工资id
 * @apiBody {string} name 基本工资名称
 * @apiBody {number} basicSalary 基本工资
 * @apiBody {number} lunchSalary 餐补
 * @apiBody {number} trafficSalary 交通补贴
 * @apiBody {number} pensionBase 养老金基数
 * @apiBody {number} pensionPer 养老金比率
 * @apiBody {number} medicalBase 养老保险基数
 * @apiBody {number} medicalPer 养老保险比率
 * @apiBody {number} accumulationFundBase 公积金基数
 * @apiBody {number} accumulationFundPer 公积金比率
 * @apiParamExample {json} Request-Example:
 * {
 *    id:"2",
 *    name:"财务部基本工资",
 *    basicSalary:"5000",
 *    lunchSalary:"500",
 *    trafficSalary:"600",
 *    pensionBase:"2000",
 *    pensionPer:"0.07",
 *    medicalBase:"2000",
 *    medicalPer:"0.07",
 *    accumulationFundBase:"2000",
 *    accumulationFundPer:"0.07"
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /salary/baseSalary
 * @apiVersion 1.0.0
 */

router.put('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM salary WHERE name =? and id<>?', [req.body.name,req.body.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('UPDATE salary SET name=?,basicSalary=?,lunchSalary=?,trafficSalary=?,pensionBase=?,pensionPer=?,medicalBase=?,medicalPer=?,accumulationFundBase=?,accumulationFundPer=? WHERE id=?',
				[req.body.name,req.body.basicSalary,req.body.lunchSalary,req.body.trafficSalary,req.body.pensionBase,req.body.pensionPer,
					req.body.medicalBase,req.body.medicalPer,req.body.accumulationFundBase,req.body.accumulationFundPer,req.body.id],function(info,fields) {
				if(info){
					dataList=null;
					res.json({
						code: 200,
						message: "成功"
					});
				}
			})
		}else{
			res.json({
				code: 201,
				message: "成功"
			});
		}
	})
});


/**
 * @api {delete} /salary/baseSalary 修改基本工资
 * @apiGroup 薪资管理-基础工资
 * @apiDescription 修改基本工资
 * @apiHeader {String} authorization token
 * @apiBody {number} id 基本工资id
 * @apiParamExample {json} Request-Example:
 * {
 *    id:"2",
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /salary/baseSalary
 * @apiVersion 1.0.0
 */

router.delete('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM employee WHERE salaryId=?', [req.query.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('DELETE FROM salary WHERE id=?', [req.query.id],function(info,fields) {
				if(info){
					dataList=null;
					res.json({
						code: 200,
						message: "成功"
					});
				}
			})
		}else{
			res.json({
				code: 201,
				message: "成功"
			});
		}
	})
});

module.exports = router;