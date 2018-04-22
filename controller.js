exports.Controller = function (id_control, $) {
    this.$ = $
    this.id_lu = id_control
    this.class_lu = function () {
        let elementClass = this.$("#" + this.id_lu).attr("customClass")
        if (typeof (elementClass) == "undefined") {
            //使用默认class名称
            let tagName = this.$("#" + this.id_lu)[0].tagName
            tagName = tagName.toLowerCase()
            tagName = tagName.substring(0, 1).toUpperCase() + tagName.substring(1);
            elementClass = "UI" + tagName
        }
        return elementClass
    }

    this.viewDic = function () {
        //tableViewController
        //解析出controller root view标签名
        let tagName = this.$("#" + this.id_lu)[0].tagName
        let rootViewTagName = tagName.substring(0,tagName.length - 6)
        console.log(rootViewTagName)
        this.$("#" + this.id_lu).children(rootViewTagName)
    }
}