var g_sites = {
    defaultList: {
        抖音: {
            url: 'https://www.douyin.com/search/{query}?source=normal_search&aid=971abc7c-eb1c-4831-b88c-40a3b7925c11&enter_from=recommend',
            folder: '视频',
        },
        爱奇艺: {
            url: 'https://so.iqiyi.com/so/q_{query}?source=input',
            folder: '视频',
        },
        腾讯: {
            url: 'https://v.qq.com/x/search/?q={query}',
            folder: '视频',
        },
        西瓜: {
            url: 'https://www.ixigua.com/search/{query}/',
            folder: '视频',
        },
        央视: {
            url: 'https://search.cctv.com/search.php?qtext={query}&type=video',
            folder: '视频',
        },
        优酷: {
            url: 'https://so.youku.com/search_video/q_{query}?searchfrom=1',
            folder: '视频',
        },
        好看: {
            url: 'https://haokan.baidu.com/web/search/page?query={query}&sfrom=recommend',
            folder: '视频',
        },
        b站: {
            url: 'https://search.bilibili.com/all?keyword={query}&from_source=webtop_search&spm_id_from=333.1007',
            folder: '视频',
        },
        乐视: {
            url: 'http://so.le.com/s?wd={query}',
            folder: '视频',
        },
        搜狐: {
            url: 'https://so.tv.sohu.com/mts?wd={query}',
            folder: '视频',
        },
        搜狗: {
            url: 'https://v.sogou.com/v?query={query}&typemask=6&p=&w=06009900&dp=&dr=&_asf=v.sogou.com&_ast=1647317285344&enter=1&ie=utf8',
            folder: '视频',
        },
        '360': {
            url: 'https://video.360kan.com/v?q={query}&src=&ie=utf-8',
            folder: '视频',
        },
        凤凰: {
            url: 'https://so.ifeng.com/?q={query}&c=1',
            folder: '视频',
        },
        油管: {
            url: 'https://www.youtube.com/results?search_query={query}',
            folder: '视频',
        },

        videezy: {
            url: 'https://www.videezy.com/free-video/{query}?content-type-video=true&license-standard=true&from=mainsite&in_se=true',
            folder: '视频素材',
        },
        pixabay: {
            url: 'https://pixabay.com/videos/search/{query}/',
            folder: '视频素材',
        },
        aigei: {
            url: 'https://www.aigei.com/s?term={query}&type=video',
            folder: '视频素材',
        },
        pexels: {
            url: 'https://www.pexels.com/zh-cn/search/videos/{query}/',
            folder: '视频素材',
        },

        潮点: {
            url: 'https://shipin520.com/sousuo/?word={query}&type=all&kid=237&order=&data=&page=1',
            folder: '视频素材',
        },
        千库: {
            url: 'https://588ku.com/video/',
            folder: '视频素材',
            script: `
                    document.querySelector('#topkeyword').value = '{query}';
                    document.querySelector('#btn-search').click()
                `
        },
        videvo: {
            url: 'https://www.videvo.net/search/{query}/freeclips/yes/editorial/hide_editorial/',
            folder: '视频素材',
        },
        pinterest: {
            url: 'https://www.pinterest.com/search/pins/?q={query}',
            folder: '图片',
        },
        pexels: {
            url: 'https://www.pexels.com/zh-cn/search/{query}/',
            folder: '图片',
        },
        '699pic': {
            folder: '图片',
            url: 'https://699pic.com/tupian/{query}.html'
        },
        unsplash: {
            folder: '图片',
            url: 'https://unsplash.com/s/photos/{query}'
        },
        '58pic': {
            folder: '图片',
            url: 'https://www.58pic.com/tupian/{query}-0-0-default-0-0-{query}-0_10_0_0_0_0_0-0-0-0-0-.html'
        },
        lanrentuku: {
            folder: '图片',
            url: 'https://www.lanrentuku.com/sort/{query}/'
        },
        foter: {
            folder: '图片',
            url: 'https://foter.com/explore/search/?q={query}'
        },
        splitshire: {
            folder: '图片',
            url: 'https://www.splitshire.com/?s={query}'
        },
        gaoimg: {
            folder: '图片',
            url: 'http://www.gaoimg.com/plus/search.php?kwtype=0&q={query}'
        },
        wallhaven: {
            folder: '图片',
            url: 'https://wallhaven.cc/search?q={query}'
        },
        kaboompics: {
            folder: '图片',
            url: 'https://kaboompics.com/gallery?search={query}'
        },
        picjumbo: {
            folder: '图片',
            url: 'https://picjumbo.com/?s={query}'
        },
        isorepublic: {
            folder: '图片',
            url: 'https://isorepublic.com/?s={query}&post_type='
        },
        freeimages: {
            folder: '图片',
            url: 'https://www.freeimages.com/cn/search/{query}'
        },
        burst: {
            folder: '图片',
            url: 'https://burst.shopify.com/photos/search?utf8=%E2%9C%93&q={query}'
        },
        barnimages: {
            folder: '图片',
            url: 'https://barnimages.com/?s={query}'
        },
        magdeleine: {
            folder: '图片',
            url: 'https://magdeleine.co/?s={query}'
        },
        片吧: {
            folder: '影视',
            url: 'http://so.pianbar.net/search.aspx?q={query}&s=movie'
        },
        茶杯狐: {
            folder: '影视',
            url: 'https://cupfox.app/search?key={query}',
        },

        影视大全: {
            folder: '影视',
            url: 'https://www.jinshier66.com/search/',
        },

        嘀哩嘀哩: {
            folder: '影视',
            url: 'https://www.bdys01.com/search/{query}',
        },
        高清mp4: {
            folder: '影视',
            url: 'https://www.mp4pa.com/vodsearch.html?wd={query}&submit=',
        },
        厂长资源: {
            folder: '影视',
            url: 'https://www.czspp.com/xssearch?q={query}',
        },
        星辰影院: {
            folder: '影视',
            url: 'https://www.xcyingy.com/search?search={query}',
        },
        饭团影院: {
            folder: '影视',
            url: 'https://www.fantuanhd.com/search.html?wd={query}&submit=',
        },
        ab影院: {
            folder: '影视',
            url: 'https://abu22.com/',
            script: '',
        },
        干饭影视: {
            folder: '影视',
            url: 'http://www.gfysys.com/',
            script: '',
        },
        小宝影视: {
            folder: '影视',
            url: 'https://www.1xbys.com/vodsearch/-------------.html?wd={query}',
        },
        麻花影视: {
            folder: '影视',
            url: 'https://www.mhyyy.com/search.html?wd={query}',
        },
        voflix: {
            folder: '影视',
            url: 'https://www.voflix.com/search/-------------.html?wd={query}',
        },
        nikeTV: {
            folder: '影视',
            url: 'https://www.ajeee.com/search.html?wd={query}',
        },
        锐行加速: {
            folder: '影视',
            url: 'https://www.cjtyy.top/index.php/vod/search.html?wd={query}',
        },
        稀饭影视: {
            folder: '影视',
            url: 'https://www.xifanys.com/yingpiansearch/-------------.html?wd={query}',
        },
        我爱跟剧: {
            folder: '影视',
            url: 'https://www.genmov.com/vodsearch/-------------.html?wd={query}',
        },
        蓝光影院: {
            folder: '影视',
            url: 'https://www.lgyy.cc/vodsearch/-------------.html?wd={query}',
        },
        libvio: {
            folder: '影视',
            url: 'https://www.libvio.me/search/-------------.html?wd={query}',
        },
        神马影院: {
            folder: '影视',
            url: 'https://www.smdyy.cc/search.html?wd={query}',
        },
        双十电影: {
            folder: '影视',
            url: 'https://www.1010dy3.com/search/',
            script: '',
        },
        奇粹视频: {
            folder: '影视',
            url: 'http://www.blssv.com/index.php/vod/search.html?wd={query}',
        },
        莫扎兔: {
            folder: '影视',
            url: 'https://www.mozhatu.com/index.php/vod/search.html?wd={query}',
        },
        '87影院': {
            folder: '影视',
            url: 'https://87dyba.com/vodsearch/-------------.html?wd={query}',
        },
        小强迷: {
            folder: '影视',
            url: 'https://www.xqmi.top',
            script: '',
        },
        '31看影视': {
            folder: '影视',
            url: 'https://www.31kan.vip/vodsearch/-------------.html?wd={query}&submit=',
        },
        '85看': {
            folder: '影视',
            url: 'http://www.85kankan.com/vod/search.html',
            script: '',
        },
        瓜皮TV: {
            folder: '影视',
            url: 'https://guapitv.xyz/vodsearch/-------------.html?wd={query}',
        },
        um影院: {
            folder: '影视',
            url: 'https://www.umkan.com/index.php/vod/search.html?wd={query}',
        },
        视中心影视: {
            folder: '影视',
            url: 'https://www.ksksl.com/ch.html?wd={query}',
        },
    },
    init: function() {
        const self = this
        this.list = local_readJson('sites', self.defaultList)
        g_menu.registerMenu({
            name: 'site_menu',
            selector: '.list-group-item[data-site]',
            dataKey: 'data-site',
            html: g_menu.buildItems([{
                icon: 'pencil-minus',
                text: '编辑',
                action: 'site_edit'
            }, {
                icon: 'trash',
                text: '删除',
                class: 'text-red',
                action: 'site_delete'
            }, {
                icon: 'box-multiple',
                text: '克隆',
                action: 'site_clone'
            }, {
                icon: 'x',
                text: '关闭其他',
                action: 'site_closeOther'
            }])
        })

        g_action.
        registerAction('site_export', (dom, action, event) => {
            g_toast.toast('暂不开放')
        }).
        registerAction('site_clear', (dom, action, event) => {
            $('#content').html(`
                <div class="empty">
                  <div class="empty-icon">
                    <i class="ti ti-alert-circle" style="font-size: 3rem;"></i>
                  </div>
                  <p class="empty-title">内容已清空</p>
                  <p class="empty-subtitle text-muted">
                    快去搜索吧！！
                  </p>
                  <div class="empty-action">
                    <a class="btn btn-primary">
                        <i class="ti ti-search"></i>
                        搜索
                    </a>
                  </div>
                </div>
            `)
        }).
        registerAction('site_import', (dom, action, event) => {
            g_toast.toast('暂不开放')
        }).
        registerAction('site_reset', (dom, action, event) => {
            confirm('你确定要重置所有网站吗?', {
                title: '警告',
                type: 'danger',
            }).then(() => {
                self.list = Object.assign({}, self.defaultList)
                self.save()
                location.reload()
            })
        }).
        registerAction('history', (dom, action, event) => {
            g_toast.toast('暂不开放')
        }).
        registerAction('site_new', dom => {
            self.site_edit('')
        }).
        registerAction(['site_edit', 'site_delete', 'site_clone', 'site_closeOther'], (dom, action) => {
            g_menu.hideMenu('site_menu')
            // todo form 模板？ 不然太麻烦了
            let site = g_menu.target.data('site')
            let d = self.site_get(site)
            switch (action[0]) {
                case 'site_closeOther':
                    for(let s of g_sites.group_get(g_sites.group)){
                        if(s != site) g_tabs.group_getContent(s).remove()
                    }
                    return; 
                case 'site_clone':
                    self.site_set(site + +parseInt(new Date().getTime() / 1000), d)
                    g_toast.toast('成功克隆', '', 'success')
                    break;
                case 'site_edit':
                    return self.site_edit(site, d)
                case 'site_delete':
                    return confirm('确定删除站点:' + site + '吗?', {
                        btn_ok: '删除'
                    }).then(() => {
                        self.site_set(site)
                        g_toast.toast('删除站点:' + site, '成功移除', 'success')
                    })
            }

        }).
        registerAction('input_search', (dom, action, event) => {
            if (event.keyCode == 13 && dom.value != '') {
                self.group_load()
            }
        }).
        registerAction('site_click', dom => {
            self.site_setActive($(dom))
            let site = dom.dataset.site
            self.site_getEle(site)[0].scrollIntoViewIfNeeded()
        })
        this.update()
    },
    site_edit: function(site, d) {
        if (!d) d = this.site_get(site) || {
            folder: '',
            url: '',
        }
        confirm(`
                <div class="mb-3">
                  <label class="form-label">名称</label>
                  <input id="input_name" type="text" class="form-control" placeholder="输入名称" value="${site}">
                </div>
                <div class="mb-3">
                  <label class="form-label">目录</label>
                  <input id="input_folder" type="text" class="form-control" placeholder="输入目录" value="${d.folder}">
                </div>
                <div class="mb-3">
                  <label class="form-label">网址</label>
                  <input id="input_url" type="text" class="form-control" placeholder="输入网址" value="${d.url}">
                </div>
                `, {
            title: (site == '' ? '新建' : '编辑') + '网址',
            btn_ok: '保存',
            onBtnClick: (btn, modal) => {
                if (btn.id == 'btn_ok') {
                    let name = modal.find('#input_name').val()
                    let url = modal.find('#input_url').val()
                    if (isEmpty(name)) {
                        g_toast.toast('输入名称', '错误', 'danger')
                        return false
                    }
                    if (isEmpty(url)) {
                        g_toast.toast('输入url', '错误', 'danger')
                        return false
                    }
                    if (name != site) { // 换新名称
                        delete this.list[site]
                    }
                    this.site_set(name, {
                        folder: modal.find('#input_folder').val(),
                        url: url,
                    })
                }
            }
        })
    },
    site_getEle: function(site) {
        return $(`.card[data-site="${site}"`)
    },
    group_get: function(group) {
        return Object.keys(this.list).filter(name => this.list[name].folder == group)
    },
    // site_remove: function(k, save = true) {
    //     delete this.list[k]
    //     this.site_getSideBtn(k).remove()
    //     this.site_getEle(k).remove()
    //     save && this.save()
    // },
    site_get: function(k) {
        return this.list[k]
    },
    site_set: function(k, v, save = true, update = true) {
        if (v == undefined) {
            delete this.list[k]
        } else {
            this.list[k] = v
        }
        save && this.save()
        update && this.update()
    },
    group_list: function() {
        let r = []
        for (let [k, v] of Object.entries(this.list)) {
            if (!r.includes(v.folder)) r.push(v.folder)
        }
        return r
    },
    group_load: function(group, keyword) {
        let self = this
        self.cache = {}
        g_network.clear()

        let h = ''
        let tabs = {} // 新的 tabs 数据
        if (isEmpty(keyword)) keyword = $('#input_search').val()
        group = group || self.group || self.group_list()[0]
        self.group = group;
        g_setting.setConfig('lastGroup', group)
        g_setting.setConfig('lastKeyword', keyword)

        $('[data-bs-parent="#accordion-group"].show').removeClass('show')
        $('#collapse-group-' + group).addClass('show')

        let names = this.group_get(group)
        let c = g_setting.getConfig('columns') ? 6 : 12
        for (let name of names) {

            let d = this.site_get(name)
            let url = d.url.replace('{query}', keyword)
            tabs[name] = {
                tab1: {
                    url: url,
                    title: 'loading...',
                }
            }
            // <div class="spinner-border spinner-border-sm text-muted mr-2" role="status"></div>
            h += `
            <div class="col-${c} card mb-2 pb-3 _content" data-site="${name}">
                <div class="card-header">
                    <div class="input-group input-group-flat">
                        <span class="input-group-text">
                            <a data-action="web_back" class="link-secondary fs-2 mr-2 disabled" title="后退" data-bs-toggle="tooltip">
                                <i class="ti ti-arrow-narrow-left"></i>
                            </a>
                            <a data-action="web_forward" class="link-secondary fs-2 mr-2 disabled" title="前进" data-bs-toggle="tooltip">
                                <i class="ti ti-arrow-narrow-right"></i>
                            </a>
                            <a data-action="web_refresh" class="link-secondary fs-2 mr-2" title="刷新" data-bs-toggle="tooltip">
                                <i class="ti ti-refresh"></i>
                            </a>
                        </span>
                        <input type="text" class="form-control form-control-rounded" autocomplete="off" placeholder="输入URL" data-keyup="keyup_url">
                        <span class="input-group-text">
                            <a data-action="web_newTab" class="link-secondary fs-2" title="新标签" data-bs-toggle="tooltip">
                                <i class="ti ti-plus"></i>
                            </a>
                            <a data-action="web_go" class="link-secondary ms-2 fs-2 disabled" title="跳转" data-bs-toggle="tooltip">
                                <i class="ti ti-arrow-big-right"></i>
                            </a>
                        </span>
                    </div>
                </div>
                <div class="card-body p-0">
                    <group data-group="${name}"></group>
                </div>
            </div>
            `
        }
        g_tabs.data_set(tabs, false)

        $('#content')
            .html(`<div>
                    <div class="row">
                        ${h}
                    </div>
            </div>`)
            .on('scroll', function(e) {
                let top = this.scrollTop
                let pos = top + this.clientHeight / 2
                for (let [n, v] of Object.entries(self.cache)) {
                    if (pos >= v.top && pos <= v.top + v.height) {
                        if (n != g_cache.lastActive) {
                            self.site_setActive(n)
                        }
                    }
                }
            })
            .find('group').each((i, div) => {
                g_tabs.group_bind(div)
            })
        setTimeout(() => {
            // 重置tabs
            $('#content').scrollTop(0).scroll();
            this.site_setActive(names[0])
            this.group_update()
        }, 200)
    },
    site_setActive: function(btn) {
        if (typeof(btn) == 'string') btn = this.site_getSideBtn(btn);
        g_cache.lastActive = btn.data('site')
        $('#sidebar_left .list-group-item.active').removeClass('active')
        btn.addClass('active')
    },
    cache: {},
    group_getSideBtn: function(group) {
        return $('#heading-group-' + group).parent('.accordion-item')
    },
    site_getSideBtn: function(site) {
        return $('[data-action="site_click"][data-site="' + site + '"]')
    },
    site_cache_set: function(site, k, v) {
        if (!this.cache[site]) this.cache[site] = {}
        this.cache[site][k] = v
    },
    group_update: function() {
        for (let child of $('#content .card[data-site]')) {
            child = $(child)
            let site = child.data('site')
            this.site_cache_set(site, 'top', child.offset().top)
            this.site_cache_set(site, 'height', child.height())
        }
    },
    save: function() {
        local_saveJson('sites', this.list)
    },
    update: function() {
        let self = this
        // 注册侧边栏
        let datas = []
        // active" aria-current="true"
        for (let [name, item] of Object.entries(this.list)) {
            datas.push({
                html: `
                    <a class="list-group-item list-group-item-action" data-site="${name}" data-action="site_click">${name}</a>
                `,
                group: item.folder
            })
        }
        $('#sidebar_left').html(
            `
                <div class="input-icon mb-1 p-2">
                  <input type="text" value="${g_setting.getConfig('lastKeyword', '')}" class="form-control  form-control-rounded" placeholder="Search…" data-keyup="input_search" id="input_search">
                  <span class="input-icon-addon" style="right: 6px">
                    <i class="ti ti-search"></i>
                  </span>
                </div>
                <div id="site_list" style="overflow-y: scroll;height: calc(100vh - 150px);"></div>
                <div class="d-flex w-full position-absolute bottom-0 p-2">
                    <a data-action="history" title="历史" class="btn btn-pill btn-ghost-secondary"><i class="ti ti-history"></i></a>
                    <a data-action="settings" title="设置" class="btn btn-pill btn-ghost-warning"><i class="ti ti-settings"></i></a>
                    <a title="其他" class="btn btn-pill btn-ghost-primary" href="#dropdown-more" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false"><i class="ti ti-dots"></i></a>
                    <div class="dropdown-menu" id="dropdown-more">
                        <h6 class="dropdown-header">软件</h6>
                        <a class="dropdown-item" data-action="homepage">
                            <i class="ti ti-brand-github fs-2"></i>
                            项目主页
                        </a>
                        <a class="dropdown-item" onclick="ipc_send('url', 'https://www.52pojie.cn/thread-1688063-1-1.html')">
                            <i class="ti ti-brand-hipchat fs-2"></i>
                            52pojie
                        </a>
                        <a class="dropdown-item" data-action="update_check">
                            <i class="ti ti-clock-2 fs-2"></i>
                            检测更新
                            <span id="badge_update" class="badge bg-danger ms-auto">News</span>
                        </a>
                        <a class="dropdown-item" data-action="about">
                            <i class="ti ti-alert-circle fs-2"></i>
                            关于
                            <span class="badge bg-primary ms-auto">0.0.1</span>
                        </a>
                    </div>
                </div>

            `
        ).find('#site_list').html(g_tabler.build_accordion({
            id: 'group',
            datas: datas,
            onOpen: e => {
                let group = e.currentTarget.dataset.collapse
                self.group_load(group)
            },
            collapse_start: `<div class="list-group list-group-flush">`,
            collapse_end: `</div>`,
        }))
        // return;
        let last = g_setting.getConfig('lastGroup', '')
        last.length && self.group_load(last)
    },
}
g_sites.init()