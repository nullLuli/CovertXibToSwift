var fs = require('fs')
var contentText = fs.readFileSync('Main.xml', "utf8")
//解析contenttext
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(contentText)

var $ = require("jquery")(dom.window)
var NodeType = {Control: 1, View: 2, Attribute: 3, Mark: 4}
console.log("getNameTest:" + getViewNameOf("Bpl-Ez-KjQ"))
console.log("getNameTest:" + getViewNameOf("vVA-AO-dRw"))
console.log("getNameTest:" + getViewNameOf("U4V-k2-OPR"))

console.log("getFatherViewIDOf:" + getFatherViewIDOf("Bpl-Ez-KjQ"))
console.log("getFatherViewIDOf:" + getFatherViewIDOf("vVA-AO-dRw"))
console.log("getFatherViewIDOf:" + getFatherViewIDOf("U4V-k2-OPR"))

/********************下面是正文********************/


function getViewNameOf(id_lu) {
    //找出这个view的名字
    let selectNameString = "outlet[destination$='" + id_lu + "']"
    let elementName = $(selectNameString).attr("property")
    if (typeof (elementName) == "undefined") {
        let parentNode = $("#" + id_lu)[0].parentNode
        let parentNodeID = $(parentNode).attr("id")
        if (isControl(parentNodeID)) {
            //root view 无需重命名
            elementName = "view"
            return elementName
        }
        //重名处理
        let controlID = getControlOf(id_lu)
        let nameIndex = $("#" + id_lu).index()
        elementName = "view" + nameIndex
    }
    return elementName
}

function isControl(id_lu) {
    //根据ID判断该标签是不是control
    if (typeof(id_lu) == "undefined") {
         return false 
    }
    let tagName = $("#" + id_lu)[0].tagName
    if (tagName.indexOf("CONTROLLER") >= 0) {
        return true
    }
    return false
}

function getControlOf(id_lu) {
    //从给定ID找出ID所属control
    var controlID
    var id_current = getNextID(id_lu)
    while (true) {
        if (isControl(id_current)) {
            controlID = id_current
            break
        }
        id_current = getNextID(id_current)
    }

    return id_current
}

function getNextID(id_lu) {
    var parentNode = $("#" + id_lu)[0].parentNode
    var id_current = $(parentNode).attr("id")
    while (parentNode.tagName != "DOCUMENT") {
        if (typeof(id_current) == "undefined") {
            parentNode = parentNode.parentNode
            id_current = $(parentNode).attr("id")
        } else {
            break
        }
    }
    return id_current
}

function getFatherViewIDOf(id_lu) {
    //返回值是数组，第一个参数是父node类型，第二个参数是父node ID
    let parentNode = $("#" + id_lu)[0].parentNode
    if (parentNode.tagName == "SUBVIEWS") {
        parentNode = parentNode.parentNode
        let parentID = $(parentNode).attr("id")
        if (parentID != "undefined") {
            return [NodeType.View, parentID]
        } else {
            console.log("没找到父view ID：" + id_lu)
        }
    } else if (isControl($(parentNode).attr("id"))) {
        return [NodeType.Control, $(parentNode).attr("id")]
    } else {
        console.log("没找到父view ID：" + id_lu)
    }
}