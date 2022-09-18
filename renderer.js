const { app, ipcRenderer, clipboard, shell, session } = require('electron');
const { getCurrentWindow, getCurrentWebContents, webContents } = require('@electron/remote');
const files = require('./file.js')
ipcRenderer.on('method', (event, args) => {
    doAction(args);
});
ipcRenderer.on('download', (event, args) => {
    g_downloader.item_add(new Date().getTime(), args)
    if (g_setting.getConfig('closeAfterDownloaded')) {
        // let site = g_tabs.ids_get(args.webview)
        let web = g_tabs.ids_getWebview(args.webview)[0]
        if (g_tabs.group_getTabs(web.id.split('-')[0]).length > 1) { // 标签大于1个
            // 下载开始自动关闭标签
            // TODO 全局开关，局部站点开关
            g_tabs.tab_remove(web.id)
        }
    }

});
ipcRenderer.on('log', (event, args) => {
    console.log(args)
});
ipcRenderer.on('newTab', (event, args) => {
    g_tabs.group_newTab(args.id, args.url);
});
ipcRenderer.on('closeTab', (event, id) => {
    g_tabs.ids_remove(id)
});

// 文件对话框 回调

ipcRenderer.on('fileDialog_revice', (event, arg) => {
    g_pp.call(arg.id, arg.paths);
});

const _webContent = getCurrentWebContents();

window.nodejs = {
    dir: __dirname,
    require: require,
    files: files,
    session: session,
    webContents: webContents,
    method: function(data) {
        console.log(data);
        var d = data.msg;
        switch (data.type) {
            case 'url':
                shell.openExternal(d);
                break;
            case 'reload':
                location.reload()
                break;
            case 'copy':
                clipboard.writeText(d)
                g_toast && g_toast.toast('复制成功', 'success')
                break;
            case 'toggleFullscreen':
                app.setFullScreen(!app.fullScreen);
                break;
            case 'openFolder':
                shell.showItemInFolder(d)
                break;
            case 'devtool':
                if (_webContent.isDevToolsOpened()) {
                    _webContent.closeDevTools();
                } else {
                    _webContent.openDevTools();
                }
                break;
            default:
                ipcRenderer.send('method', data);
                break;
        }
    }
}
console.log(nodejs.crx)