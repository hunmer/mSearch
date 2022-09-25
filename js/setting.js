var g_config
var g_setting = {
    default: {
        aria2c_path: __dirname + '\\bin\\',
        savePath: __dirname + '\\downloads\\'
    }, // 默认值,省的getConfig一个一个填


    init() {
        const self = this
        g_config = local_readJson('config', {

        });

        g_action.registerAction('settings', (dom, action, event) => {
            g_form.confirm('settings', {
                elements: {
                    savePath: {
                        title: '保存位置',
                        required: true,
                        value: getConfig('savePath'),
                        /*
                        <a data-action="setting_setSavePath" class="btn btn-white btn-icon" aria-label="Button">
                        <i class="ti ti-folder" title="打开"></i>
                      </a>
                        */
                    },
                    closeAfterDownloaded: {
                        title: '下载后关闭页面',
                        type: 'switch',
                        value: getConfig('closeAfterDownloaded')
                    },
                    networkListenter: {
                        title: '网络捕获',
                        type: 'switch',
                        value: getConfig('networkListenter')
                    },
                    downloadedHightlight: {
                        title: '高亮已下载',
                        type: 'switch',
                        value: getConfig('downloadedHightlight')
                    }
                },
            }, {
                id: 'settings',
                title: '设置',
                btn_ok: '保存',
                onBtnClick: (btn, modal) => {
                    if (btn.id == 'btn_ok') {
                        for (let [k, v] of Object.entries(g_form.getChanges('settings'))) {
                            setConfig(k, v)
                        }
                    }
                }
            })
        }).
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
            for (let web of $('webview')) {
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
            getEle('mute_toggle').toggleClass('text-primary', g_setting.getConfig('mute'))
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
        if (v == undefined) v = def || this.getDefault(k);
        return v;
    },

    toggleValue(k, b) {
        if (b == undefined) b = !this.getConfig(k);
        this.setConfig(k, b)
    },

    setDefault(k, v) {
        this.default[k] = v
    },

    getDefault(k) {
        return this.default[k]
    }

}

g_setting.init()

function getConfig(k, def) {
    return g_setting.getConfig(k, def)
}

function setConfig(k, v) {
    return g_setting.setConfig(k, v)
}