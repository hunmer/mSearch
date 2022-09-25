var g_app = {

    init: function() {
        g_action.
        registerAction('about', dom => {
            alert(`
			<div class="row">
				<div class="card">
                  <div class="card-body p-4 text-center">
                    <span class="avatar avatar-xl mb-3 avatar-rounded" style="background-image: url(https://github.com/hunmer.png)"></span>
                    <h3 class="m-0 mb-1"><a href='#' onclick="ipc_send('url', 'https://github.com/hunmer')">@Hunmer</a></h3>
                    <div class="text-muted">liaoyanjie2000@gmail.com</div>
                    <div class="mt-3">
                      <span class="badge bg-purple-lt">DEV</span>
                    </div>
                  </div>
                  <div class="ribbon bg-yellow fs-3 cursor-pointer" data-action="homepage">
                  	<b>给个Star呗~</b>
                  	<i class="ti ti-star ms-2" title="给星星"></i>
				  </div>
				  <div class="card-body">
				    <ul class="list list-timeline" id='update_logs'>
				    </ul>
				  </div>
                </div>
			</div>
		`, {
                title: '关于',
                id: 'about',
                static: false,
                onShow: () => {
                    this.update_setLogs({
                        '1.0.2': {
                            date: '2022/9/26',
                            title: '4项更新',
                            text: `
                            红绿灯窗口</br>
                            网络请求监控</br>
                            热更新</br>
                            aria2c自定义</br>
                        `
                        },

                        '1.0.1': {
                            date: '2022/9/18',
                            title: '5项更新',
                            text: `
		                	插件系统</br>
		            		脚本系统</br>
		            		暗色主题，分栏显示</br>
                            界面调整</br>
		            		新增影视站点</br>
		                `
                        },
                        '1.0.0': {
                            date: '2022/9/15',
                            title: '软件发布',
                            text: '基本功能实现'
                        }
                    })
                }
            })
        }).
        registerAction('homepage', () => ipc_send('url', 'https://github.com/hunmer/mSearch'))


    },

    update_setLogs(data) {
        let h = ''
        for (let [v, d] of Object.entries(data)) {
            h += `
				<li>
			        <div class="list-timeline-icon bg-twitter">${v}</div>
			        <div class="list-timeline-content">
			          <div class="list-timeline-time">${d.date}</div>
			          <p class="list-timeline-title">${d.title}</p>
			          <span class="text-muted">${d.text}</span>
			        </div>
			      </li>
			`
        }
        $('#update_logs').html(h)
    },


}

g_app.init()