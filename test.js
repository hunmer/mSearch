const aria2c = require('./aria2c.js')()
aria2c
	.on('addUri', v => {
		console.log('addUri', v)
	})
	.on('downloading', v => {
		console.log('downloading', v)
	})
	.on('complete', v => {
		console.log('complete', v)
	})
	.on('update', v => {
		if(v.progress){
			// { downloading: 0, complete: 1, error: 0, waitting: 0, progress: 100 }
		}
	})
	.init()


