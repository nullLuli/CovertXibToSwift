var ViewModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/view")

exports.Controller = function ($, id_control) {
    this.$ = $
    this.id_lu = id_control
    this.class_lu = function () {
        let elementClass = this.$("#" + this.id_lu).attr("customClass")
        if (typeof (elementClass) == "undefined") {
            //使用默认class名称
            let tagName = this.$("#" + this.id_lu)[0].tagName
            tagName = tagName.toLowerCase()
            tagName = tagName.substring(0, 1).toUpperCase() + tagName.substring(1);
            elementClass = "UI" + tagName
        }
        return elementClass
    }

    this.rootView = function () {
        //tableViewController
        //解析出controller root view标签名
        let tagName = this.$("#" + this.id_lu)[0].tagName
        let rootViewTagName = tagName.substring(0, tagName.length - 10)
        console.log(rootViewTagName)
        let rootView = this.$("#" + this.id_lu).children(rootViewTagName)
        let rootViewID = this.$(rootView).attr("id")
        let rootViewObj = ViewModule.View(this.$, rootViewID, true, this)
        return rootViewObj
    }

    this.viewNameIndex = 0

    let unionClassNameList = ["view", "button", "textField", "label", "imageView", "switch", "tableViewCell", "tableView"] //可以根据Xcode中所有view来补全数组
    var viewDic = new Array()
    for (const index in unionClassNameList) {
        let unionClassName = unionClassNameList[index]
        let upUnionClassName = unionClassName.toUpperCase()
        let viewList = this.$("#" + this.id_lu).find(upUnionClassName)
        for (let index = 0; index < viewList.length; index++) {
            const element = viewList[index];
            console.log("遍历子view")
            let elementID = $(element).attr("id")
            console.log("子view ID:" + elementID)
            let view = new ViewModule.View($, elementID, false, this)
            viewDic[elementID] = view
        }
    }
    this.viewDic = viewDic

    for (const key in viewDic) {
        if (viewDic.hasOwnProperty(key)) {
            const element = viewDic[key];
            // console.log(element)
            console.log("------------------------------")
            element.description()
        }
    }
}