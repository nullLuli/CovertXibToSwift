exports.View = function (id_lu, plistCenter) {
    this.isCustomClass = plistCenter.isCustomClassOf(id_lu)
    this.id_lu = id_lu
    this.plistCenter = plistCenter
    this.name = plistCenter.getNameOf(id_lu)
    this.class = plistCenter.getClassOf(id_lu)
    // this.originClass
    this.type = plistCenter.getTypeOf(id_lu)
    this.isSystemGenerate = plistCenter.isSystemGenerateOf(id_lu)

    var descript = "var " + this.name + " = " + this.class + "()" + "\n"
    if (this.isSystemGenerate == false) {
        let fatherID = plistCenter.getFatherOf(id_lu)
        if (typeof(fatherID) != "undefined") {
            let fatherName = plistCenter.getNameOf(fatherID)
            descript = descript + fatherName + ".addSubview(" + this.name + ")\n"
        } else {
            console.log(id_lu + "没有father ID")
        }
    } else {
        console.log("该view不需要自己生成 ：" + this.isSystemGenerate)
    }

    this.descript = descript
}