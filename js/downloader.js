var g_downloader = {
    init() {
        const self = this
        self.downloaded = local_readJson('downloaded', [])
        self.datas = local_readJson('downloads', {})


        g_action.
        registerAction('download_title_click', dom => {
            let id = $(dom).parents('[data-download]').data('download')
            let d = self.item_get(id)
            let f = d.pathName + '/' + d.fileName
            if (nodejs.files.exists(f)) {
                nodejs.files.openFile(f)
            }
        }).
        registerAction(['download_item_copy', 'download_item_remove', 'download_item_folder'], (dom, action) => {
            let k = g_menu.key
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
                icon: 'folder',
                text: '定位',
                action: 'download_item_folder'
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
    modal_download() {

    },
    test(url) {
        let time = new Date().getTime()
        this.item_add('test_' + time, {
            pathName: 'I:\\software\\douyin_downloader\\download',
            fileName: time + 'test.mp4',
            url: url || 'http://127.0.0.1/a.mp4',
            title: 'test_' + time + '.mp4'
        })
    },
    aria_start() {
        const self = this
        self.aria2c = require('./aria2c.js')()
        self.aria2c
            .on('conect_success', () => {
                // g_action.do(undefined, 'download_list')
                // self.test()
            })
            .on('conect_error', () => {
                console.log('error')
            })
            .on('addUri', v => {
                self.downloaded_add(v.refer)
                self.data_set(v.id, Object.assign(v, {
                    date: new Date().getTime(),
                }))
            })
            .on('downloading', v => {
                self.item_update('downloading', v)
            })
            .on('error', v => {
                self.item_update('error', v)
            })
            .on('complete', v => {
                self.item_get(v.id).finish = new Date().getTime()
                self.data_save()

                self.item_update('complete', v)
            })
            .on('update', v => self.update(v))
            .init()
    },
    // 下载历史
    downloaded_add(url) {
        if (url == '') return;
        if (!this.downloaded_exists(url)) {
            this.downloaded.push(url)
            this.downloaded_save()
        }
    },
    downloaded_exists(url) {
        return this.downloaded.includes(url)
    },
    downloaded_save() {
        local_saveJson('downloaded', this.downloaded)
    },
    item_get(id) {
        return this.datas[id]
    },
    item_remove(id) {
        this.item_getEle(id).remove()
        return this.data_set(id)
        // todo 取消aria2c下载
    },
    item_add(id, opts) {
        let now = new Date().getTime()

        if (isEmpty(id)) id = now
        // todo 分类规则

        // base64数据直接下载
        Object.assign(opts, {
            pathName: g_setting.getConfig('savePath', nodejs.dir + '\\downloads'),
        })
        opts.title = opts.fileName
        opts.fileName = new Date().getTime() + '.' + opts.fileName.split('.').pop()

        this.aria2c.task_list_add(id, [opts]);
        this.refresh()
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
                    <div class="progress progress-sm">
                      <div class="progress-bar progress-bar-indeterminate"></div>
                    </div>
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
    update(v) {
        // console.log(v)
        let i = v.downloading || 0
        $('#badge_downloading').html(i).toggleClass('hide', !i)
        // { downloading: 0, complete: 1, error: 0, waitting: 0, progress: 100 }
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
                        <i class="ti ti-folder"></i>
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