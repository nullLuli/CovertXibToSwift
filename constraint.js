exports.Constraint = function(id_lu, plistCenter) {
    this.id_lu = id_lu
    this.plistCenter = plistCenter

    this.firstItemName = plistCenter.getConstraintItemNameOf(id_lu, true)

    this.secondItemName = plistCenter.getConstraintItemNameOf(id_lu, false)

    this.firstAttribute = plistCenter.getConstraintAttriOf(id_lu, true)

    this.secondAttribute = plistCenter.getConstraintAttriOf(id_lu, false)

    this.constant = plistCenter.getConstraintContantOf(id_lu)

    this.multiplier = plistCenter.getConstraintMultiplierOf(id_lu)

    //还要支持priority、relation

    var description 
    if (typeof (this.firstItemName) != "undefined" && typeof (this.secondItemName) != "undefined") {
        let des = this.firstItemName + '.' + this.firstAttribute + "Anchor.constraint(equalTo:" + this.secondItemName + "." + this.secondAttribute + "Anchor"
        if (typeof (this.constant) == "undefined" || this.constant == '0') {
            des = des + ")"
        } else {
            des = des + ", constant: " + this.constant + ")"
        }
        des = des + ".isActive = true"

        description = des
    }

    if (typeof (this.firstItemName) == undefined) {
        description = description + "未取到first item constraint ID：" + this.id_lu
    }

    if (typeof (this.secondItemName) == "undefined") {
        description = description + "第二个对象处理不当   constraint ID：" + this.id_lu
    }

    this.description = description

    this.descriptionOfID = function (itemID) {
        if (this.controller.viewDic.hasOwnProperty(itemID) == false) {
            //看看是不是contentview模式引起的
            let secondItemKey = this.$("#" + itemID).attr("key")
            if (typeof (secondItemKey) == "undefined") {
                if (this.$("#" + itemID)[0].tagName == "VIEWCONTROLLERLAYOUTGUIDE") {
                    //特殊模式，controller的layoutguide
                    let layoutGuide = this.$("#" + itemID).parent()
                    let guideType = this.$(layoutGuide).attr("type")
                    return "view.layoutMarginsGuide"
                } else {
                    console.log("constraint特殊情况，secondItem未被收录 寻找的ID：" + itemID)
                }
            } else {
                //contentview模式处理
                //contentview模式指在storyboard中发现的一种模式：有的view标签中有一个key属性，这往往代表着这个view没有在明面上出现，是以另一个view/controller的属性
                //tableViewCell
                var containViewID
                let containViewList = ["tableViewCell"]
                for (let index = 0; index < containViewList.length; index++) {
                    const containViewName = containViewList[index];
                    let containViewID1 = this.$("#" + itemID).attr(containViewName)
                    if (typeof (containViewID1) == "undefined") {
                    } else {
                        containViewID = containViewID1
                        break
                    }
                }
                if (typeof (containViewID) == "undefined") {
                    console.log("constraint寻找secondItem contentview模式 没找到容器view")
                } else {
                    let desOfContainView = this.descriptionOfID(containViewID)
                    return desOfContainView + "." + secondItemKey
                }
            }
        } else {
            return this.controller.viewDic[itemID].name()
        }
    }
}