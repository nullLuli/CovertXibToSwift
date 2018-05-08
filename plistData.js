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
            let type = this.getTypeOf(id_lu)
            if (type == this.ObjectType.View) {
                let isRootView = this.isRootViewOf(id_lu)
                if (isRootView == true) {
                    name = "view"
                    return name
                }
            }
            let objectID = id_lu.replace(/-/g, '')
            let objectClass = this.getClassOf(id_lu)
            let isCustomClass = this.isCustomClassOf(id_lu)
            if (isCustomClass == true) {
                name = objectClass.toLowerCase() + objectID.toLowerCase()
            } else {
                let prefix = objectClass.substring(2, objectClass.length)
                name = prefix + objectID
            }

            //如果该id是一个view，应该判断是否是根view
        }

        return name
    }

    this.ObjectType = {Controller : "Controller", View : "View", Constrain : "Constrain", LayoutGuide : "LayoutGuide", Other : "Other"}


    //IB中全部view类型
    //不全待补 05-06
    let viewClassArray = ["IBUILabel","IBUIButton","IBUITextField","IBUISlider","IBUISwitch","IBUIActivityIndicatorView","IBUIProgressView","IBUIPageControl","IBUIStepper","IBUIHorizontalStackView","IBUIVerticalStackView","IBUITableView","IBUITableViewCell","IBUIImageView","IBUICollectionView","IBUICollectionViewCell","IBUICollectionReuseableView","IBUITextView","IBUIScrollView","IBUIDatePicker","IBUIPickerView","IBUIVisualEffectView","IBMKMapView","IBMTKView","IBGLKView","IBUIWebView","IBUINavigationBar","IBUINavigationItem","IBUIToolbar","IBUIBarButtonItem","IBUITabBar","IBUITabBarItem","IBUISearchBar","IBUIView","IBUIContainerView","IBUITableViewCellContentView"]
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
        } else if (objectClass == "IBUIViewControllerAutolayoutGuide") {
            return this.ObjectType.LayoutGuide
        }
        return this.ObjectType.Other
    }
    /*****************************constraint相关方法***********************************/
    this.getConstraintItemNameOf = function (id_lu, isFirstItem) {
        let object = objects[id_lu]
        var itemTagName
        if (isFirstItem == true) {
            itemTagName = "firstItem"
        } else {
            itemTagName = "secondItem"
        }
        let itemObject = object[itemTagName]
        if (typeof(itemObject) == "undefined") {
            return id_lu + " no " + itemTagName
        }
        let itemID = itemObject["ObjectID"]
        let typeOfItem = this.getTypeOf(itemID)
        if (typeOfItem == this.ObjectType.View) {
            var itemName = this.getNameOf(itemID)
            return itemName
        } else if (typeOfItem == this.ObjectType.Constrain) {
            return "SomeConstrain"
        } else if (typeOfItem == this.ObjectType.LayoutGuide) {
            return "view.safeAreaLayoutGuide"
        } else if (typeOfItem == this.ObjectType.Controller) {
            return "SomeController"
        } else {
            return "UnknowType" + id_lu + objectClass
        }
    }

    this.getConstraintAttriOf = function (id_lu, isFirstItem) {
        let object = objects[id_lu]
        var itemTagName
        if (isFirstItem == true) {
            itemTagName = "firstAttribute"
        } else {
            itemTagName = "secondAttribute"
        }
        let itemAttri = object[itemTagName]
        if (itemAttri == 1) {
            return 'left'
        } else if (itemAttri == 2) {
            return 'right'
        } else if (itemAttri == 3) {
            return 'top'
        } else if (itemAttri == 4) {
            return 'bottom'
        } else if (itemAttri == 5) {
            return 'leading'
        } else if (itemAttri == 6) {
            return 'trailing'
        } else if (itemAttri == 7) {
            return 'width'
        } else if (itemAttri == 8) {
            return 'height'
        } else if (itemAttri == 9) {
            return 'centerX'
        } else if (itemAttri == 10) {
            return 'centerY'
        } else {
            return itemAttri + ""
        }
    }

    this.getConstraintContantOf = function (id_lu) {
        let object = objects[id_lu]
        return object["constant"]["value"]
    }

    this.getConstraintMultiplierOf = function (id_lu) {
        let object = objects[id_lu]
        return object["multiplier"]
    }

    /*****************************view相关方法***********************************/
    this.isRootViewOf = function (id_lu) {
        let id_father = this.getFatherOf(id_lu)
        let fatherType = this.getTypeOf(id_father)
        if (fatherType == this.ObjectType.Controller) {
            return true
        }
        return false
    }

    //系统自动生成的类，代补全
    let systemGenViewClassArray = ["UITableViewCell", "UICollectionViewCell"]

    this.isSystemGenerateOf = function (id_lu) {
        //判断是否该view是系统自动生成的
        let type = this.getTypeOf(id_lu)
        if (type == this.ObjectType.View) {
            let isRootView = this.isRootViewOf(id_lu)
            if (isRootView == true) {
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

    //中间不可见view
    let invisibleMiddleViewClassArray = ["UITableViewCellContentView"]

    this.isInvisibleMiddleViewOf = function (id_lu) {
        //用在add subview中，寻找合适的father view
        let className = this.getClassOf(id_lu)
        if (invisibleMiddleViewClassArray.indexOf(className) >= 0) {
            return true
        }
        return false
    }

    //合适的father view
    this.getFatherNameOf = function (id_lu) {
        var fatherID = this.getFatherOf(id_lu)
        while (this.isInvisibleMiddleViewOf(fatherID)) {
            //
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