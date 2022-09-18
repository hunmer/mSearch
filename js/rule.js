var g_rule = {
    defaultList: {
       /* 'killADS_yingshi': {
            title: '屏蔽影视横幅广告',
            js: `
        		`,
            css: `
        		 #fix_bottom_dom,#HMRichBox,#HMcoupletDivleft,#HMcoupletDivright,#iFrameshow,.ads_w {
        		 	display: none !important;
        		 }

        		`,
            match: ['/(.*?)cupfox.app(.*?)/', '/(.*?)abu22.com(.*?)/', '/(.*?)xcyingy.com(.*?)/', '/(.*?)fantuanhd.com(.*?)/', '/(.*?)mhyyy.com(.*?)/', '/(.*?)voflix.com(.*?)/', '/(.*?)xifanys.com(.*?)/', '/(.*?)lgyy.cc(.*?)/', '/(.*?)pianbar.net(.*?)/'],
            desc: '屏蔽小部分影视横幅广告',
            version: '0.0.1',
            enable: false,
            primary: 1,
        }*/
    },
    init() {
        const self = this
        self.list = local_readJson('rules', self.defaultList)
        const get = dom => $(dom).parents('[data-rule]').data('rule')
        g_action.
        registerAction('rule_add', dom => self.modal_edit()).
        registerAction('rule_edit', dom => self.modal_edit(get(dom))).
        registerAction('rule_enable', dom => {
            let k = get(dom)
            self.setValue(k, 'enable', dom.checked)
        }).
        registerAction('rule_reset', dom => {
            confirm('你确定要清空所有脚本吗?', {
                title: '警告',
                type: 'danger',
            }).then(() => {
                self.list = Object.assign({}, self.defaultList)
                self.saveData()
                location.reload()
            })
        }).
        registerAction('rule_question', dom => {
            ipc_send('url', 'https://github.com/hunmer/mSearch/issues')
        }).
        registerAction('rule_toggle', dom => {
            g_setting.toggleValue('ruleDisabled')
        }).
        registerAction(['rule_share', 'rule_file', 'rule_delete'], (dom, action) => {
            let k = get(dom) || g_menu.key
            let f = __dirname + '/scripts/' + k + '.js'
            g_menu.hideMenu('rule_item')
            switch (action[0]) {
                case 'rule_share':
                    return toast('待完善')
                case 'rule_file':
                    return ipc_send('openFolder', f)
                case 'rule_delete':
                    return confirm('确定删除脚本 : ' + k + '吗?', {
                    	type: 'danger',
                    	btn: '删除'
                    }).then(() => {
                        self.remove(k)
                    })
            }
        })

        g_setting.onSetConfig('ruleDisabled', b => {
            replaceClass(replaceClass(getEle('rule_toggle'), 'bg-', 'bg-' + (b ? 'success' : 'red')).children, 'ti-player-', 'ti-player-' + (b ? 'play' : 'pause'))
        })

        g_menu.registerMenu({
            name: 'rule_item',
            selector: '[data-rule]',
            dataKey: 'data-rule',
            html: g_menu.buildItems([{
                icon: 'share',
                text: '分享',
                action: 'rule_share'
            }, {
                icon: 'folder',
                text: '定位',
                action: 'rule_file'
            }, {
                icon: 'trash',
                text: '删除',
                class: 'text-danger',
                action: 'rule_delete'
            }, ])
        })

        self.refresh()
    },


    modal_edit(key) {
        var d = Object.assign({
            match: [],
        }, this.get(key) || {}, { js: nodejs.files.read(__dirname + '/scripts/' + key + '.js', '') });
        var h = `
        	<div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">ID</span>
              </div>
              <input type="text" id="input_rule_id" class="form-control" placeholder="输入ID(不要重复)" value="${key || new Date().getTime()}">
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">标题</span>
              </div>
              <input type="text" id="input_rule_title" class="form-control" placeholder="输入名称" value="${d.title || ''}">
            </div>

             <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">优先级</span>
              </div>
              <input type="text" id="input_rule_primary" class="form-control" placeholder="输入优先级" value="${d.primary || 1}">
            </div>

             <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">注释</span>
              </div>
              <input type="text" id="input_rule_desc" class="form-control" placeholder="注释" value="${d.desc || ''}">
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">版本</span>
              </div>
              <input type="text" id="input_rule_version" class="form-control" placeholder="版本" value="${d.version || '0.0.1'}">
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text h-full">匹配URL</br>(空格隔开)</span>
              </div>
              <textarea id="input_rule_match" rows="3" class="form-control">${d.match.join(' ')}</textarea>
            </div>

             <div class="row mb-3">
            	<div class="input-group col">
	              <div class="input-group-prepend">
	                <span class="input-group-text">JS</span>
	              </div>
	              <textarea id="input_rule_js" rows="20" class="form-control">${d.js || ''}</textarea>
	            </div>
	            <div class="input-group col">
	              <div class="input-group-prepend">
	                <span class="input-group-text">CSS</span>
	              </div>
	              <textarea id="input_rule_css" rows="20" class="form-control">${d.css || ''}</textarea>
	            </div>
            </div>
            `;
        g_modal.modal_build({
            id: 'rule_edit',
            title: '编辑插件',
            html: h,
            width: '90%',
            buttons: [{
                id: 'ok',
                text: '保存',
                class: 'btn-primary',
                onClick: e => {
                    let newK = $('#input_rule_id').val()
                    if (isEmpty(newK)) return toast('ID不能为空', 'danger');
                    if (!isEmpty(key) && newK != key) {
                        if (this.get(newK)) return toast('新ID已经存在', 'danger');
                        delete this.list[key]
                    }
                    this.assign(newK, {
                        js: $('#input_rule_js').val(),
                        match: $('#input_rule_match').val().split(' '),
                        title: $('#input_rule_title').val(),
                        version: $('#input_rule_version').val(),
                        desc: $('#input_rule_desc').val(),
                        css: $('#input_rule_css').val(),
                        primary: parseInt($('#input_rule_primary').val()),
                    });
                    toast('保存成功', 'success');
                }
            }/*, {
                id: 'debug',
                text: '测试',
                class: 'btn-warning',
                onClick: e => {
                    toast('完善中', 'danger');
                }
            }*/],
        });
    },

    matchURL(url, keys = true) {
        let r = []
        for (let [k, v] of Object.entries(this.list)) {
            if (v.enable) {
                for (let reg of v.match)
                    if (url.match(new RegExp(reg))) {
                        r.push(keys ? k : v)
                        break;
                    }
            }
        }
        // console.log(url, r)
        return r
    },

    getFile(k){
    	return __dirname+'/scripts/'+k
    },

    matchWeb(web) {
    	if(g_setting.getConfig('ruleDisabled')) return;
        let i = 0
        for (let k of this.matchURL(web.getURL())) {
            web.insertCSS(nodejs.files.read(this.getFile(k)+'.css', ''));
            web.executeJavaScript(nodejs.files.read(this.getFile(k)+'.js', ''));
        }
    },

    get(k) {
        return this.list[k]
    },

    setValue(id, k, v) {
        let d = this.get(id)
        if (d) {
            if (v == undefined) v = !d[k];
            d[k] = v
            this.saveData()
        }
    },

    remove(k) {
        delete this.list[k]
        nodejs.files.remove(this.getFile(k)+'.js')
        nodejs.files.remove(this.getFile(k)+'.css')
        this.saveData()
    },

    assign(key, value, save = true) {
        return this.set(key, Object.assign(this.get(key) || {}, value), save)
    },

    set(k, value, save = true) {
        nodejs.files.write(this.getFile(k)+'.js', value.js);
        nodejs.files.write(this.getFile(k)+'.css', value.css);
        delete value.js;
        delete value.css;
        this.list[k] = value;
        this.saveData(save);
    },

    saveData(save = true, refresh = true) {
        save && local_saveJson('rules', this.list);
        refresh && this.refresh();
    },

    refresh() {
        var h = '';
        for (var key in this.list) {
            var d = this.list[key];
            var id = 'check_plugin_' + key;
            h += `
            	<div class="list-group-item active" data-rule="${key}">
                  <div class="row align-items-center">
                    <div class="col-auto"><input type="checkbox" class="form-check-input" data-change="rule_enable" ${d.enable ? 'checked' : ''}></div>
                    <div class="col-auto">
                      <a href="#">
                        <span class="avatar bg-twitter">${d.title[0]}</span>
                      </a>
                    </div>
                    <div class="col text-truncate">
                      <a href="#" class="text-reset d-block">${d.title}</a>
                      <div class="d-block text-muted text-truncate mt-n1">${d.desc}</div>
                    </div>
                    <div class="col-auto">
                    	<i class="ti ti-edit fs-2" data-action="rule_edit"></i>
                    </div>
                    <div class="col-auto">
                    	${d.version}
                    </div>
                  </div>
                </div>`

        }
        $('#rule_list').html(h);
    },



}

g_rule.init()