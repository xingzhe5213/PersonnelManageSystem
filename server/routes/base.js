const express = require('express');
const router = express.Router();
const db = require('../mysql/mysql.js');

/**
 * @api {get} /base/getNations 获取民族列表
 * @apiGroup 基础信息
 * @apiDescription 获取民族列表
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
 * @apiSampleRequest /base/getNations
 * @apiVersion 1.0.0
 */

router.get('/getNations', function (req, res, next) {
	db.query("SELECT * FROM nation", [], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});


/**
 * @api {get} /base/getJobLevels 获取职位等级列表
 * @apiGroup 基础信息
 * @apiDescription 获取职位等级列表
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
 * @apiSampleRequest /base/getJobLevels
 * @apiVersion 1.0.0
 */

router.get('/getJobLevels', function (req, res, next) {
	db.query('SELECT * FROM joblevel', [], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});

/**
 * @api {get} /base/getPoliticsstatus 获取政治面貌列表
 * @apiGroup 基础信息
 * @apiDescription 获取政治面貌列表
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
 * @apiSampleRequest /base/getPoliticsstatus
 * @apiVersion 1.0.0
 */

router.get('/getPoliticsstatus', function (req, res, next) {
	db.query('SELECT * FROM politicsstatus', [], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});

/**
 * @api {get} /base/getDepartments 获取部门列表
 * @apiGroup 基础信息
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
 * @apiSampleRequest /base/getDepartments
 * @apiVersion 1.0.0
 */

router.get('/getDepartments', function (req, res, next) {
	db.query('SELECT * FROM department', [], function (info, fields) {
		let result = [], temp = {}, len = info.length
		for (let i = 0; i < len; i++) {
			// 以id作为索引存储元素，可以无需遍历直接快速定位元素
			temp[info[i]['id']] = info[i]
		}
		for (let j = 0; j < len; j++) {
			let list = info[j]
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
 * @api {get} /base/getPositions 获取职位列表
 * @apiGroup 基础信息
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
 * @apiSampleRequest /base/getPositions
 * @apiVersion 1.0.0
 */

router.get('/getPositions', function (req, res, next) {
	db.query('SELECT * FROM position', [], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});

module.exports = router;