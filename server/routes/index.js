const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const verToken = require('../utils/token');

// 解析token获取用户信息
router.use(function(req, res, next) {
	let token = req.headers['Authorization'];
	if(token == undefined){
		return next();
	}else{
		verToken.verToken(token).then((data)=> {
			req.data = data;
			return next();
		}).catch((error)=>{
			return next();
		})
	}
});

//验证token是否过期并规定哪些路由不用验证
router.use(expressJwt({
	secret: verToken.signKey,
	algorithms: ['HS256']
}).unless({
	path: ['/api/verifyCode','/api/login','/api/person/face'] //除了登录和获取验证码，其他的URL都需要验证
}));

//当token失效返回提示信息
router.use(function (err, req, res, next) {
	if (err.status === 401) {
		res.status(401).send("未登录");
	}
})

// 登录相关
const login = require('./login');
// 系统信息
const system = require('./system');
// 个人信息
const person = require('./person');
// 员工信息
const employee = require('./employee');
// 基础信息
const base = require('./base');
// 系统管理
const sys = require('./system/');
// 薪资管理
const salary = require('./salary/');

router.use('/', login);
router.use('/system/', system);
router.use('/person/', person);
router.use('/employee/', employee);
router.use('/base/', base);
router.use('/sys/', sys);
router.use('/salary/', salary);

module.exports = router;
