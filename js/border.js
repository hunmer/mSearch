var g_border = {
	init(){
		this.style = $(`<style>
			:root {
			    --offset-top: 30px !important;
			}

			#dragBar {
				position:fixed;
				top: 0;
				left:0;
				width: 100%;
				z-index: 99999;
			}

			#_title{
				padding: 5px;
				margin-left: 15px;
				-webkit-app-region: drag;
				width: 100%;
			}

			#traffic {
			    display: inline-flex;
			}

			#traffic div {
			    margin: 8px;
			    width: 15px;
			    height: 15px;
			    border-radius: 50%;
			    cursor: pointer;
			}

		</style>`).appendTo('body')

		this.bar = $(`<div id="dragBar" class="row">
			<div id="_title" class="col"><b>${document.title}</b></div>
			<div id="traffic" class="col-auto">
	            <div data-action="pin" style="line-height: 0px !important;"><i class="ti ti-pin"></i></div>
	            <div style="background-color: #55efc4" data-action="min"></div>
	            <div style="background-color: #ffeaa7" data-action="max"></div>
	            <div style="background-color: #ff7675" data-action="close"></div>
	        </div>
		</div>`).appendTo('body')

		setInterval(() => {
			let title = document.title
			if(title != self.title){
				self.title = title
				$('#_title').find('b').html(title)
			}
		}, 500)

		g_action.
		registerAction(['pin', 'max', 'min', 'close'], (dom, action) =>  ipc_send(action[0]))
	},

	destroy(){
		this.style.remove()
		this.bar.remove()
	}
}

g_border.init()