const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {get} /sys/base/position 获取职位列表
 * @apiGroup 系统管理-职位信息
 * @apiDescription 获取职位列表
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
 * @apiSampleRequest /sys/base/position
 * @apiVersion 1.0.0
 */

router.get('/',function(req,res,next){
	db.query('SELECT * FROM position', [],function(info,fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});


/**
 * @api {post} /sys/base/position 添加职位
 * @apiGroup 系统管理-职位信息
 * @apiDescription 添加职位
 * @apiHeader {String} authorization token
 * @apiBody {String} name 职位名称
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "工程师",
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/position
 * @apiVersion 1.0.0
 */

router.post('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM position WHERE name =?', [req.body.name],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('insert into `position` (name) values (?);', [req.body.name],function(info,fields) {
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
 * @api {put} /sys/base/position 修改职位信息
 * @apiGroup 系统管理-职位信息
 * @apiDescription 修改职位信息
 * @apiHeader {String} authorization token
 * @apiBody {String} name 职位名称
 * @apiBody {Boolean} enabled 是否启用
 * @apiBody {Number} id 职位id
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "工程师",
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
 * @apiSampleRequest /sys/base/position
 * @apiVersion 1.0.0
 */

router.put('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM position WHERE name =? and id<>?', [req.body.name,req.body.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('UPDATE `position` SET name=?,enabled=? WHERE id=?', [req.body.name,req.body.enabled,req.body.id],function(info,fields) {
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
 * @api {delete} /sys/base/position 删除职位
 * @apiGroup 系统管理-职位信息
 * @apiDescription 删除职位
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 职位id
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
 * @apiSampleRequest /sys/base/position
 * @apiVersion 1.0.0
 */

router.delete('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM employee WHERE positionId=?', [req.query.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('DELETE FROM `position` WHERE id=?', [req.query.id],function(info,fields) {
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