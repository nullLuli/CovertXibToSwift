var fs = require('fs')
var contentText = fs.readFileSync('Main.xml', "utf8")
//解析contenttext
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(contentText)

var $ = require("jquery")(dom.window)

var viewDic = new Array()

let unionClassName = "view"
let eleList = dom.window.document.querySelectorAll(unionClassName)
for (let index = 0; index < eleList.length; index++) {
    const element = eleList[index];
    let elementID = $(element).attr("id")
    let view = new View(elementID)
    viewDic[elementID] = view
}

for (const key in viewDic) {
    if (viewDic.hasOwnProperty(key)) {
        const element = viewDic[key];
        // console.log(element)
        element.description()
    }
}

//生成一个模型
function View(id_lu) {
    this.id_lu = id_lu
    this.name = function () {
        //找出这个view的名字
        let selectNameString = "outlet[destination$='" + this.id_lu + "']"
        let elementName = $(selectNameString).attr("property")
        if (typeof (elementName) == "undefined") {
            //重名处理
        }
        return elementName
    }
    this.class_lu = function () {
        let elementClass = $("#"+this.id_lu).attr("customClass")
        if (typeof (elementClass) == "undefined") {
            //使用默认class名称
            let tagName = $(selectNameString).tagName
            tagName = tagName.substring(0,1).toUpperCase()+tagName.substring(1);
            elementClass = "UI" + tagName
        }
        return elementClass
    }
    this.attributes = function () {
        let attrList = $("#"+this.id_lu).attributes
        var attrStringList = new Array(attrList.length)  //需要写入文件
        for (let index = 0; index < attrList.length; index++) {
            const attr = attrList.item(index)
            let attrString = elementName + "." + attr.name + " = " + attr.value
            attrStringList.push(attrString)
        }
        return attrStringList
    }
    this.constraintList = function () {
        //找到所有ID相关的layout，然后生成
        let selectLayoutString = "constraint[firstItem$='" + this.id_lu + "']"
        let constraintList = $(selectLayoutString)
        var constraintObjList = new Array(constraintList.length)
        for (let index = 0; index < constraintList.length; index++) {
            const constraint_lu = constraintList[index];
            let constraintObj = Constraint_lu($(constraint_lu).attr("id"))
            constraintObjList.push(constraintObj)
        }
        return constraintObjList
    }

    this.fatherViewName = function () {
        let fatherEle = $("#"+this.id_lu).parentNode
        let fatherEleID = $(fatherEle).attr("id")
        let fatherView = viewDic[fatherEleID]
        if (typeof(fatherView) == "undefined"){
            return "fatherViewName"
        }
        return fatherView.name()
    }

    this.description = function () {
        let initViewString = 'let ' + this.name() + "= " + this.class_lu() + "()"
        console.log(initViewString)
        let addSubviewString = this.fatherViewName() + ".addsubview(" + this.name() + ")"
        console.log(addSubviewString)
        var constraintStrList = new Array()
        let constraintList = this.constraintList()
        for (let index = 0; index < constraintList.length; index++) {
            const element = constraintList[index];
            let constraintStr = element.description()
            constraintStrList.push(constraintStr)
            console.log(constraintStr)
        }
    }
}

function Constraint_lu(id_constraint) {
    this.id_lu = id_constraint
    this.firstItemID = function () {
        var firstItemID = $("#" + id_constraint).attr("firstItem")
        if (typeof (firstItemID) == "undefined") {
            //说明这个constrain是当前view的
            let parentView = $("#" + id_constraint).parentNode
            firstItemID = $(parentView).attr("id")
            if (typeof (firstItemID) == "undefined") {
                console.log("constraint还是没获取到firstItem id")
            }
        }
        return firstItemID
    }
    this.secondItemID = $("#" + id_constraint).attr("secondItem")
    this.firstAttribute = $("#" + id_constraint).attr("firstAttribute")
    this.secondAttribute = $("#" + id_constraint).attr("secondAttribute")
    this.constant = $("#" + id_constraint).attr("constant")

    this.description = function () {
        let firstName = viewDic[this.firstItemID()].name()
        let secondName = viewDic[this.secondItemID].name()
        let des = firstName + '.' + this.firstAttribute + "Anchor.constraint.(equalTo:" + secondName + "." + this.secondAttribute + "Anchor, constant: " + this.constant + ").isActive = true"
        return des
    }
}