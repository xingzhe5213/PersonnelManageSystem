const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const verToken = require('../utils/token');

// 解析token获取用户信息
router.use(function(req, res, next) {
	let token = req.headers['Authorization'];
	// console.log(req.headers);
	// console.log(token)
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
	path: ['/api/verifyCode','/api/login'] //除了登录和获取验证码，其他的URL都需要验证
}));

//当token失效返回提示信息
router.use(function (err, req, res, next) {
	if (err.status === 401) {
		res.status(401).send("干嘛呢？你想硬闯？！！")
	}
})

// 登录相关
const login = require('./login');

router.use('/', login);

module.exports = router;
