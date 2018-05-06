exports.View = function (id_lu, plistCenter) {
    this.isCustomClass = plistCenter.isCustomClassOf(id_lu)
    this.id_lu = id_lu
    this.plistCenter = plistCenter
    this.name = plistCenter.getNameOf(id_lu)
    this.class = plistCenter.getClassOf(id_lu)
    this.descript = this.name + "  " + this.class
}