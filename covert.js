var fs = require('fs')
var contentText = fs.readFileSync('Main.xml', "utf8")
//解析contenttext
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(contentText)

var $ = require("jquery")(dom.window)

var viewDic = new Array()
var viewNameIndex = 0

let unionClassNameList = ["view", "button", "textField", "label", "imageView", "switch","tableViewCell","tableView",]
for (const index in unionClassNameList) {
    let unionClassName = unionClassNameList[index]
    let eleList = dom.window.document.querySelectorAll(unionClassName)
    for (let index = 0; index < eleList.length; index++) {
        const element = eleList[index];
        let elementID = $(element).attr("id")
        let view = new View(elementID)
        viewDic[elementID] = view
    }
}

for (const key in viewDic) {
    if (viewDic.hasOwnProperty(key)) {
        const element = viewDic[key];
        // console.log(element)
        console.log("------------------------------")
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
            if (this.nameIndex == 0) {
                this.nameIndex = viewNameIndex + 1
                viewNameIndex = this.nameIndex
            }
            elementName = "view" + this.nameIndex
        }
        return elementName
    }
    this.nameIndex = 0
    this.class_lu = function () {
        let elementClass = $("#" + this.id_lu).attr("customClass")
        if (typeof (elementClass) == "undefined") {
            //使用默认class名称
            let tagName = $("#" + this.id_lu)[0].tagName
            tagName = tagName.toLowerCase()
            tagName = tagName.substring(0, 1).toUpperCase() + tagName.substring(1);
            elementClass = "UI" + tagName
        }
        return elementClass
    }
    this.attributes = function () {
        let attrList = $("#" + this.id_lu).attributes
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
            let constraintObj = new Constraint_lu($(constraint_lu).attr("id"))
            constraintObjList.push(constraintObj)
        }
        return constraintObjList
    }

    this.isRootView //是否是controller的root view

    this.fatherViewName = function () {
        let fatherEle = $("#" + this.id_lu).parentsUntil("RECT").last()
        fatherEle = $(fatherEle).parent()//rect
        fatherEle = $(fatherEle).parent()//view
        let fatherEleID = $(fatherEle).attr("id")
        if (typeof (fatherEleID) == "undefined") {
            this.isRootView = true
            console.log("控件未找到" + this.id_lu)
            //父控件是controller
            return
        }
        let fatherView = viewDic[fatherEleID]
        if (typeof (fatherView) == "undefined") {
            console.log("未收录控件，控件ID：" + fatherEleID + "  行动子view ID：" + this.id_lu)
            //父控件类型不在unionClassNameList
            return
        }
        return fatherView.name()
    }

    this.description = function () {
        if (typeof (this.name()) == "undefined") {
            //重名处理
            console.log("需要重名处理")
        } else {
            let initViewString = 'let ' + this.name() + " = " + this.class_lu() + "()"
            console.log(initViewString)
            if (this.isRootView == false) {
                if (typeof (this.fatherViewName()) == "undefined") {
                    //重名处理
                    console.log("father view需要特殊处理")
                } else {
                    let addSubviewString = this.fatherViewName() + ".addsubview(" + this.name() + ")"
                    console.log(addSubviewString)
                }
            }
            var constraintStrList = new Array()
            let constraintList = this.constraintList()
            for (let index = 0; index < constraintList.length; index++) {
                if (constraintList.hasOwnProperty(index)) {
                    const element = constraintList[index];
                    let constraintStr = element.description()
                    constraintStrList.push(constraintStr)
                    console.log(constraintStr)
                }
            }
        }
    }
}

function Constraint_lu(id_constraint) {
    this.id_lu = id_constraint
    this.firstItemID = function () {
        var firstItemID = $("#" + id_constraint).attr("firstItem")
        if (typeof (firstItemID) == "undefined") {
            //说明这个constrain是当前view的
            let parentView = $("#" + id_constraint).parent()
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
        if (viewDic.hasOwnProperty(this.firstItemID()) && viewDic.hasOwnProperty(this.secondItemID)) {
            let firstName = viewDic[this.firstItemID()].name()
            let secondName = viewDic[this.secondItemID].name()
            let des = firstName + '.' + this.firstAttribute + "Anchor.constraint(equalTo:" + secondName + "." + this.secondAttribute + "Anchor"
            if (typeof(this.constant) == "undefined") {
                des = des + ")"
            } else {
                des = des + ", constant: " + this.constant + ")"
            }
            des = des + ".isActive = true"
            return des
        }
    }
}