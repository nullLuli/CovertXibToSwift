exports.Controller = function (id_lu, plistCenter) {
    this.id_lu = id_lu
    this.name = plistCenter.getNameOf(id_lu)
    this.class = plistCenter.getClassOf(id_lu)
    this.type = plistCenter.getTypeOf(id_lu)

    //action
    let ActionModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/action")
    let actionDicArr = plistCenter.getActionsOf(id_lu)
    var actionArr = []
    for (var i = 0; i < actionDicArr.length; i++) {
        let actionDic = actionDicArr[i]
        let action = new ActionModule.Action(actionDic, plistCenter)
        actionArr.push(action)
    }
    this.actionArr = actionArr

    var ViewModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/view5-6")
    var viewArr = []
    let viewIDArr = plistCenter.getHieIDArrOf(id_lu)
    for (var i = 0; i < viewIDArr.length; i++) {
        let viewID = viewIDArr[i]
        let type = plistCenter.getTypeOf(viewID)
        if (type == plistCenter.ObjectType.View) {
            let view = new ViewModule.View(viewID, plistCenter)
            viewArr.push(view)
        }
    }
    this.viewArr = viewArr

    var description = this.class + " : {\n"
    for (var i = 0; i < viewArr.length; i++) {
        let view = viewArr[i]
        let viewDes = view.description
        description = description + '\n\n' + viewDes
    }
    description = description + "}\n\n\n"

    this.description = description
}
