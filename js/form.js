var g_form = {
    init() {

    },
    getPreset(n, d) {
        switch (d.type) {
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

            case 'datalist':
                return `
                    <label class="form-label">{title}</label>
                    <input id="{id}" class="form-control" list="detalist_{id}" placeholder="{placeholder}">
                    <datalist id="detalist_{id}">
                    ${(() => {
                        let h = ''
                        let vals = Object.values(d.list)
                        let keys = Array.isArray(d.list) ? [...vals] : Object.keys(d.list)
                        keys.forEach((k, i) => {
                            h += `<option value="${k}" ${k == d.value ? 'selected' : ''}>${vals[i]}</option>`
                        })
                        return h
                    })()}
                    </datalist>
                `

             case 'textarea': 
                return `
                    <label class="form-label {required}">{title}</label>
                    <textarea id="{id}" rows="{rows}" placeholder="{placeholder}" class="form-control"/></textarea>
                `

            default: 
                return `
                    <label class="form-label {required}">{title}</label>
                    <input id="{id}" placeholder="{placeholder}" type="text" class="form-control"/>
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
            let h = item.html || `
             <div class="mb-3">` + this.getPreset(name, item) + '</div>'
            html += h
                .replaceAll('{id}', name)
                .replaceAll('{title}', item.title || '')
                .replaceAll('{rows}', item.rows || 3)
                .replaceAll('{required}', item.required ? 'required' : '')
                .replaceAll('{placeholder}', item.placeHolder || '')
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
            case 'datalist':
                return dom.checked = Boolean(val)

            case 'text':
            case 'textarea':
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
//                 text: {
//                     title: 'text',
//                     placeHolder: '...',
//                     value: 'aaa',
//                 },
//                 textarea: {
//                     title: 'textarea',
//                     type: 'textarea',
//                     rows: 3,
//                     placeHolder: '...',
//                     value: 'aaa',
//                 },
//                 checkbox: {
//                     title: 'checkbox',
//                     type: 'checkbox',
//                     value: true,
//                 },
//                 switch: {
//                     title: 'switch',
//                     type: 'switch',
//                     value: true,

//                 },
//                 radio: {
//                     title: 'radio',
//                     type: 'radio',
//                     value: true,
//                 },
//                 datalist: {
//                     title: 'datalist',
//                     type: 'datalist',
//                     list: {
//                         k1: '啊',
//                         k2: '额',
//                         k3: 'v3',
//                     },
//                     value: 'k2',
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