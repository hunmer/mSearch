var g_config
var g_setting = {
    init() {
        const self = this

        g_config = local_readJson('config', {

        });

        g_action.registerAction('settings', (dom, action, event) => {
            alert(`
                <div class="mb-3">
                  <label class="form-label">保存设置</label>
                  <div class="row g-2">
                    <div class="col">
                      <input id="input_savePath" type="text" value="${self.getConfig('savePath', '')}" class="form-control" placeholder="保存位置">
                    </div>
                    <div class="col-auto">
                      <a data-action="setting_setSavePath" class="btn btn-white btn-icon" aria-label="Button">
                        <i class="ti ti-folder" title="打开"></i>
                      </a>
                    </div>
                  </div>
                </div>

              <div class="mb-3">
                <div class="form-label">开关</div>
                <label class="form-check form-switch">
                  <input id="checkbox_closeAfterDownloaded" class="form-check-input" type="checkbox" ${self.getConfig('closeAfterDownloaded') ? 'checked=""' : ''}>
                  <span class="form-check-label">下载后关闭页面</span>
                </label>
              </div>
            `, {
                title: '设置',
                id: 'settings',
                width: '80%',
                static: false,
                hotkey: true,
                buttons: [{
                    text: '保存',
                    class: 'btn-primary',
                    default: true,
                    onClick: e => {
                        self.setConfig('savePath', $('#input_savePath').val())
                        self.setConfig('closeAfterDownloaded', $('#checkbox_closeAfterDownloaded').prop('checked'))
                        g_toast.toast('保存成功')
                    }
                }]
            })
        })
        // g_action.do(null, 'settings')
        g_action.
        registerAction('setting_setSavePath', dom => {
            g_pp.set('savePath', path => $('#input_savePath').val(path[0]));
            ipc_send('fileDialog', {
                id: 'savePath',
                title: '选中目录',
                properties: ['openDirectory'],
            })
        })
        .registerAction('mute_toggle', dom => {
            g_setting.setConfig('mute', !$(dom).hasClass('text-primary'))
        }).
        registerAction('toggle_columns', dom => {
            g_setting.setConfig('columns', !$(dom).hasClass('text-primary'))
        }).
        registerAction('theme_toggle', dom => {
            g_setting.setConfig('darkMode', !$('body').hasClass('theme-dark'))
        })

        g_setting.
        onSetConfig('columns', b => {
            getEle('toggle_columns').toggleClass('text-primary', b)
            $('._content').removeClass(b ? 'col-12' : 'col-6').addClass(b ? 'col-6' : 'col-12')
        }).
        onSetConfig('darkMode', b => {
            getEle('theme_toggle').toggleClass('text-primary', b)
            $('body').toggleClass('theme-dark', b)
        }).
        onSetConfig('mute', b => {
            getEle('mute_toggle').toggleClass('text-primary', b)
            for(let web of $('webview')){
                web.setAudioMuted(b)
            }
            // toast((b ? '开启' : '关闭') + '静音', 'success')
        })

        self.onSetConfig('savePath', path => {
            $('#input_savePath').val(path)
        })

        $(function() {
            g_setting.getConfig('darkMode') && g_setting.call('darkMode', true)
            g_setting.getConfig('columns') && g_setting.call('columns', true)
            g_setting.getConfig('ruleDisabled') && g_setting.call('ruleDisabled', true)
            getEle('mute_toggle').toggleClass('text-primary', g_setting.getConfig('mute') )
        });

    },

    bind: {},
    onSetConfig(k, callback) {
        this.bind[k] = callback
        return this;
    },

    call(k, v) {
        if (this.bind[k]) {
            return this.bind[k](v)
        }
    },

    setConfig(k, v) {
        g_config[k] = v;
        if (this.call(k, v) === false) return;
        local_saveJson('config', g_config);
    },

    getConfig(k, def) {
        var v = g_config[k];
        if (v == undefined) v = def;
        return v;
    },

    toggleValue: function(k, b){
        if(b == undefined) b = !this.getConfig(k);
        this.setConfig(k, b)
    }

}

g_setting.init()