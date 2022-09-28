var g_hotkey = {
    defaultList: {
        'f5': {
            title: '刷新',
            content: "ipc_send('reload')",
            type: 2,
        },
        'f12': {
            title: '开发者工具',
            content: "ipc_send('devtool')",
            type: 2,
        },
        '`': {
            title: '切换侧边',
            content: "getEle('sidebar_toggle,left').click()",
            type: 2,
        },
        'ctrl+keyw': {
            title: '关闭tab',
            content: "g_tabs.tab_closeCurrent()",
            type: 2,
        },
        'ctrl+keyj': {
            title: '下载列表',
            content: "",
            type: 2,
        },
        'ctrl+keyf': {
            title: '聚焦搜索',
            content: "inputFocus($('#input_search')[0]",
            type: 2,
        },
        'shift+delete': {
            title: '清空搜索',
            content: "g_action.do(null, 'site_clear')",
            type: 2,
        },
        'f10': {
            title: '快捷键设置',
            content: "g_hotkey.modal_show()",
            type: 2,
        },
        'f11': {
            title: '全屏',
            content: "toggleFullScreen()",
            type: 2,
        },
        'home': {
            title: '窗口到顶部',
            content: "g_tab.getTabWebview()[0].send('msg', {type: 'home'})",
            type: 2,
        },
        'end': {
            title: '窗口到底部',
            content: "g_tab.getTabWebview()[0].send('msg', {type: 'end'})",
            type: 2,
        },
         'ctrl+alt+arrowup': {
            title: '上一个页面',
            content: "g_action.do(null, 'prevSite')",
            type: 2,
        },
         'ctrl+alt+arrowdown': {
            title: '下一个页面',
            content: "g_action.do(null, 'nextSite')",
            type: 2,
        },

    },
    init: function() {
        this.list = local_readJson('hotkeys', this.defaultList);
        this.initEvent();
        this.initData();
        g_menu.registerMenu({
            name: 'hotkey_item',
            selector: '[data-dbaction="hotkey_edit"]',
            dataKey: 'data-key',
            html: g_menu.buildItems([{
                icon: 'pencil',
                text: '编辑',
                action: 'hotkey_item_edit'
            }, {
                icon: 'trash',
                text: '删除',
                class: 'text-danger',
                action: 'hotkey_item_delete'
            }])
        });
        g_action.
        registerAction('modal_hotkey', (dom, action) => {
            this.modal_show();
        }).
        registerAction('hotkey_item_edit', (dom, action) => {
            g_hotkey.prompt_add(g_menu.key);
            g_menu.hideMenu('hotkey_item');
        }).
        registerAction('hotkey_item_delete', (dom, action) => {
            g_hotkey.prompt_delete(g_menu.key);
            g_menu.hideMenu('hotkey_item');
        }).
        registerAction('hotkey_edit', (dom, action) => {
            g_hotkey.prompt_add(dom.dataset.key);
        }).
        registerAction('hotkey_toggle', dom => {
            g_setting.toggleValue('hotkey')
        })


    },
    prompt_delete: function(key) {
        confirm('是否删除快捷键 【' + key + '】 ?', {
            title: '删除快捷键',
        }).then(() => {
            $('#modal_hotkey_edit').modal('hide');
            g_hotkey.removeKey(key);
            toast('删除成功', 'success');
        })
    },
    prompt_add: function(key = '') {
        var d = this.list[key] || {
            content: '',
            title: '',
            type: '',
        }
        var h = `
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">标题</span>
              </div>
              <input type="text" id="input_hotkey_title" class="form-control" placeholder="输入名称" value="${d.title}">
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" >热键</span>
              </div>
              <input type="text"  id="input_hotkey_key" value="${key}" class="form-control" placeholder="在这里按下要设置的快捷键" onkeydown="this.value=g_hotkey.getInputCode(event);" readonly>
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">代码</span>
              </div>
              <textarea  id="input_hotkey_content" class="form-control">${d.content}</textarea>
            </div>

            <div class="input-group mt-10">
              <div class="input-group-prepend">
                <label class="input-group-text" for="select_hotkey_key">作用范围</label>
              </div>
              <select class="form-select" id="select_hotkey_key">
                <option selected value=''>点击选择</option>
                <option value="1">普通</option>
                <option value="2">无视输入框</option>
                <option value="3">全局</option>
              </select>
            </div>
            `;
        g_modal.modal_build({
            html: h,
            id: 'hotkey_edit',
            title: '编辑热键',
            buttons: [{
                id: 'ok',
                text: '保存',
                class: 'btn-primary',
            }, {
                id: 'test',
                text: '测试',
                class: 'btn-warning',
            }, {
                id: 'delete',
                text: '删除',
                class: 'btn-danger',
            }],
            onShow: () => {
                if (!key) {
                    $('#modal_hotkey_edit #btn_delete').hide();
                } else {
                    $('#modal_hotkey_edit option[value="' + d.type + '"]').prop('selected', true);
                }
            },
            onBtnClick: (btn, modal) => {
                var par = $(btn).parents('.modal');
                var content = $('#input_hotkey_content').val();
                if (content == '') return toast('没有输入执行内容', 'danger');
                if (btn.id == 'btn_ok') {
                    var newKey = $('#input_hotkey_key').val();
                    if (newKey == '') return toast('没有输入按键', 'danger');
                    var type = $('#select_hotkey_key').val();
                    if (!type) return toast('没有选择作用范围', 'danger');
                    var title = $('#input_hotkey_title').val();

                    const fun = () => {
                        g_hotkey.setHotKey(newKey, {
                            content: content,
                            title: title,
                            type: parseInt(type),
                        });
                        toast('保存成功', 'success');
                    }

                    if (newKey != key) {
                        var exists = g_hotkey.getKey(newKey);
                        if (exists) {
                            return confirm('此按键已被 ' + exists.title + ' 占用,是否覆盖?').then(() => fun());
                        }
                        key && g_hotkey.removeKey(key, false);
                    }
                    fun();
                } else
                if (btn.id == 'btn_test') {
                    try {
                        eval(content);
                    } catch (e) {
                        alert(e.toString());
                    }
                    return false;
                } else
                if (btn.id == 'btn-delete') {
                    g_hotkey.prompt_delete(key);
                    return false;
                }
                par.modal('hide');
            }
        });
    },
    getKey: function(key) {
        return this.list[key];
    },
    removeKey: function(key, save = true) {
        delete this.list[key];
        this.saveData(save);
    },
    saveData: function(save = true) {
        if (save) {
            local_saveJson('hotkeys', this.list);
        }
        if ($('#modal_hotkey').length) this.rendererList();
        this.initData();
    },
    initData: function() {
        // 正确排序按键
        var self = this;
        var list = {};
        for (var key in self.list) {
            const getPrimary = s => {
                if (s == 'ctrl') return 4;
                if (s == 'alt') return 3;
                if (s == 'shift') return 2;
                return 1;
            }
            list[key.split('+').sort((a, b) => {
                return getPrimary(b) - getPrimary(a);
            }).join('+').toLowerCase()] = self.list[key];
        }
        self.list = list;
    },
    setHotKey: function(key, value, save = true) {
        this.list[key] = value;
        this.saveData(save);
    },
    rendererList: function() {
        var h = '';
        for (var key in this.list) {
            var d = this.list[key];
            h += `
                <tr data-key="${key}" data-dbaction="hotkey_edit">
                  <td>${d.title}</td>
                  <td>${key}</td>
                  <td>${d.content}</td>
                </tr>
            `;
        }
        $('#modal_hotkey tbody').html(h);
    },
    modal_show: function() {
        var h = `
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">说明</th>
                  <th scope="col">按键</th>
                  <th scope="col">动作</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
        `;
        this.modal = g_modal.modal_build({
            html: h,
            id: 'hotkey',
            title: '快捷键列表',
            width: '80%',
            buttons: [{
                id: 'add',
                text: '新增',
                class: 'btn-warning',
            }, {
                id: 'reset',
                text: '重置',
                class: 'btn-secondary',
            }, {
                id: 'tip',
                text: '常用代码',
                class: 'btn-info',
            }],
            onBtnClick: (btn, modal) => {
                switch (btn.id) {
                    case 'btn_tip':
                        var h = `
                            <div class="table-responsive">
                                <table class="table user-select table-vcenter table-nowrap">
                                  <thead>
                                    <tr>
                                      <th scope="col">说明</th>
                                      <th scope="col">代码</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                            </div>
                        `;
                        for (var item of [
                                ['切换置顶', 'ipc_send("pin")'],
                                ['最小化', 'ipc_send("min")'],
                                ['切换最大化', 'ipc_send("max")'],
                                ['结束程序', 'ipc_send("close")'],
                            ]) {
                            h += `
                                <tr>
                                  <td>${item[0]}</td>
                                  <td>${item[1]}</td>
                                </tr>
                            `;
                        }
                        h += `</tbody>
                            </table>`;
                        alert(h, {
                            title: '常用代码',
                            btn_ok: '请求更多'
                        }).then(() => ipc_send('url', 'https://github.com/hunmer/mSearch/issues'))
                        break;
                    case 'btn_add':
                        g_hotkey.prompt_add();
                        return;

                    case 'btn_reset':
                        confirm('确定要重置吗?').then(() => {
                            g_hotkey.list = g_hotkey.defaultList;
                            g_hotkey.saveData();
                            toast('重置成功', 'success');
                        })
                        return;
                }
                //$(btn).parents('.modal').modal('hide');
            }
        });
        this.rendererList();
    },
    keydown: {},
    // 应用最新的按键状态（获取全局功能键状态）
    onKeydown: function(e) {
        this.keydown = e;
    },
    // 返回按键是否正激活
    isActive: function(k) {
        return this.keydown[k]
    },
    initEvent: function() {
        var self = this;
        window.onkeydown = function(e) {
            // if(g_setting.getConfig('hotkey')) return
            self.onKeydown(e)
            // console.log(self.getInputCode(e, 'key'));
            if ([16, 17, 18, 91, 9, 27, 13, 8, 20, 93].includes(e.keyCode)) { // 忽略功能按键
                return;
            }
            if ($('#modal_hotkey_edit.show').length) return;
            var editing = $('input:focus,textarea:focus').length;
            var d = self.list[self.getInputCode(e, 'key')];
            if (d) {
                if (!(editing && d.type == 1)) {
                    clearEventBubble(e);
                    return eval(d.content);
                }
            }
            var d = self.list[self.getInputCode(e, 'code')];
            if (d) {
                if (!(editing && d.type == 1)) {
                    clearEventBubble(e);
                    return eval(d.content);
                }
            }
        }
    },
    getInputCode: function(e, type = 'key') {
        var a = [];
        if (e.ctrlKey) a.push('ctrl');
        if (e.altKey) a.push('alt');
        if (e.shiftKey) a.push('shift');
        e[type] && a.push(e[type].toLowerCase());
        return a.join('+');
    }
}

g_hotkey.init();