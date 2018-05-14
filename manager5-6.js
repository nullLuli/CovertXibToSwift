var exec = require('child_process').exec

var dom
var cmdStr = 'ibtool /Users/nullluli/Desktop/SomeXib.xib --objects --connections --hierarchy'
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
        var PlistCenterModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/plistData")
        var plistCenter = new PlistCenterModule.PlistCenter(plist)
        var ViewModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/view5-6")
        var ControllerModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/controller5-10")
        var ConstraintModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/constraint")

        var hierarchys = plist["com.apple.ibtool.document.hierarchy"]
        let objects = plist["com.apple.ibtool.document.objects"]

        if (cmdStr.indexOf("storyboard") != -1) {
            //是storyboard
            //想要生成层次，hierarchys是最合适的遍历格式
            for (var i = 0; i < hierarchys.length; i++) {
                var hierarch = hierarchys[i]
                //最上层应该是controller
                let id_lu = hierarch["object-id"]
                let type = plistCenter.getTypeOf(id_lu)
                if (type == plistCenter.ObjectType.Controller) {
                    let control = new ControllerModule.Controller(id_lu, plistCenter)
                    console.log(control.description)
                }
            }
        } else {
            //是xib
            for (key in objects) {
                let type = plistCenter.getTypeOf(key)
                if (type == plistCenter.ObjectType.View) {
                    let control = new ViewModule.View(key, plistCenter)
                    console.log(control.description)
                }
            }
        }
    }
})