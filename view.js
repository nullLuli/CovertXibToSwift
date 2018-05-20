exports.View = function (id_lu, plistCenter) {
    this.isCustomClass = plistCenter.isCustomClassOf(id_lu)
    this.id_lu = id_lu
    this.plistCenter = plistCenter
    this.name = plistCenter.getNameOf(id_lu)
    this.class = plistCenter.getClassOf(id_lu)
    this.isSystemGenerate = plistCenter.isSystemGenerateOf(id_lu) //该view是否需要自己生成

    //constrian
    var ConstraintModule = require("./constraint")
    var constraintArr = []
    let constraintIDArr = plistCenter.getConstraintOf(id_lu)
    if (typeof(constraintIDArr) == 'undefined') {
        console.log("view的constraint返回为undefined " + id_lu)
    } else {
        for (var i = 0; i < constraintIDArr.length; i++) {
            let constraintID = constraintIDArr[i]
            let constraint = new ConstraintModule.Constraint(constraintID, plistCenter)
            constraintArr.push(constraint)
        }
    }
    this.constraintArr = constraintArr

    //descript
    var description = "var " + this.name + " = " + this.class + "()" + "\n"
    if (this.isSystemGenerate == false) {
        let fatherID = plistCenter.getFatherOf(id_lu)
        if (typeof(fatherID) != "undefined") {
            let fatherName = plistCenter.getNameOf(fatherID)
            description = description + fatherName + ".addSubview(" + this.name + ")\n"
        } else {
            console.log(id_lu + "没有father ID")
        }
    } else {
        console.log("该view不需要自己生成 ：" + this.isSystemGenerate)
    }
    for (var i = 0; i < constraintArr.length; i++) {
        description = description + constraintArr[i].description + "\n"
    }

    this.description = description
}