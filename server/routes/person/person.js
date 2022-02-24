const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const db=require('../../mysql/mysql.js');

let userid="";

/**
 * @api {get} /person/info 个人信息
 * @apiGroup 个人信息
 * @apiDescription 获取用户个人信息
 * @apiHeader {String} authorization token
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {object} data 查询的数据
 * @apiSuccessExample {json} 成功回调:
 *  {
 *     code: 200
 *     message: "成功"
 *     data: {}
 *  }
 * @apiSampleRequest /person/info
 * @apiVersion 1.0.0
 */

router.get('/info',function(req,res,next){
	userid=req.user._id;
	db.query('select * from leader where id=?', [req.user._id],function(info,fields) {
		let data=info[0];
		data.password=null;
		db.query('SELECT role.id, role.name, role.nameZH FROM role LEFT JOIN leader_role ON leader_role.roleid = role.id WHERE leader_role.leaderid=? ORDER BY role.id ASC',[info[0].id],function(info_roles,fields) {
			data.roles=info_roles;
			res.json({
				code: 200,
				message: "成功",
				data: data
			});
		})
	})
});


/**
 * @api {put} /person/info 修改信息
 * @apiGroup 个人信息
 * @apiDescription 修改用户个人信息
 * @apiHeader {String} authorization token
 * @apiBody {string} name姓名
 * @apiBody {string} address地址
 * @apiBody {string} phone手机号码
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "李白",
 *       "address": "湖北黄石",
 *       "phone": "15678378739"
 *     }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *     code: 200
 *     message: "成功"
 *  }
 * @apiSampleRequest /person/info
 * @apiVersion 1.0.0
 */

router.put('/info',function(req,res,next){
	db.query('update leader set name=?, phone=?, address=? where id=?', [req.body.name,req.body.phone,req.body.address,req.user._id],function(info,fields) {
		if(info){
			res.json({
				code: 200,
				message: "成功",
			});
		}
	})
});


/**
 * @api {put} /person/passwd 修改密码
 * @apiGroup 个人信息
 * @apiDescription 修改用户登录密码
 * @apiHeader {String} authorization token
 * @apiBody {string} oldpassword原密码
 * @apiBody {string} password新密码
 * @apiParamExample {json} Request-Example:
 *     {
 *       "oldpassword": "E10ADC3949BA59ABBE56E057F20F883E",
 *       "password": "C20AD4D76FE97759AA27A0C99BFF6710"
 *     }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *     code: 200
 *     message: "成功"
 *  }
 * @apiSampleRequest /person/passwd
 * @apiVersion 1.0.0
 */

router.put('/passwd',function(req,res,next){
	console.log(req.body);
	db.query('select password from leader where id=?', [req.user._id],function(info,fields) {
		if (req.body.oldpassword == info[0].password) {
			db.query('update leader set password=? where id=?', [req.body.password,req.user._id],function(info,fields) {
				if(info){
					res.json({
						code: 200,
						message: "成功",
					});
				}
			})
		} else {
			res.json({
				code: -1,
				message: "密码错误！"
			});
		}
	})
});


/**
 * @api {post} /person/face 上传头像
 * @apiGroup 个人信息
 * @apiDescription 修改用户头像
 * @apiHeader {String} authorization token
 * @apiBody {string} name姓名
 * @apiBody {string} address地址
 * @apiBody {string} phone手机号码
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "李白",
 *       "address": "湖北黄石",
 *       "phone": "15678378739"
 *     }
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccessExample {json} 成功回调:
 *  {
 *     code: 200
 *     message: "成功"
 *  }
 * @apiSampleRequest /person/face
 * @apiVersion 1.0.0
 */

router.post('/face', multer({dest: "public/img",}).array("file", 1),
	function (req, res, next) {
		let files = req.files;
		let file = files[0];
		let fileInfo = {};
		let data = Date.now().toString();
		let path = "public/img/" + data + "_" + file.originalname;
		let path2 = "/img/" + data + "_" + file.originalname;
		fs.renameSync("./public/img/" + file.filename, path);
		//获取文件基本信息
		fileInfo.type = file.mimetype;
		fileInfo.name = file.originalname;
		fileInfo.size = file.size;
		fileInfo.path = path;
		db.query('update leader set userface=? where id=?', [path2,userid],function(info,fields) {
			if(info){
				res.json({
					code: 200,
					message: "成功",
					data:fileInfo
				});
			}
		})
	}
);

module.exports = router;