const { app, BrowserWindow, ipcMain, Menu, shell, dialog, session } = require('electron')
const path = require('path')
const file = require('./file.js')
app.commandLine.appendSwitch("disable-http-cache");
app.setPath('userData', process.cwd() + '/cache');

const Store = require('electron-store');
const store = new Store({
    devTool: false,
    showFrame: false,
    fullScreen: true,
});
const remote = require("@electron/remote/main")

Menu.setApplicationMenu(null)
var win;

const send = (k, v) => win.webContents && win.webContents.send(k, v);

function openFileDialog(opts, callback) {
    opts = Object.assign({
        title: '选中文件',
        // filters: [{
        //     name: '视频文件',
        //     extensions: ['mp4', 'ts', 'm3u8', 'flv', 'mdp', 'mkv'],
        // }],
        properties: ['openFile'], // multiSelections
    }, opts);
    dialog.showOpenDialog(win, Object.assign({}, opts)).then(res => callback(res.filePaths || res.filePath));
}
ipcMain.on("method", async function(event, data) {
    var d = data.msg;
    switch (data.type) {
         case 'pin':
            if (d == undefined) d = !win.isAlwaysOnTop();
            win.setAlwaysOnTop(d, 'screen');
            break;
        case 'min':
            return win.minimize()
        case 'max':
            return win.isMaximized() ? win.restore() : win.maximize()
        case 'close':
            return win.close()
            
        case 'progress':
            return win.setProgressBar(d.val, d.type || 'normal')
        case 'fileDialog':
            openFileDialog(d, res => {
                send('fileDialog_revice', {
                    id: d.id,
                    paths: res
                });
            });
            break;
    }
});

let g_cache = {}
function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 800,
        minHeight: 600,
        minWidth: 800,
        show: false,
        shadow: true,
        frame: store.get('showFrame'),
        fullScreen: store.get('fullScreen'),
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            webviewTag: true,
            contextIsolation: false,
        }
    })
    remote.enable(win.webContents);
    win.webContents.on('did-attach-webview', (event, webContents) => {
        remote.enable(webContents);
        send('startNetworkListener', webContents.id)
        // 新窗口转为tab
        webContents.setWindowOpenHandler(function(data) {
            send('newTab', {
                id: webContents.id,
                url: data.url
            });
            return {
                action: 'deny'
            }
        });
    });


    win.webContents.session.on('will-download', (e, item, webContents) => {
        e.preventDefault();
        send('download', {
            refer: webContents.getURL(),
            url: item.getURL(),
            type: item.getMimeType(),
            fileName: item.getFilename(),
            size: item.getTotalBytes(),
            webview: webContents.id
        })
    });

    if (store.has('bounds')) {
        win.setBounds(store.get('bounds'))
    } else
    if (store.get('fullScreen')) {
        win.maximize();
    }
    const savePos = () => {
        if (g_cache.savePos) clearTimeout(g_cache.savePos);
        g_cache.savePos = setTimeout(() => {
            store.set('bounds', win.getBounds());
            delete g_cache.savePos;
        }, 1000);
    }
    win.on('always-on-top-changed', (event, isTop) => {
        send('togglePin', isTop)
    });
    win.on('move', (event) => {
        savePos();
    });
    win.on('resize', (event) => {
        savePos();
    });
    win.on('close', (event) => {
        event.preventDefault(true)
        dialog.showMessageBox(win,{
            message:' 确定退出吗?',
            type: 'question',
            title: '提示',
            buttons: ['确定', '取消']
        }).then(r => {
            if(r.response == 0){
                send('exit')
                app.exit()
            }
        })
    })


    win.loadFile('index.html', { userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.71' })
    if (store.get('devTool')) win.webContents.toggleDevTools();
    win.show();
}

app.whenReady().then(() => {
    remote.initialize()
    createWindow()
    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    
})

// 关闭窗口
// ipcMain.handle("closeWindow", (e, id) => {
//   console.log(id);
//   const target = webContents.fromId(id);
//   target.destroy();
//   let win = BrowserWindow.fromWebContents(e.sender);
//   win.close();
// });

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})


