exports.PlistCenter = function (plist) {
    this.plist = plist
    var objects = plist["com.apple.ibtool.document.objects"]
    var hierarchys = plist["com.apple.ibtool.document.hierarchy"]

    //生成ID-name表
    var name_ID_Dic = new Array()
    let connections = plist["com.apple.ibtool.document.connections"]
    for (connectionKey in connections) {
        let connection = connections[connectionKey]
        if (connection["type"] == "IBCocoaTouchOutletConnection") {
            let destinationID = connection["destination-id"]
            let name = connection["label"]
            name_ID_Dic[destinationID] = name
        }
    }
    this.name_ID_Dic = name_ID_Dic

    //生成一张view层次图
    for(var i = 0; i < hierarchys.length; i++) {
        var hierarch = hierarchys[i]
        var children = hierarch["children"]

    }

    this.isCustomClassOf = function (id_lu) {
        let object = objects[id_lu]
        var objectClass = object["ibExternalCustomClassName"]
        if (typeof (objectClass) == "undefined") {
            return false
        }
        return true
    }

    this.getClassOf = function (id_lu) {
        let object = objects[id_lu]
        var objectClass = object["ibExternalCustomClassName"]
        if (typeof(objectClass) == "undefined") {
            objectClass = object["class"]
            objectClass = objectClass.substring(2, objectClass.length)
        }

        return objectClass
    }

    this.getNameOf = function (id_lu) {
        var name = this.name_ID_Dic[id_lu]

        if (typeof (name) == "undefined") {
            let objectID = id_lu.replace('-', '')
            let objectClass = this.getClassOf(id_lu)
            let isCustomClass = this.isCustomClassOf(id_lu)
            if (isCustomClass == true) {
                name = objectClass.toLowerCase() + objectID.toLowerCase()
            } else {
                let prefix = objectClass.substring(2, objectClass.length)
                name = prefix + objectID
            }
        }

        return name
    }

    this.ObjectType = {Controller : "controller", View : "view", Constrain : "constrain", Other : "other"}

    //IB中全部view类型
    //不全待补 05-06
    let viewClassArray = ["IBUILabel","IBUIButton","IBUITextField","IBUISlider","IBUISwitch","IBUIActivityIndicatorView","IBUIProgressView","IBUIPageControl","IBUIStepper","IBUIHorizontalStackView","IBUIVerticalStackView","IBUITableView","IBUITableViewCell","IBUIImageView","IBUICollectionView","IBUICollectionViewCell","IBUICollectionReuseableView","IBUITextView","IBUIScrollView","IBUIDatePicker","IBUIPickerView"]
    //controller是全的
    let controlClassArray = ["IBUIViewController","IBUINavigationController","IBUITableViewController","IBUICollectionViewController","IBUITabBarController","IBUISplitViewController","IBUIPageViewController","IBUIGLKitViewController","IBUIAVKitPlayerViewController"]
    //手势
    
    this.getTypeOf = function(id_lu) {
        let object = objects[id_lu]
        var objectClass = object["class"]
        if (viewClassArray.indexOf(objectClass) > 0) {
            return this.ObjectType.View
        } else if (controlClassArray.indexOf(objectClass) > 0) {
            return this.ObjectType.Controller
        } else if (objectClass == "IBLayoutConstraint") {
            return this.ObjectType.Constrain
        }
        return this.ObjectType.Other
    }
}