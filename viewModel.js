var exec = require('child_process').exec

var dom
var cmdStr = 'ibtool /Users/nullluli/Desktop/Main.storyboard --connections'
exec(cmdStr, {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 5000 * 1024, // 默认 200 * 1024
    killSignal: 'SIGTERM'
}, function (err, stdout, stderr) {
    if (err) {
        console.log(cmdStr + ' error:' + stderr + "|||||| err:" + err)
    } else {
        var plist = require('plist').parse(stdout)
        relogNode(plist)

        function relogNode(node) {
            let nodeClassStr = Object.prototype.toString.call(node)
            if (nodeClassStr == '[object Object]') {
                for(var key in node) {
                    let item = node[key]
                    let success = handleItem(item)
                    if (success == false) {
                        console.log("key:" + key + "   node:" + node)
                    }
                }
            } else if (nodeClassStr == '[object Array]') {
                for(let i = 0; i < node.length; i++) {
                    let item = node[i]
                    let success = handleItem(item)
                    if (success == false) {
                        console.log("index:" + index + "   node:" + node)
                    }
                }
            } else {
                assert(false)
            }

            function handleItem(item) {
                let itemClassStr = Object.prototype.toString.call(item)
                if (typeof(item) == 'undefined'){
                    return false
                } else {
                    if (itemClassStr == '[object Array]' || itemClassStr == '[object Object]') {
                        relogNode(item)
                    } else {
                        console.log(item)
                    }
                }
            }
        }
        // var DOMParser = require('xmldom').DOMParser;
        // var doc = new DOMParser().parseFromString(stdout);
        // echoNode(doc.documentElement)
    }
})