var exec = require('child_process').exec

var dom
var cmdStr = 'ibtool /Users/nullluli/Desktop/Main.storyboard --objects --connections --hierarchy'
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

        var hierarchys = plist["com.apple.ibtool.document.hierarchy"]

        var hieDic = new Array()
        //生成一张view层次图
        for (var i = 0; i < hierarchys.length; i++) {
            var hierarch = hierarchys[i]

            let partHieDic = generateHierarchFrom(hierarch)
            hieDic.concat(partHieDic)
        }
        console.log(hieDic)

        function generateHierarchFrom(hierarchy) {
            var hieDic = new Array()
            let curID = hierarchy["object-id"]
            let children = hierarchy["children"]
            if (typeof(children) != "undefined") {
                for (var i = 0; i < children.length; i++) {
                    let child = children[i]
                    let childID = child["object-id"]
                    hieDic[childID] = curID
                    let hieDicOfChild = generateHierarchFrom(child)
                    hieDic = hieDic.concat(hieDicOfChild)
                }    
            }
            
            return hieDic
        }
        // //遍历objects，生成view
        // let objects = plist["com.apple.ibtool.document.objects"]
        // for (key in objects) {
        //     //首先是生成view代码
        //     //需要获取view name、class name
        //     let view = new ViewModule.View(key, plistCenter)            

        //     //需要过滤constrain
        //     console.log(view.descript)
        // }

        function getNameOf(id_lu) {
            var name = name_ID_Dic[id_lu]

            if (typeof (name) == "undefined") {
                let objectID = id_lu.replace('-', '')
                if (isCustomClass == true) {
                    name = objectClass.toLowerCase() + objectID.toLowerCase()
                } else {
                    let prefix = objectClass.substring(2, objectClass.length)
                    name = prefix + objectID
                }
            }
        }

        function getClassOf(id_lu) {
            let object = objects[key]
            var objectClass = object["ibExternalCustomClassName"]
            if (typeof (objectClass) == "undefined") {
                objectClass = object["class"]
                objectClass = objectClass.substring(2, objectClass.length)
                isCustomClass = false
            }
        }


        // relogNode(plist)

        function relogNode(node) {
            let nodeClassStr = Object.prototype.toString.call(node)
            if (nodeClassStr == '[object Object]') {
                for (var key in node) {
                    let item = node[key]
                    let success = handleItem(item)
                    if (success == false) {
                        console.log("key:" + key + "   node:" + node)
                    }
                }
            } else if (nodeClassStr == '[object Array]') {
                for (let i = 0; i < node.length; i++) {
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
                if (typeof (item) == 'undefined') {
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