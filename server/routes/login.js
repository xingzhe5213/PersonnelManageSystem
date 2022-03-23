const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const verToken = require('../utils/token');
const db=require('../mysql/mysql.js');

let verifyCode = "";

/**
 * @api {get} /verifyCode 获取验证码
 * @apiGroup 登录相关
 * @apiDescription 获取验证码
 * @apiSuccess {number} code 返回200为成功
 * @apiSuccess {string} message  响应状态
 * @apiSuccess {string} data 返回的验证码svg格式图片数据
 * @apiSampleRequest /verifyCode
 * @apiVersion 1.0.0
 */

router.get('/verifyCode',function(req,res,next){
  const captcha = svgCaptcha.create({
    color: true,     // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    inverse:false,   // 反转颜色
    background: '#eee',    // 验证码图片背景颜色
    width:100,   //  宽度
    height:40,   // 高度
    fontSize:48, // 字体大小
    size:4,      // 验证码的长度
    noise:5,     // 干扰线条的数量
    ignoreChars: '0oO1ilI' // 验证码字符中排除 0oO1ilI 等较难识别的
  });
  verifyCode = captcha.text.toLowerCase()
  res.json({
    code:200,
    message:"成功",
    data:captcha.data
  });
});


/**
 * @api {post} /login 登录
 * @apiGroup 登录相关
 * @apiDescription 登录系统
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
 * @apiSuccess {object} data 返回的数据
 * @apiSuccess {string} token 令牌
 * @apiSampleRequest /login
 * @apiVersion 1.0.0
 */

router.post('/login',function(req,res,next){
  if(req.body.code==verifyCode){
    db.query('select * from leader where username=?', [req.body.username],function(info,fields) {
      if (info=='') {
        res.json({
          code: -1,
          message: "用户名不存在！"
        });
      } else if (req.body.password == info[0].password&&info[0].enabled==1) {
        let data=info[0];
        data.password=null;
        db.query('SELECT role.id, role.name, role.nameZH FROM role LEFT JOIN leader_role ON leader_role.roleid = role.id WHERE leader_role.leaderid=? ORDER BY role.id ASC',
            [info[0].id],function(info_roles,fields) {
          data.roles=info_roles;
          verToken.setToken(info[0].username,info[0].id).then((token)=> {
            res.json({
              code: 200,
              message: "登陆成功",
              token: token,
              data: data
            });
          })
        })
      }else if(req.body.password == info[0].password&&info[0].enabled==0){
        res.json({
          code: 201,
          message: "账号已禁用！"
        });
      } else {
        res.json({
          code: -1,
          message: "密码错误！"
        });
      }
    })
  }else{
    res.json({
      code:-1,
      message:"验证码错误"
    });
  }
});

module.exports = router;
