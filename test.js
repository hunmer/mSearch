const aria2c = require('./aria2c.js')({
    path: __dirname + '\\bin\\',
    config: {
        port: 6809,
    }
})
aria2c
    .on('conect_success', v => {
        aria2c.setTasker(r => {
            // console.log(r)
            // $('#badge_downloadSpeed').html(`${renderSize(Number(r[0][0].downloadSpeed))}`)
        }, 2000)

        let path = __dirname + '\\test'
        aria2c.addUris([/*{
            pathName: path,
            fileName: '1.mp4',
            url: 'http://127.0.0.1/1.mp4'
        }, */{
            pathName: path,
            fileName: '1.jpg',
            url: 'http://127.0.0.1/1.jpg'
        }, {
            pathName: path,
            fileName: '2.jpg',
            url: 'http://127.0.0.1/2.jpg'
        }], true).then(r => {
            let [gids, guids] = r
            if (gids.length) {
                console.log('成功添加' + gids.length + '个任务')
                aria2c.getFiles()
            }
        })

    })
    .on('exit', v => {
        // 程序退出
    })
    .on('addUri', v => {
        // console.log('addUri', v)
    })
    .on('downloading', v => {
        // console.log('downloading', v)
    })
    .on('complete', v => {
        console.log('complete', v)
    })
    .on('stop', v => {
        console.log('stop', v)
    })
    .on('error', v => {
        console.log('error', v)
    })
    .on('update', v => {

    })
    .init();