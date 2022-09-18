const fs = require('fs')

module.exports = function(opts) {
    return {
        list: {},
        aria2_start: function() {
            const self = this
            const Aria2 = require("aria2")
            let aria2 = new Aria2([{
                host: 'localhost',
                port: 6809,
                secure: false,
                secret: '',
                path: '/jsonrpc'
            }]);
            aria2.on("onDownloadStart", ([d]) => {
                self.event_task_item('downloading', d.gid);
            });

            aria2.on("onDownloadComplete", ([d]) => {
                self.event_task_item('complete', d.gid);
            });

            aria2.on("onDownloadPause", ([d]) => {
                self.event_task_item('pause', d.gid);
            });

            aria2.on("onDownloadStop", ([d]) => {
                self.event_task_item('stop', d.gid);
            });

            aria2.on("onDownloadError", ([d]) => {
                self.event_task_item('error', d.gid);
            });

            aria2
                .open()
                .then(async () => {
                    self.callEvent('conect_success')
                })
                .catch(err => {
                    self.callEvent('connect_error')
                    if (!this.startup) {
                        this.startup = true;
                        let path = __dirname + '\\bin\\'
                        require('child_process').execFile(path + 'aria2c_start.bat', [], { cwd: path }, function(error, stdout, stderr) {
                            console.log(error);
                            console.log(stdout)
                        })
                        setTimeout(() => this.aria2_start(), 2000);
                    }
                });

            this.aria2 = aria2
        },
        init: function() {
            this.aria2_start()
            setInterval(() => this.task_update(), 1000);
            setInterval(() => {
                this.aria2.multicall([['getGlobalStat'], ['tellActive']]).then(r => {
                    $('#badge_downloadSpeed').html(`${renderSize(Number(r[0][0].downloadSpeed))}`)
                })
            }, 2000);
            return this;
        },

        task_get: function(id, create = false) {
            if (!this.list[id]) {
                this.list[id] = {
                    guids: {},
                    complted: 0,
                }
            }
            return this.list[id];
        },

        task_list_add: function(id, items) {
                console.log(id, items)

            return new Promise(resolve => {
                var urls = [];
                console.log(id, items)
                for (var item of items) {
                    var { pathName, fileName, url } = item;
                    if (!fs.existsSync(pathName + '/' + fileName)) {
                        this.callEvent('addUri', Object.assign(item, {
                            id: id
                        }))
                        urls.push(['addUri', [url], { dir: pathName, out: fileName }]);
                    }
                }
                if (urls.length) {
                    this.aria2.multicall(urls).then(results => {
                        this.task_list_set(id, results);
                        resolve(results);
                    })
                } else {
                    resolve([]);
                }
            });
        },

        task_list_set: function(id, guids) {
            var data = this.task_get(id, true);
            for (var guid of guids) {
                data.guids[guid] = 'waitting';
            }
        },

        task_list_get: function(id, type) {
            var r = [];
            var data = this.task_get(id);
            if (!data) return;
            for (var guid in data.guids) {
                if (data.guids[guid] == type) {
                    r.push(guid);
                }
            }
            return r;
        },

        task_list_item_get: function(guid) {
            for (var id in this.list) {
                if (this.list[id].guids[guid]) return { id: id, guid: guid };
            }
            return {};
        },

        task_item_set: function(id, guid, vals) {
            this.list[id].guids[guid] = vals;
            this.callEvent(vals, {id: id, guid: guid})
        },

      
        event_task_item: function(event, guid) {
            var { id, guid } = this.task_list_item_get(guid);
            if (id) {
                this.task_item_set(id, guid, event);
                // console.log(event, { id: id, guid: guid });
            }
        },

        task_update: function() {
            var r = {};
            for (var id in this.list) {
                if (this.list[id].done) continue;
                var keys = ['downloading', 'complete', 'error', 'waitting'];
                for (var key of keys) r[key] = 0;
                var max = 0;
                for (var guid in this.list[id].guids) {
                    var val = this.list[id].guids[guid];
                    if (!keys.includes(val)) val = 'waitting';
                    r[val]++;
                    max++;
                }
                r.progress = parseInt(r.complete / max * 100);
                if (r.progress == 100) {
                    delete this.list[id];
                } else
                if (r.waitting == 0 && r.error) {
                    this.task_list_get(id, 'error')
                }
            }
            this.callEvent('update', r)

           

        },

        // events 
        events: {},
          callEvent: function(event, vals){
            this.events[event] && this.events[event](vals)
        },

        on: function(event, callback){
            this.events[event] = callback
            return this
        },

    }
}