var g_network = {
    list: {},
    init() {
        // todo 网络记录
        const self = this
        $(function() {
            $(`
                <div class="dropdown dropup" id="ftb" style="
                    position: fixed;
                    right: 60px;
                    bottom: 150px;
                    z-index: 999;
                ">
                  <button type="button" class="btn position-relative" data-bs-toggle="dropdown" data-action="network_show" data-bs-auto-close="outside">
                    <i class="ti ti-wave-saw-tool fs-1"></i>
                    <span id="badge_network" class="badge bg-danger badge-pill position-absolute top-0 end-0" style="right: -10px;"></span>
                  </button>
                  <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-card dropdown-static" style="width: 400px;">
                    <div class="card">
                      <div class="card-header">
                              <div class="input-group input-group-flat w-full">
                                <span class="input-group-text">
                                    <select class="form-control" data-change="network_type">
                                        <option value="All" selected>所有</option>
                                        <option value="media">媒体</option>
                                        <option value="image">图片</option>
                                        <option value="script">脚本</option>
                                        <option value="stylesheet">样式</option>
                                        <option value="font">字体</option>
                                        <option value="xhr">请求</option>
                                    </select>
                                </span>
                                <input type="text" id="input_network_search" data-input="input_network_search" class="form-control"  autocomplete="off">
                                <span class="input-group-text">
                                  <a href="#" data-action="network_search_reset" class="link-secondary" title="清除过滤器" data-bs-toggle="tooltip">
                                    <i class="ti ti-x fs-1"></i>
                                  </a>
                                  <a href="#" class="link-secondary ms-2" title="高级筛选" data-bs-toggle="tooltip" data-action="network_filters">
                                        <i class="ti ti-adjustments fs-1"></i>
                                  </a>
                                  <a href="#" class="link-secondary link-danger ms-2" title="删除记录" data-bs-toggle="tooltip" data-action="network_clear">
                                        <i class="ti ti-trash fs-1"></i>
                                  </a>
                                </span>
                              </div>
                      </div>
                      <div id="network_list" class="list-group list-group-flush list-group-hoverable" style="max-height: calc(100vh - 400px);overflow-y: auto;">
                        <div class="table-responsive p-2">
                          <table class="table table-vcenter">
                            <thead>
                              <tr>
                                <th>METHOD</th>
                                <th>TYPE</th>
                                <th>ACTION</th>
                              </tr>
                            </thead>
                            <tbody>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `).appendTo('main')
            getEle({ change: 'network_type' }).val(g_setting.getConfig('network_type'))
        });
        g_action.registerAction('network_show', dom => {
            self.show(g_tabs.getCurrentWeb().data('web-content'))
        }).
        registerAction('network_item_preview', dom => {
            let k = $(dom).parents('[data-network]').data('network')
            let d = self.detail_get(self.currentID, k)
            let h = ''
            switch (d.resourceType) {
                case 'image':
                    h = `<img src="${d.url}">`
                    break;

                case 'media':
                    h = `<video class="w-full" src="${d.url}" autoplay loop controls></video>`
                    break;

                default:
                    return
            }
            $('#network_preview').remove()
            $(`<div id="network_preview" class="position-fixed bottom-0 end-0 p-3 text-center border border-danger bg-light" style="width: 220px;height: 150px;z-index: 999;">
                ${h}
            </div>`).appendTo('body')
        }).
        registerAction('network_preview_remove', dom => {
            $('#network_preview').remove()
        }).
        registerAction('network_clear', dom => {
            delete self.list[self.currentID]
            self.show(self.currentID)
        }).
        registerAction('network_type', dom => {
            g_setting.setConfig('network_type', dom.value)
        }).
        registerAction('input_network_search', dom => {
            self.show(self.currentID)
        }).
        registerAction('network_search_reset', dom => {
            $('#input_network_search').val('')
            g_setting.setConfig('network_type', 'All')
        }).
        registerAction(['network_item_copy', 'network_item_download', 'network_item_open'], (dom, action) => {
            let k =  g_menu.key || $(dom).parents('[data-network]').data('network')
            let d = self.detail_get(self.currentID, k)
            g_menu.hideMenu('network_item')
            switch (action[0]) {
                case 'network_item_copy':
                    return ipc_send('copy', d.url)
                case 'network_item_open':
                    return ipc_send('url', d.url)
                case 'network_item_download':
                    return g_downloader.modal_download({
                        // fileName: popString(d.url, '/'), // todo 标签页名称
                        url: d.url,
                    })
            }
        })

        g_setting.
        onSetConfig('network_type', v => {
            getEle({ change: 'network_type' }).val(v)
            self.show(self.currentID)
        })
        g_menu.registerMenu({
            name: 'network_item',
            selector: 'tr[data-network]',
            dataKey: 'data-network',
            html: g_menu.buildItems([{
                icon: 'clipboard',
                text: '复制链接',
                action: 'network_item_copy'
            }, {
                icon: 'download',
                text: '下载',
                action: 'network_item_download'
            }, {
                icon: 'world',
                text: '浏览器打开',
                action: 'network_item_open'
            }, ])
        })


    },
    _id: 0,
    clear() {
        this.list = {}
        $('#network_list tbody').html('')
    },
    detail_get(id, index) {
        return this.list[id][index]
    },
    detail_add(detail) {
        let wid = detail.webContentsId
        if (!this.list[wid]) this.list[wid] = {};
        let r = { id, method, referrer, resourceType, url } = detail

        for(let [k, v] of Object.entries(this.list[wid])){
            if(v.url == url) return
        }

        let index = '_' + (this._id++)
        this.list[wid][index] = r
        let i
           if (wid == g_tabs.getCurrentWeb().data('web-content')) { // 当前
            if (getEle('network_show').hasClass('show')) { // 展开中
                if(!this.isMatch(r)) return
                i = $('#network_list tbody').append(this.getHtml(index, r)).find('tr').length // 直接插入
            } else {
                i = Object.keys(this.getResult(wid)).length // 取符合条件结果
            }
        }
        this.setBadge(i)
    },
    switchTo(wid){
        this.setBadge(Object.keys(this.getResult(wid)).length)
    },
    setBadge(i) {
        if(isEmpty(i)) return;
        
        i = parseInt(i)
        // toggleClass('hide1', i <= 0).
        $('#badge_network').html(i)
    },
    remove(id) {
        delete this.list[id]
    },
    getResult(id) {
        let r = {}
        for (let [index, detail] of Object.entries(this.list[id] || {})) {
            if(this.isMatch(detail)){
                r[index] = detail
            }
        }
        return r
    },
    isMatch(detail){
        let f = $('#input_network_search').val()
        let t = g_setting.getConfig('network_type', '')
        if (!isEmpty(t) && t != 'All' && detail.resourceType !== t) return
            if (!isEmpty(f)) {
                if (f.split('|').find(find => {
                        return detail.url.indexOf(find) != -1
                    }) == undefined) return
            }
            return true
    },
    getHtml(index, detail) {
        return `
                <tr data-network="${index}" >
                    <td class="text-mute">${detail.method}</td>
                    <td class="text-mute" title="${detail.url}">${detail.resourceType}</td>
                    <td class="text-center">
                        <i class="ti ti-eye fs-2" data-hover="network_item_preview" data-out="network_preview_remove" data-hover-time=300></i>
                        <i class="ti ti-download fs-2" data-action="network_item_download"></i>
                    </td>
                  </tr>
            `
    },
    show(id) {
        this.currentID = id
        let h = ''
        let i = 0
        for (let [index, detail] of Object.entries(this.getResult(id))) {
            h += this.getHtml(index, detail)
            i++
        }
        this.setBadge(i)
        $('#network_list tbody').html(h)
    },

}

// try {
//     // 移除会报错但有效果
//     content.session.webRequest.removeListener('onBeforeRequest', content._requestListenerId);
// } catch {}
if(getConfig('networkListenter')){
    g_network.init()
}