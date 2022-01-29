const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {post} /system/menus 获取菜单
 * @apiDescription 获取用户菜单
 * @apiName menus
 * @apiGroup 系统信息
 * @apiBody {string} username用户名
 * @apiBody {string} password密码
 * @apiBody {string} code验证码
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "admin",
 *       "password": "123456",
 *       "code": "qwer"
 *     }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {object} data 查询的数据
 * @apiSuccess {string} token 令牌
 * @apiSuccessExample {json} 成功回调:
 *  {
 *     code: 200
 *     message: "登陆成功"
 *     data: {}
 *     token: ""
 *  }
 * @apiSampleRequest /system/menus
 * @apiVersion 1.0.0
 */

router.get('/menus',function(req,res,next){
	let sql="SELECT DISTINCT menu.* " +
		"FROM menu " +
		" LEFT JOIN menu_role ON menu.id = menu_role.mid " +
		" LEFT JOIN leader_role ON menu_role.roleid = leader_role.roleid " +
		"WHERE menu.id IN ( " +
		"  SELECT DISTINCT menu.parentId " +
		"  FROM menu, menu_role, leader_role " +
		"  WHERE menu.id = menu_role.mid " +
		"   AND menu_role.roleid = leader_role.roleid " +
		"   AND leader_role.leaderid = ? " +
		" ) " +
		" OR leader_role.leaderid = ? " +
		"ORDER BY menu.id ASC;"
	db.query(sql, [req.user._id,req.user._id],function(info,fields) {
		let result = [], temp = {}, len = info.length
		for(let i = 0; i < len; i++){
			// 以id作为索引存储元素，可以无需遍历直接快速定位元素
			temp[info[i]['id']] = info[i]
		}
		for(let j = 0; j < len; j++){
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
		res.json(result);
	})
});

module.exports = router;