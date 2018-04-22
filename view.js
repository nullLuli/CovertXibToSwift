exports.View = function ($, id_lu, isRootView, controller) {
    this.$ = $
    this.id_lu = id_lu
    this.isRootView = isRootView //是否是controller的root view
    this.controller = controller

    this.name = function () {
        //找出这个view的名字
        let selectNameString = "outlet[destination$='" + this.id_lu + "']"
        let elementName = this.$(selectNameString).attr("property")
        if (typeof (elementName) == "undefined") {
            //重名处理
            if (this.nameIndex == 0) {
                this.nameIndex = this.controller.viewNameIndex + 1
                this.controller.viewNameIndex = this.nameIndex
            }
            elementName = "view" + this.nameIndex
        }
        return elementName
    }
    this.nameIndex = 0
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
    this.attributes = function () {
        let attrList = this.$("#" + this.id_lu).attributes
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
        let constraintList = this.$(selectLayoutString)
        var constraintObjList = new Array(constraintList.length)
        for (let index = 0; index < constraintList.length; index++) {
            const constraint_lu = constraintList[index];
            let constraintObj = new Constraint_lu(this.$, this.$(constraint_lu).attr("id"), this.controller)
            constraintObjList.push(constraintObj)
        }
        return constraintObjList
    }

    this.fatherViewName = function () {
        let fatherEle = this.$("#" + this.id_lu).parentsUntil("RECT").last()
        fatherEle = this.$(fatherEle).parent()//rect
        fatherEle = this.$(fatherEle).parent()//view
        let fatherEleID = this.$(fatherEle).attr("id")
        if (typeof (fatherEleID) == "undefined") {
            console.log("控件未找到" + this.id_lu)
            //父控件是controller
            return
        }
        let fatherView = this.controller.viewDic[fatherEleID]
        if (typeof (fatherView) == "undefined") {
            //父控件类型不在unionClassNameList
            //当成特殊控件来处理，用key来做父控件名
            let key = this.$("#" + fatherEleID).attr("key")
            if (typeof(key) == "undefined") {
                console.log("未收录控件，控件ID：" + fatherEleID + "  行动子view ID：" + this.id_lu)
                return
            } else {
                let grandFatherEle = this.$("#" + fatherEleID).parentsUntil("RECT").last()
                grandFatherEle = this.$(grandFatherEle).parent()//rect
                grandFatherEle = this.$(grandFatherEle).parent()//view
                let grandFatherEleID = this.$(grandFatherEle).attr("id")
                let grandFatherView = this.controller.viewDic[grandFatherEleID]
                if (typeof (grandFatherView) == "undefined") {
                    console.log("层次关系需特殊处理，控件ID：" + fatherEleID + "  行动子view ID：" + this.id_lu)
                    return
                } else {
                    //隔代遗传
                    return grandFatherView.name() + "." + key
                }
            }
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

function Constraint_lu($, id_constraint, controller) {
    this.$ = $
    this.id_lu = id_constraint
    this.controller = controller

    this.firstItemID = function () {
        var firstItemID = this.$("#" + id_constraint).attr("firstItem")
        if (typeof (firstItemID) == "undefined") {
            //说明这个constrain是当前view的
            let parentView = this.$("#" + id_constraint).parent()
            firstItemID = this.$(parentView).attr("id")
            if (typeof (firstItemID) == "undefined") {
                console.log("constraint还是没获取到firstItem id")
            }
        }
        return firstItemID
    }
    this.secondItemID = this.$("#" + id_constraint).attr("secondItem")
    this.firstAttribute = this.$("#" + id_constraint).attr("firstAttribute")
    this.secondAttribute = this.$("#" + id_constraint).attr("secondAttribute")
    this.constant = this.$("#" + id_constraint).attr("constant")

    this.description = function () {
        if (this.controller.viewDic.hasOwnProperty(this.firstItemID()) && this.controller.viewDic.hasOwnProperty(this.secondItemID)) {
            let firstName = this.controller.viewDic[this.firstItemID()].name()
            let secondName = this.controller.viewDic[this.secondItemID].name()
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