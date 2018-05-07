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
    var hieDic = new Array()
    for (var i = 0; i < hierarchys.length; i++) {
        var hierarch = hierarchys[i]

        let partHieDic = generateHierarchFrom(hierarch)
        for (key in partHieDic) {
            hieDic[key] = partHieDic[key]
        }
    }
    this.getFatherOf = function (id_lu) {
        return hieDic[id_lu]
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

        if(typeof(id_lu) == 'undefined') {
            console.log("get name of id 出现空")
        }
        if (typeof (name) == "undefined") {
            let objectID = id_lu.replace(/-/g, '')
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
        if (viewClassArray.indexOf(objectClass) >= 0) {
            return this.ObjectType.View
        } else if (controlClassArray.indexOf(objectClass) >= 0) {
            return this.ObjectType.Controller
        } else if (objectClass == "IBLayoutConstraint") {
            return this.ObjectType.Constrain
        }
        return this.ObjectType.Other
    }

    //系统自动生成的类，代补全
    let systemGenViewClassArray = ["UITableViewCell", "UICollectionViewCell"]

    this.isSystemGenerateOf = function (id_lu) {
        //判断是否该view是系统自动生成的
        let type = this.getTypeOf(id_lu)
        if (type == this.ObjectType.View) {
            let id_father = this.getFatherOf(id_lu)
            let fatherType = this.getTypeOf(id_father)
            if (fatherType == this.ObjectType.Controller) {
                return true
            } else {
                let className = this.getClassOf(id_lu)
                if (systemGenViewClassArray.indexOf(className) >= 0) {
                    return true
                }
            }
            return false
        }
    }

    //私有方法
    function generateHierarchFrom(hierarchy) {
        var hieDicl = []
        let curID = hierarchy["object-id"]
        let children = hierarchy["children"]
        if (typeof(children) != "undefined") {
            for (var i = 0; i < children.length; i++) {
                let child = children[i]
                let childID = child["object-id"]
                hieDicl[childID] = curID
                let hieDicOfChild = generateHierarchFrom(child)
                for (key in hieDicOfChild) {
                    hieDicl[key] = hieDicOfChild[key]
                }
            }    
        }
        return hieDicl
    }
}