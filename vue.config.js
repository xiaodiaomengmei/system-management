module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
           '/api':{
                target:'http://192.168.3.30:20000/wifidog/north_api',
                changeOrigin:true,
                ws:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}