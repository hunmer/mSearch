var g_tabler = {

    bind_all() {
        
    },
    init() {
        // $(document).
        // $(this.bind_all());
        // .on('click', 'a[data-bs-toggle]', function(e){
        //     let action = this.dataset.action_toggle
        //     console.log(action)
        // })
    },

    build_accordion(opts) {
        let groups = {}
        opts = Object.assign({
            onOpen: e => {},
            onClose: e => {},
            collapse_start: '',
            collapse_end: '',
            emptyName: '默认分组'
        }, opts)
        opts.datas.every((item, i) => {
            if (!groups[item.group]) groups[item.group] = []
            groups[item.group].push(i)
            return true
        })
        let h = '';
        let id = opts.id || new Date().getTime()
        for (let group in groups) {
            h += `
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${id}-${group}">
                      <button data-collapse="${group}" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${id}-${group}" aria-expanded="true">
                        ${group || opts.emptyName}
                      </button>
                    </h2>

                    <div id="collapse-${id}-${group}" class="accordion-collapse collapse ${group == opts.default ? 'show' : ''}" data-bs-parent="#accordion-${id}">
                          <div class="accordion-body pt-0" >
                          ${opts.collapse_start}
            `
            for (let index of groups[group]) {
                let item = opts.datas[index]
                h += item.html
            }
            h += `${opts.collapse_end}
                          </div>
                    </div>
                  </div>`
        }

        let div = $(`<div class="accordion" id="accordion-${id}">` + h + '</div>')
        div.find('[data-bs-toggle="collapse"]').on('click', function(e) {
            if (this.classList.contains('collapsed')) { // 关闭
                opts.onClose.call(this, e)
            } else {
                opts.onOpen.call(this, e)
            }
        })
        return div
    }
}

g_tabler.init();
// $('#sidebar_left').html(
//     g_tabler.build_accordion({
//         datas: [{
//             html: 'a',
//             group: 'group-a',
//         }, {
//             html: 'b',
//             group: 'group-b',
//         }, {
//             html: 'c',
//             group: 'group-a',
//         }]
//     })
// )