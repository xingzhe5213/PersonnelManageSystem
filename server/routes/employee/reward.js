const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');
const date = require("silly-datetime");

/**
 * @api {get} /employee/reward 查询奖惩记录
 * @apiGroup 人事管理-员工奖惩
 * @apiDescription 查询奖惩记录
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
 * @apiSampleRequest /employee/reward
 * @apiVersion 1.0.0
 */

let count=0;
let dataList=null;
router.get('/',function(req,res,next){
	let page=req.query.page;
	let size=req.query.size;
	let sql="SELECT " +
		"r.id, " +
		"r.eid, " +
		"r.rpMoney, " +
		"r.rpType, " +
		"left(r.rpDate,10) as rpDate, " +
		"r.rpReason, " +
		"e.name, " +
		"e.workID " +
		"FROM " +
		"employeerp r " +
		"LEFT JOIN employee e ON " +
		"r.eid = e.workID;";

	if(page==1||dataList==null){
		db.query("SELECT count(*) as count FROM employeerp r LEFT JOIN employee e ON r.eid = e.workID", [],function(cou,fields) {
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
 * @api {post} /employee/reward 添加奖惩记录
 * @apiGroup 人事管理-员工奖惩
 * @apiDescription 添加奖惩记录
 * @apiHeader {String} authorization token
 * @apiBody {number} eid 员工id
 * @apiBody {number} rpMoney 奖惩金额
 * @apiBody {number} rpType 奖惩类型
 * @apiBody {string} rpReason 奖惩原因
 * @apiParamExample {json} Request-Example:
 * {
 *    eid:3,
 *    rpMoney:200,
 *    rpType:0,
 *    rpReason:"",
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /employee/reward
 * @apiVersion 1.0.0
 */

router.post('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM employee WHERE workID =?', [req.body.eid],function(cou,fields) {
		let count = cou[0].count;
		if(count==1){
			db.query('INSERT INTO employeerp(eid, rpMoney, rpType, rpDate, rpReason) VALUES (?,?,?,?,?)', [req.body.eid, req.body.rpMoney, req.body.rpType, date.format(new Date(),'YYYY-MM-DD'), req.body.rpReason],function(info,fields) {
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
 * @api {delete} /employee/reward 删除奖惩记录
 * @apiGroup 人事管理-员工奖惩
 * @apiDescription 删除奖惩记录
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /employee/reward
 * @apiVersion 1.0.0
 */

router.delete('/',function(req,res,next){
	db.query('DELETE FROM employeerp WHERE id=?', [req.query.id],function(info,fields) {
		if(info){
			dataList=null;
			res.json({
				code: 200,
				message: "成功",
			});
		}
	})
});

module.exports = router;