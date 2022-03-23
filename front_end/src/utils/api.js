import axios from 'axios'
import router from '../router'
import {Message} from 'element-ui'

//请求拦截器
axios.interceptors.request.use(
	config => {
		const token = window.sessionStorage.getItem("token");
		token && (config.headers.Authorization = 'Bearer ' + token);
		return config;
	},
	error => Promise.error(error)
)

//响应拦截器
axios.interceptors.response.use(
	success => {
		if (success.status && success.status == 200 && success.data.status == 500) {
			Message.error(success.data.msg);
			return;
		}
		return success.data;
	}, error => {
		if (error.response.status == 504 || error.response.status == 404) {
			Message.error('服务器错误');
		} else if (error.response.status == 403) {
			Message.error('权限不足，请联系管理员');
		} else if (error.response.status == 401) {
			Message.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
			router.replace('/');
		} else {
			if (error.response.data.msg) {
				Message.error(error.response.data.msg);
			} else {
				Message.error('未知错误!');
			}
		}
	})

export const PostKey = (url, params) => {
	return axios({
		method: 'post',
		url: `${url}`,
		data: params,
		transformRequest: [function (data) {
			let ret = '';
			for (let i in data) {
				ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
			}
			return ret;
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}
export const Post = (url, params) => {
	return axios({
		method: 'post',
		url: `${url}`,
		data: params,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
export const Put = (url, params) => {
	return axios({
		method: 'put',
		url: `${url}`,
		data: params,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
export const Get = (url, params) => {
	return axios({
		method: 'get',
		url: `${url}`,
		params: params
	})
}
export const Delete = (url, params) => {
	return axios({
		method: 'delete',
		url: `${url}`,
		params: params
	})
}
