var g_sidebar = {
    // 移除style
    style_remove() {
        if (this.style) {
            this.style.remove()
            delete this.style
        }
    },
    // 初始化style
    style_init() {
        let css = `
    		.sidebar {
    			display: none;
    			position: fixed;
				width: 200px;
				overflow-y: auto;
				height: calc(100vh - var(--offset-top));
				transition: margin 0.25s ease-out;
    		}
    	`;
        for (let [type, obj] of Object.entries(this.list)) css += obj.style
        this.style = $(`<style>${css}</style>`).appendTo('body')
    },

    init() {
    	let self = this
    	g_action.registerAction('sidebar_toggle', (dom, action) => {
    		self.toggle(action[1])
    	})
        g_sidebar.register('left', {
            html: `
				<div>
					
				</div>
			`,
            style: `
				#sidebar_left {
	    			left: 0;
					top: var(--offset-top);
					margin-left: 0px;
	    		}

	    		#sidebar_left.hideSidebar {
					margin-left: -200px;
	    		}

	    		main[sidebar-left]{
					padding-left: 200px;
	    		}
			`,
			onShow: e => {
				getEle('sidebar_toggle,left').addClass('text-primary')
			},
			onHide: e => {
				getEle('sidebar_toggle,left').removeClass('text-primary')
			},
        })

         g_sidebar.show('left')
        // setTimeout(() => g_sidebar.hide('left'), 1000)

      /*   g_sidebar.register('top', {
            style: `
				#sidebar_top {
	    			right: 0;
					top: 0;
					height: 100px;
					width: 100vw;
					margin-top: 0px;
	    		}

	    		#sidebar_top.hideSidebar {
					margin-top: -200px;
	    		}

	    		main[sidebar-top]{
					padding-top: 200px;
	    		}
			`,
        })

         g_sidebar.register('right', {
            style: `
				#sidebar_right {
	    			right: 0;
					top: 0;
					margin-right: 0px;
	    		}

	    		#sidebar_right.hideSidebar {
					margin-right: -200px;
	    		}

	    		main[sidebar-right]{
					padding-right: 200px;
	    		}
			`,
           
        })

         g_sidebar.register('bottom', {
            style: `
				#sidebar_bottom {
	    			right: 0;
					bottom: 0;
					height: 100px;
					width: 100vw;
					margin-bottom: 0px;
	    		}

	    		#sidebar_bottom.hideSidebar {
					margin-bottom: -200px;
	    		}

	    		main[sidebar-bottom]{
					padding-bottom: 200px;
	    		}
			`,
        })*/
    },

    list: {},
    register(type, opts) {
        opts = Object.assign({
            css: '',
            html: '',
            onShow: () => {},
            onHide: () => {},
        }, opts)
        this.list[type] = opts

        this.style_init()
        this.load(type)
    },

    get(type) {
        return this.list[type]
    },

    load(type) {
        let d = this.get(type)
        if (!d) return

        let id = 'sidebar_' + type
        let div = $(id)
        if (div.length) {
            div.html(d.html)
        } else {
            div = $(`
				<div class="sidebar" id="${id}" style="${d.css}">
					${d.html}
				</div>
			`).appendTo('main')
        }
    },

    sidebar_get(type) {
        return $('#sidebar_' + type)
    },

    show(type) {
        let div = this.sidebar_get(type)
        // todo call event
        if (div.length) {
            div.show().removeClass('hideSidebar')
            $('main').attr('sidebar-' + type, true)

            let opts = this.get(type)
            opts.onShow && opts.onShow.call(div)
        }
    },

    isShowing(type){
    	let div =  this.sidebar_get(type)
    	return div.length && !div.hasClass('hideSidebar')
    },

    toggle(type){
    	if(this.isShowing(type)){
    		this.hide(type)
    	}else{
    		this.show(type)
    	}
    },

    hide(type) {
        let div = this.sidebar_get(type)
        // todo call event
        if (div.length) {
            div.addClass('hideSidebar')
            $('main').attr('sidebar-' + type, null)

            let opts = this.get(type)
            opts.onHide && opts.onHide.call(div)
        }
    }
}

g_sidebar.init()