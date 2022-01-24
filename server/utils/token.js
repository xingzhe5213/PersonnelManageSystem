const jwt = require('jsonwebtoken');

// 生成/解析token秘钥
exports.signKey = 'sdu23fhs1fh3a987ds32fs3dfd74fh3dh';

// 生成token
exports.setToken = function(username,userid){
	return new Promise((resolve,reject)=>{
		const token = jwt.sign({
			username:username,
			_id:userid
		},this.signKey,{ expiresIn:'2h' });
		resolve(token);
	})
}

// 解析token
exports.verToken = function(token) {
	return new Promise((resolve, reject) => {
		let info = jwt.verify(token.split(' ')[1],this.signKey);
		resolve(info);
	})
}