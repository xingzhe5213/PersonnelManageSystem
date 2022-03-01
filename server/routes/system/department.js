const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {get} /sys/base/department 获取部门列表
 * @apiGroup 系统管理-部门信息
 * @apiDescription 获取部门列表
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
 * @apiSampleRequest /sys/base/department
 * @apiVersion 1.0.0
 */

router.get('/',function(req,res,next){
	db.query('SELECT * FROM department', [],function(info,fields) {
		let result = [], temp = {}, len = info.length
		for(let i = 0; i < len; i++){
			// 以id作为索引存储元素，可以无需遍历直接快速定位元素
			temp[info[i]['id']] = info[i]
		}
		for(let j = 0; j < len; j++){
			let list = info[j]
			list['children'] = []
			// 临时变量里面的当前元素的父元素，即pid的值，与找对应id值
			let sonList = temp[list['parentid']]
			// 如果存在父元素，即如果有pid属性
			if (sonList) {
				// 如果父元素没有children键
				if (!sonList['children']) {
					// 设上父元素的children键
					sonList['children'] = []
				}
				// 给父元素加上当前元素作为子元素
				sonList['children'].push(list)
			}
			// 不存在父元素，意味着当前元素是一级元素
			else {
				result.push(list);
			}
		}
		res.json({
			code: 200,
			message: "成功",
			data: result
		});
	})
});


/**
 * @api {post} /sys/base/department 添加部门
 * @apiGroup 系统管理-部门信息
 * @apiDescription 添加部门
 * @apiHeader {String} authorization token
 * @apiBody {String} name 部门名称
 * @apiBody {Number} parentid 上级部门id
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "市场部",
 *    parentid: 2,
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {object} data  添加的部门信息
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *      data: {}
 *  }
 * @apiSampleRequest /sys/base/department
 * @apiVersion 1.0.0
 */

router.post('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM department WHERE name =?', [req.body.name],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('INSERT INTO department(name,parentid) VALUES (?,?)', [req.body.name,req.body.parentid],function(info,fields) {
				if(info){
					db.query('select * from department where name=?', [req.body.name],function(data,fields) {
						if(data){
							data[0]['children'] = []
							res.json({
								code: 200,
								message: "成功",
								data:data
							});
						}
					})
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
 * @api {delete} /sys/base/department 删除部门
 * @apiGroup 系统管理-部门信息
 * @apiDescription 删除部门
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 部门id
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
 * @apiSampleRequest /sys/base/department
 * @apiVersion 1.0.0
 */

router.delete('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM employee WHERE departmentId =?', [req.query.id],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('DELETE FROM department WHERE id=?', [req.query.id],function(info,fields) {
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