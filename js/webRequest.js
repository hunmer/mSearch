var g_request = {
    init() {
        if (getConfig('networkListenter')) {
        	// todo 一个session管理器
        	// 一个session可以捕获多个webview(同session)下的浏览器请求
        	// 不需要搞很多个事件
        	// 但考虑到后期有关session操作(cookie,扩展,user-agent等待)问题，果然还是用session来分组比较好...
        	  nodejs.session.defaultSession.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
	            g_network.detail_add(details)
	            callback({ cancel: false });
	        })
        }
    },
}

g_request.init()
// g_request.bind('onBeforeRequest', )