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

    //rootView
    
}
