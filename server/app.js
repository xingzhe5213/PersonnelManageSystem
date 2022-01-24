const express = require('express');
const app = express();
const path = require('path');
const Router = require('./routes/index');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 后端api接口文档
app.use('/api-doc', express.static('apidoc'));

// 后端接口路由
app.use('/api', Router);

// 处理异常的中间件
function handleErrMidWare(err,req,res,next){
	if(err){
		res.status(500).json({
			code: 500,
			message: '服务器异常'
		})
	}
}
app.use(handleErrMidWare);



let port = 3000;
app.set('port', port);

app.listen(port,function(){
	console.log('server is running')
})

module.exports = app;
