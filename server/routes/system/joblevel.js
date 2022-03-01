const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {get} /sys/base/jobLevel 获取职称列表
 * @apiGroup 系统管理-职称信息
 * @apiDescription 获取职称列表
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
 * @apiSampleRequest /sys/base/jobLevel
 * @apiVersion 1.0.0
 */

router.get('/',function(req,res,next){
	db.query('SELECT * FROM joblevel', [],function(info,fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});


/**
 * @api {post} /sys/base/jobLevel 添加职称
 * @apiGroup 系统管理-职称信息
 * @apiDescription 添加职称
 * @apiHeader {String} authorization token
 * @apiBody {String} name 职称名称
 * @apiBody {String} titleLevel 职称级别
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "高级工程师",
 *    titleLevel: "高级"
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/jobLevel
 * @apiVersion 1.0.0
 */

router.post('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM jobLevel WHERE name =?', [req.body.name],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('insert into jobLevel (name,titleLevel) values (?,?);', [req.body.name,req.body.titleLevel],function(info,fields) {
				if(info){
					res.json({
						code: 200,
						message: "成功",
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
 * @api {put} /sys/base/jobLevel 修改职称信息
 * @apiGroup 系统管理-职称信息
 * @apiDescription 修改职称信息
 * @apiHeader {String} authorization token
 * @apiBody {String} name 职称名称
 * @apiBody {String} titleLevel 职称等级
 * @apiBody {Boolean} enabled 是否启用
 * @apiBody {Number} id 职称id
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "高级工程师",
 *    titleLevel:"高级"
 *    enabled: true,
 *    id:2
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/jobLevel
 * @apiVersion 1.0.0
 */

router.put('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM jobLevel WHERE name =? and id<>?', [req.body.name,req.body.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('UPDATE jobLevel SET name=?,titleLevel=?,enabled=? WHERE id=?', [req.body.name,req.body.titleLevel,req.body.enabled,req.body.id],function(info,fields) {
				if(info){
					res.json({
						code: 200,
						message: "成功",
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
 * @api {delete} /sys/base/jobLevel 删除职称
 * @apiGroup 系统管理-职称信息
 * @apiDescription 删除职称
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 职称id
 * @apiParamExample {json} Request-Example:
 * {
 *    id:2
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/jobLevel
 * @apiVersion 1.0.0
 */

router.delete('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM employee WHERE jobLevelId=?', [req.query.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('DELETE FROM jobLevel WHERE id=?', [req.query.id],function(info,fields) {
				if(info){
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