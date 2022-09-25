var g_downloader = {
    init() {
        const self = this
        self.downloaded = local_readJson('downloaded', [])
        self.datas = local_readJson('downloads', {})

        g_setting.setDefault('aria2c_path', __dirname + '\\bin\\')
        g_action.
        registerAction('download_title_click', dom => {
            let id = $(dom).parents('[data-download]').data('download')
            let d = self.item_get(id)
            let f = d.pathName + '/' + d.fileName
            if (nodejs.files.exists(f)) {
                nodejs.files.openFile(f)
            }
        }).
        registerAction('aria2c_setting', dom => {
            let old = self.getAriaPath()
            prompt(old, {
                title: '选择aria2c目录',
            }).then(path => {
                g_setting.setConfig('aria2c_path', path)
                if(old != path){
                    // 直接重载算了...
                    return location.reload()
                }
                g_form.confirm('aria2c_setting', {
                    elements: {
                        port: {
                            title: '端口',
                            required: true,
                            value: this.config['rpc-listen-port'],
                        },
                        maxDownloads: {
                            title: '最大同时下载',
                            required: true,
                            value: this.config['max-concurrent-downloads']
                        }
                    },
                }, {
                    id: 'aria2c_setting',
                    title: 'Aira2c设置',
                    btn_ok: '保存',
                    btn_cancel: '高级配置',
                    onBtnClick: (btn, modal) => {
                        if (btn.id == 'btn_ok') {
                            let vals = g_form.getVals('aria2c_setting')
                           // g_form.setInvalid('aria2c_setting', 'port')
                           // TODO 一些数值检查

                           self.config['rpc-listen-port'] = vals['port']
                           self.config['max-concurrent-downloads'] = vals['maxDownloads']
                           // Aria有一个方法可以修改参数，但是不确定是否端口也可以动态修改，总之先暴力重载
                           self.saveConfig()
                           location.reload()
                            return true
                        }
                        ipc_send('url', self.getAriaPath('aria2.conf'))
                        return false
                    }

                })
            })

        }).
        registerAction(['download_item_copy', 'download_item_remove', 'download_item_folder'], (dom, action, e) => {

            let k = $(dom).parents('[data-download]').data('download') || g_menu.key
            let d = self.item_get(k)
            g_menu.hideMenu('download_item_menu')
            switch (action[0]) {
                case 'download_item_folder':
                    let file = d.pathName + '\\' + d.fileName
                    if (!nodejs.files.exists(file)) return g_toast.toast('文件不存在', '错误', 'danger');
                    return ipc_send('openFolder', file)
                    break;
                case 'download_item_copy':
                    return ipc_send('copy', d.url)

                case 'download_item_remove':
                    return self.item_remove(k)
            }
        }).
        registerAction('download_list', dom => {
            g_modal.modal_get('downloader').modal('show')
            self.refresh()
        }).
        registerAction('download_add', dom => {
            self.modal_download()
        }).
        registerAction('download_start_all', dom => {
            for (let [id, status] of Object.entries(self.status)) {
                if (!['downloading', 'complete'].includes(status)) self.item_add(id, self.item_get(id))
            }
        }).
        registerAction('download_clear', dom => {
            for (let id in self.datas) self.item_remove(id)
        }).
        registerAction('download_clear_completed', dom => {
            for (let [id, item] of Object.entries(self.datas)) {
                item.finish && self.item_remove(id)
            }
        }).
        registerAction('download_path', dom => {
            ipc_send('openFolder', g_setting.getConfig('savePath', nodejs.dir + '\\downloads'))
        })

        g_menu.registerMenu({
            name: 'download_item_menu',
            selector: '.list-group-item[data-download]',
            dataKey: 'data-download',
            html: g_menu.buildItems([{
                icon: 'link',
                text: '复制链接',
                action: 'download_item_copy'
            }, {
                icon: 'trash',
                text: '删除',
                class: 'text-danger',
                action: 'download_item_remove'
            }, ])
        })

        self.aria_start();
        self.refresh()
    },

    getAriaPath(file) {
        return g_setting.getConfig('aria2c_path') + (file || '')
    },

    saveConfig() {
        nodejs.require('fs').writeFileSync(this.getAriaPath('aria2.conf'), nodejs.require('ini').stringify(this.config))
    },

    modal_download(opts = {}) {
        confirm(`<fieldset id="div_download_add" class="form-fieldset"></fieldset>`, {
            title: opts.title || '添加下载',
            id: 'modal_download_add',
            btn_ok: '添加',
            onShow: () => {
                $('#div_download_add').html(g_form.build('download_add', {
                    elements: {
                        fileName: {
                            title: '文件名',
                            value: getVal(opts.fileName),
                        },
                        url: {
                            title: '下载地址',
                            required: true,
                            value: getVal(opts.url),
                        },
                        pathName: {
                            title: '保存位置',
                            required: true,
                            value: getVal(opts.pathName, g_setting.getConfig('savePath'))
                        }
                        /*,
                        switch: {
                            title: '立即下载',
                            type: 'checkbox',
                            value: true,
                        }*/
                    },
                }))
                g_form.update('download_add')
            },
            onBtnClick: (btn, modal) => {
                if (btn.id == 'btn_ok') {
                    let vals = g_form.getVals('download_add')
                    let b = Object.keys(vals).length > 0
                    if (b) {
                        vals.title = vals.fileName
                        this.item_add(new Date().getTime(), vals)
                    }
                    return b
                }
            }
        })
    },
    test(url) {
        let time = new Date().getTime()
        this.item_add('test_' + time, {
            pathName: 'I:\\software\\douyin_downloader\\download',
            fileName: time + 'test.mp4',
            url: url || 'http://127.0.0.1/1.mp4',
            title: 'test_' + time + '.mp4'
        })
    },
    cache: {
        downloading: {},
    },
    config: {},
    aria_start() {
        const self = this
        let path = g_setting.getConfig('aria2c_path')
        let file = path + 'aria2.conf'
        if (!nodejs.files.exists(file)) {
            return toast('arai2c配置文件不存在', 'danger')
        }

        try {
            self.config = nodejs.require('ini').parse(nodejs.files.read(file));
            // TODO 如果aria2c位置改变则重新启动aria

            self.aria2c = require('./aria2c.js')({
                path: path,
                config: {
                    port: self.config['rpc-listen-port'],
                }
            })
            self.aria2c
                .on('conect_success', () => {
                    self.aria2c
                        .setGlobalTasker(r => {
                            // let progress
                            // ipc_send('progress', {val: progress, type: 'normal'})
                            let speed = renderSize(Number(r.downloadSpeed))
                            document.title = `[${speed}]` + ((r.numActive != '0' ? r.numActive + '下载中 ' : '') + (r.numWaiting != '0' ? r.numWaiting + '队列中 ' : '') || ' 没有下载任务')
                            $('#badge_downloading').html(r.numActive).toggleClass('hide', r.numActive == '0')
                            $('#badge_downloadSpeed').html(`${speed}`)
                        }).
                    setItemUpdate((r, ids) => {
                        ids.forEach((id, i) => {
                            let { completedLength, totalLength } = r[i][0]
                            let progress = parseInt(Number(completedLength) / Number(totalLength) * 100)
                            self.item_getEle(id).find('progress').val(progress)
                        })
                    })
                })
                .on('conect_error', () => {
                    console.log('链接失败')
                })
                .on('addUri', v => {
                    g_plugin.callEvent('addUri', v, v => {
                        self.downloaded_add(v.refer)
                        self.data_set(v.id, Object.assign(v, {
                            date: new Date().getTime(),
                        }))
                    })
                })
                .on('downloading', v => {
                    // 开始下载
                    self.item_update('downloading', v)
                    // 检测下载进度
                })
                .on('error', v => {
                    self.item_update('error', v)
                })
                .on('complete', v => {
                    self.item_get(v.id).finish = new Date().getTime()
                    self.data_save()

                    self.item_update('complete', v)
                })
                .init()
        } catch (err) {
            alert(err.toString(), { title: '启动aria2失败', type: 'danger' })
        }

    },
    // 下载历史
    downloaded_add(url) {
        if (url == '') return;
        if (this.downloaded_exists(url) == -1) {
            this.downloaded.push(url)
            this.downloaded_save()
        }
    },
    downloaded_toggle(url) {
        if (url == '') return;
        let i = this.downloaded_exists(url)
        if (i >= 0) {
            this.downloaded.splice(i, 1)
        } else {
            this.downloaded.push(url)
        }
        this.downloaded_save()
    },
    downloaded_exists(url) {
        return this.downloaded.indexOf(url)
    },
    downloaded_save() {
        local_saveJson('downloaded', this.downloaded)
    },
    item_get(id) {
        return this.datas[id]
    },
    item_remove(id) {
        let d = this.item_get(id)
        this.item_getEle(id).remove()
        d.gid && this.aria2c.remove(d.gid).then(gid => {
            // 如果还在下载，则删除源文件和.aira
            let file = d.pathName + '/' + d.fileName
            nodejs.files.remove(file)
            nodejs.files.remove(file + '.aria2')
        })
        return this.data_set(id)
    },
    item_add(id, opts) {
        if (isEmpty(id)) id = new Date().getTime()
        Object.assign(opts, {
            pathName: g_setting.getConfig('savePath', nodejs.dir + '\\downloads'),
        })
        g_plugin.callEvent('beforeaddDownload', { id: id, opts: opts }, data => {
            let { id, opts } = data
            // todo 分类规则
            // base64数据直接下载
            opts.title = opts.fileName
            opts.fileName = new Date().getTime() + '.' + opts.fileName.split('.').pop()
            opts.id = id
            this.aria2c.addUris([opts]);
            this.refresh()
        })
    },
    refresh() {
        $('#download_list').html(this.html_get())
        for (let [id, item] of Object.entries(this.datas)) {
            let s = ''
            if (item.finish) s = 'complete'
            this.item_update(s || this.status[id] || 'waitting', { id: id })
        }
    },
    status: {}, // 临时信息缓存
    item_update(t, v) {
        this.status[v.id] = t

        let c, h = ''
        switch (t) {
            case 'waitting':
                c = 'warn'
                h = '队列中...'
                break;
            case 'downloading':
                c = 'primary status-dot-animated'
                h = `
                    <progress class="progress progress-sm" value="0" max="100"/>
                `
                break;
            case 'error':
                c = 'danger'
                h = '下载错误'
                break;
            case 'complete':
                c = 'success'
                h = '下载完成'
                break;
        }
        let div = this.item_getEle(v.id)
        replaceClass(div.find('.status-dot'), 'bg-', 'bg-' + c)
        div.find('div.d-block').html(h)
    },
    item_getEle(id) {
        return $('[data-download="' + id + '"]')
    },
    data_set(k, v, save = true) {
        if (v == undefined) {
            delete this.datas[k]
        } else {
            this.datas[k] = v
        }
        save && this.data_save()
        return this
    },
    data_save() {
        local_saveJson('downloads', this.datas)
    },
    html_get() {
        let h = ''
        for (let [id, item] of Object.entries(this.datas)) {
            let ext = popString(item.title, '.').toLowerCase()
            h += `
                <div class="list-group-item" data-download="${id}">
                  <div class="row align-items-center position-relative">
                    <div class="col-auto"><span class="status-dot bg-secondary d-block"></span></div>
                    <div class="col-auto">
                      <a href="#">
                        <i class="ti ti-${['mp4', 'mov', 'avi', 'flv'].includes(ext) ? 'movie' : ['jpg', 'png', 'jpeg'].includes(ext) ? 'photo' : 'file'} bg-primary avatar fs-1"></i>
                      </a>
                    </div>
                    <div class="col text-truncate">
                      <a data-action="download_title_click" class="text-reset d-block">${item.title}${item.size ? `(${renderSize(item.size)})` : ''}</a>
                      <div class="d-block text-muted text-truncate mt-n1 p-2">
                        查询信息中...
                      </div>
                    </div>
                    <div class="col-auto">
                      <a class="list-group-item-actions">
                        <i class="ti ti-folder" data-action="download_item_folder"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            `
        }
        return h || `
            <h3 class="p-2 text-center">没有任何下载记录...</h3>
        `
    },

}

g_downloader.init()