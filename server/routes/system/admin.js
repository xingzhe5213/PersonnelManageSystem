const express = require('express');
const router = express.Router();
const db=require('../../mysql/mysql.js');

/**
 * @api {get} /sys/adm/leader 获取管理员信息
 * @apiGroup 管理员管理
 * @apiDescription 获取管理员信息
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
 * @apiSampleRequest /sys/adm/leader
 * @apiVersion 1.0.0
 */

router.get('/',function(req,res,next){
	let sql = "SELECT * FROM leader WHERE name like '%" + req.query.keyword + "%';";
	db.query(sql, [],function(info,fields) {
		let data=[];
		for (let i=0;i<info.length;i++){
			data[i]=info[i];
			data[i].password=null;
			db.query('SELECT role.id, role.name, role.nameZH FROM role LEFT JOIN leader_role ON leader_role.roleid = role.id WHERE leader_role.leaderid=? ORDER BY role.id ASC',
				[data[i].id],function(info_roles,fields) {
				data[i].roles=info_roles;
				if(i+1==info.length){
					res.json({
						code: 200,
						message: "成功",
						data: data
					});
				}
			})

		}

	})
});


/**
 * @api {put} /sys/adm/leader/roles 修改管理员权限
 * @apiGroup 管理员管理
 * @apiDescription 修改管理员权限
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 管理员id
 * @apiBody {Object} rids 角色id数组
 * @apiParamExample {json} Request-Example:
 * {
 *    id: 1,
 *    rids: [2,3,4]
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/adm/leader/roles
 * @apiVersion 1.0.0
 */

router.put('/roles',function(req,res,next){
	let sql="INSERT INTO leader_role(leaderid,roleid) VALUES ";
	for(let i = 0; i < req.body.rids.length; i++){
		if(i+1==req.body.rids.length){
			sql=sql+"('"+req.body.id+"','"+req.body.rids[i]+"')"
		}else{
			sql=sql+"('"+req.body.id+"','"+req.body.rids[i]+"'),"
		}
	}
	db.query('DELETE FROM leader_role WHERE leaderid=?', [req.body.id],function(info,fields) {
		if(info){
			db.query(sql, [],function(info,fields) {
				res.json({
					code: 200,
					message: "成功",
				});
			})
		}
	})
});


/**
 * @api {post} /sys/adm/leader 添加管理员
 * @apiGroup 管理员管理
 * @apiDescription 添加管理员
 * @apiHeader {String} authorization token
 * @apiBody {String} name 管理员姓名
 * @apiBody {String} username 登录用户名
 * @apiBody {String} phone 管理员手机号
 * @apiBody {String} address 管理员地址
 * @apiParamExample {json} Request-Example:
 * {
 *    name: "李白",
 *    username: "libai",
 *    phone: "15611111111",
 *    address: "湖北黄石"
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/adm/leader
 * @apiVersion 1.0.0
 */

router.post('/',function(req,res,next){
	db.query('SELECT count(*) as count FROM leader WHERE username =?', [req.body.username],function(cou,fields) {
		let count = cou[0].count;
		if(count==0){
			db.query('insert into leader (name,username,phone,address) values (?,?,?,?);', [req.body.name,req.body.username,req.body.phone,req.body.address],function(info,fields) {
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
 * @api {put} /sys/adm/leader 修改账号状态
 * @apiGroup 管理员管理
 * @apiDescription 修改账号状态
 * @apiHeader {String} authorization token
 * @apiBody {String} id 管理员id
 * @apiBody {String} enabled 账号状态
 * @apiParamExample {json} Request-Example:
 * {
 *    id: 2,
 *    enabled: 1
 * }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *      code: 200
 *      message: "成功"
 *  }
 * @apiSampleRequest /sys/adm/leader
 * @apiVersion 1.0.0
 */

router.put('/',function(req,res,next){
	db.query('UPDATE leader SET enabled=? WHERE id=?', [req.body.enabled,req.body.id],function(cou,fields) {
		res.json({
			code: 200,
			message: "成功"
		});
	})
});


/**
 * @api {delete} /sys/adm/leader 删除管理员
 * @apiGroup 管理员管理
 * @apiDescription 删除管理员
 * @apiHeader {String} authorization token
 * @apiBody {Number} id 管理员id
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
 * @apiSampleRequest /sys/adm/leader
 * @apiVersion 1.0.0
 */

router.delete('/',function(req,res,next){
	db.query('DELETE FROM leader WHERE id=?', [req.query.id],function(info,fields) {
		if(info){
			res.json({
				code: 200,
				message: "成功"
			});
		}
	})
});

module.exports = router;