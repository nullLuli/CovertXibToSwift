exports.PlistCenter = function (plist) {
    this.plist = plist
    var objects = plist["com.apple.ibtool.document.objects"]
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

    this.isCustomClassOf = function (id_lu) {
        let objects = this.plist["com.apple.ibtool.document.objects"]
        let object = objects[id_lu]
        var objectClass = object["ibExternalCustomClassName"]
        if (typeof (objectClass) == "undefined") {
            return false
        }
        return true
    }

    this.getClassOf = function (id_lu) {
        let object = objects[key]
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
}