var g_form = {
    init() {

    },
    getPreset(t) {
        switch (t) {
            case 'text':
                return `
                    <div class="mb-3">
                        <label class="form-label {required}">{title}</label>
                        <input id="{id}" placeholder="{placeholder}" type="text" class="form-control"/>
                    </div>
                `

            case 'checkbox':
                return `
                    <label class="form-check">
                        <input id="{id}" type="checkbox" class="form-check-input"/>
                        <span class="form-check-label {required}">{title}</span>
                      </label>
                `

            case 'switch':
                return `
                    <label class="form-check form-switch">
                      <input id="{id}" class="form-check-input" type="checkbox">
                      <span class="form-check-label {required}">{title}</span>
                    </label>
                `

            case 'radio':
                return `
                    <label class="form-check form-check-inline">
                        <input id="{id}" class="form-check-input" type="radio">
                        <span class="form-check-label {required}">{title}</span>
                      </label>
                `
        }
    },
    list: {},
    build(id, opts) {
        opts = Object.assign({

        }, opts)
        this.list[id] = opts
        let html = ''
        for (let [name, item] of Object.entries(opts.elements)) {
            let t = item.type || 'text'
            let h = item.html || this.getPreset(t)
            html += h
                .replace('{id}', name)
                .replace('{title}', item.title || '')
                .replace('{required}', item.required ? 'required' : '')
                .replace('{placeholder}', item.placeHolder || '')
        }
        return `<div id="form_${id}">` + html + '</div>';
    },

    // 对话框展示
    confirm(id, form_opts, modal_opts) {
        let onShow = modal_opts.onShow
        modal_opts.onShow = function(){
            $('#' + id).html(g_form.build(id, form_opts))
            g_form.update(id)
            typeof(onShow) == 'function' && onShow()
        }

        confirm(`<fieldset id="${id}" class="form-fieldset"></fieldset>`, modal_opts)
    },

    // 返回默认值变动过的列表
    getChanges(id){
        let r = {}
        let d = this.get(id)
        if(d.elements){
            let vals = this.getVals(id)
            for(let [k, v] of Object.entries(d.elements)){
                if(v.value != vals[k]){
                    r[k] = vals[k]
                }
            }
        }
        return r
    },

    update(id) {
        let div = this.getEle(id)
        if (div.length) {
            let d = this.get(id)
            for (let [id, attr] of Object.entries(d.elements)) {
                this.setInputVal(div.find('#' + id)[0], attr.value)
            }
        }
    },

    get(id) {
        return this.list[id]
    },

    getEle(id) {
        return $('#form_' + id)
    },

    setInputVal(dom, val) {
        switch (dom.type) {
            case 'checkbox':
            case 'switch':
            case 'radio':
                return dom.checked = Boolean(val)

            case 'text':
                return dom.value = val || ''
        }
    },

    getInputVal(dom) {
        if (dom.checked) return dom.checked === true;
        if (dom.selected) return dom.selected === true;
        if (dom.value && ['INPUT', 'TEXTAREA'].includes(dom.nodeName) && !['checkbox', 'radio'].includes(dom.type)) return dom.value || '';
        return false
    },

    setInvalid(id, key, invaild = true){
        let div = this.getEle(id)
        div.find('#'+key).toggleClass('is-invalid', invaild)
    },

    getVals(id) {
        let r = {}
        let div = this.getEle(id)
        if (div.length) {
            let d = this.get(id)
            for (let [id, attr] of Object.entries(d.elements)) {
                let input = div.find('#' + id)
                let val = this.getInputVal(input[0])
                if (attr.required) {
                    let invaild = typeof(val) == 'string' ? isEmpty(val) : val
                    input.toggleClass('is-invalid', invaild)
                    if (invaild) return
                    // <div class="invalid-feedback">Invalid feedback</div>
                }
                r[id] = val
            }
        }
        return r
    }

}

g_form.init()

// confirm(`<fieldset id="test" class="form-fieldset"></fieldset>`, {
//     title: '添加下载',
//     btn_ok: '添加',
//     onShow: () => {
//         $('#test').html(g_form.build('test', {
//             elements: {
//                 fileName: {
//                     title: '文件名',
//                     placeHolder: '输入文件名',
//                     value: 'aaa',
//                 },
//                 url: {
//                     title: '下载地址',
//                     placeHolder: '输入URL',
//                     required: true,
//                 },
//                 download: {
//                     title: '立即下载',
//                     type: 'checkbox',
//                     value: true,
//                 },
//                 switch: {
//                     title: '立即下载',
//                     type: 'switch',
//                     value: true,

//                 },
//                 radio: {
//                     title: '立即下载',
//                     type: 'radio',
//                     value: true,
//                 },
//             },
//         }))
//         g_form.update('test')
//     },
//     onBtnClick: (btn, modal) => {
//         if (btn.id == 'btn_ok') {
//              let vals = g_form.getVals('test')
//              console.log(vals)
//             return Object.keys(vals).length > 0
//         }
//     }
// })