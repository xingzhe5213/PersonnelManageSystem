let proxyObj = {};

proxyObj['/'] = {
    ws: false,
    target: 'http://127.0.0.1:3000/api/',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 81,
        proxy: proxyObj
    }
}