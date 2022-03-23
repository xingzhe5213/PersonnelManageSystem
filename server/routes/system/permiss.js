const express = require('express');
const router = express.Router();
const db = require('../../mysql/mysql.js');

/**
 * @api {get} /sys/base/permiss/roles 角色列表
 * @apiGroup 系统管理-权限管理
 * @apiDescription 获取角色列表
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
 * @apiSampleRequest /sys/base/permiss/roles
 * @apiVersion 1.0.0
 */

router.get('/roles', function (req, res, next) {
	db.query('SELECT * FROM role', [], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
			data: info
		});
	})
});


/**
 * @api {get} /sys/base/permiss/menus 菜单列表
 * @apiGroup 系统管理-权限管理
 * @apiDescription 获取所有菜单
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
 * @apiSampleRequest /sys/base/permiss/menus
 * @apiVersion 1.0.0
 */

router.get('/menus', function (req, res, next) {
	db.query('SELECT * FROM menu', [], function (info, fields) {
		let result = [], temp = {}, len = info.length
		for (let i = 0; i < len; i++) {
			// 以id作为索引存储元素，可以无需遍历直接快速定位元素
			temp[info[i]['id']] = info[i]
		}
		for (let j = 0; j < len; j++) {
			let list = info[j]
			// 临时变量里面的当前元素的父元素，即pid的值，与找对应id值
			let sonList = temp[list['parentId']]
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
 * @api {get} /sys/base/permiss 角色权限
 * @apiGroup 系统管理-权限管理
 * @apiDescription 获取角色权限
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
 * @apiSampleRequest /sys/base/permiss
 * @apiVersion 1.0.0
 */

router.get('/', function (req, res, next) {
	db.query('SELECT mid FROM menu_role WHERE roleid=?', [req.query.rid], function (info, fields) {
		let result = [];
		for (let i = 0; i < info.length; i++) {
			// 以id作为索引存储元素，可以无需遍历直接快速定位元素
			result[i] = info[i].mid;
		}
		res.json({
			code: 200,
			message: "成功",
			data: result
		});
	})
});


/**
 * @api {post} /sys/base/permiss 添加角色
 * @apiGroup 系统管理-权限管理
 * @apiDescription 添加角色
 * @apiHeader {String} authorization token
 * @apiBody {String} name 角色名称（英文）
 * @apiBody {String} nameZH 角色名称（中文）
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "admin",
 *    nameZH: "系统管理员"
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/permiss
 * @apiVersion 1.0.0
 */

router.post('/', function (req, res, next) {
	db.query('SELECT count(*) as count FROM role WHERE name =?', [req.body.name], function (cou, fields) {
		let count = cou[0].count;
		db.query('SELECT count(*) as count FROM role WHERE nameZH =?', [req.body.nameZH], function (cou, fields) {
			let count1 = cou[0].count;
			if (count == 0 && count1 == 0) {
				db.query('INSERT INTO role(name,nameZH) VALUES (?,?)', [req.body.name, req.body.nameZH], function (info, fields) {
					res.json({
						code: 200,
						message: "成功",
					});
				})
			} else {
				res.json({
					code: 201,
					message: "成功"
				});
			}
		})
	})
});


/**
 * @api {put} /sys/base/permiss 修改权限
 * @apiGroup 系统管理-权限管理
 * @apiDescription 修改角色权限
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 角色id
 * @apiBody {Object} mids 菜单id数组
 * @apiParamExample {json} Request-Example:
 * {
 *    id: 1,
 *    mids: [2,3,4]
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/permiss
 * @apiVersion 1.0.0
 */

router.put('/', function (req, res, next) {
	let sql = "INSERT INTO menu_role(roleid,mid) VALUES ";
	for (let i = 0; i < req.body.mids.length; i++) {
		if (i + 1 == req.body.mids.length) {
			sql = sql + "('" + req.body.id + "','" + req.body.mids[i] + "')"
		} else {
			sql = sql + "('" + req.body.id + "','" + req.body.mids[i] + "'),"
		}
	}
	db.query('DELETE FROM menu_role WHERE roleid=?', [req.body.id], function (info, fields) {
		if (info && req.body.mids.length > 0) {
			db.query(sql, [], function (info, fields) {
				res.json({
					code: 200,
					message: "成功",
				});
			})
		} else if (req.body.mids.length == 0) {
			res.json({
				code: 200,
				message: "成功",
			});
		}
	})
});


/**
 * @api {delete} /sys/base/permiss 删除角色
 * @apiGroup 系统管理-权限管理
 * @apiDescription 删除角色
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 角色id
 * @apiParamExample {json} Request-Example:
 * {
 *    id: 2
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/base/permiss
 * @apiVersion 1.0.0
 */

router.delete('/', function (req, res, next) {
	db.query('DELETE role,leader_role,menu_role FROM role LEFT JOIN leader_role ON role.id = leader_role.roleid LEFT JOIN menu_role ON role.id = menu_role.roleid WHERE role.id=?', [req.query.id], function (info, fields) {
		res.json({
			code: 200,
			message: "成功",
		});
	})
});

module.exports = router;