let proxyObj = {};

proxyObj['/api'] = {
    ws: false,
    target: 'http://127.0.0.1:3000/',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
proxyObj['/img'] = {
    ws: false,
    target: 'http://127.0.0.1:3000/',
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