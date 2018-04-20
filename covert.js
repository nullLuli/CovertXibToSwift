var fs = require('fs')
var contentText = fs.readFileSync('Main.xml', "utf8")
//解析contenttext
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(contentText)

var $ = require("jquery")(dom.window)

let eleList = dom.window.document.querySelectorAll("view")
for (let index = 0; index < eleList.length; index++) {
    const element = eleList[index];
    let elementID = $(element).attr("id")
    //找出这个view的名字
    let selectNameString = "outlet[destination$='" + elementID + "']"
    let elementName = $(selectNameString).attr("property")
    if(typeof(elementName)=="undefined"){
        //重名处理
    }
    //找出这个view的类型,customClass属性可以用
    
    //生成view的代码
    let initViewString = 'let ' + elementName + "= UIView()"
    //配置view属性
    //读出element所有attri
    let attrList = element.attributes
    for (let index = 0; index < attrList.length; index++) {
        const attr = attrList.item(index)
        let attrString = elementName + "." + attr.name + " = " + attr.value
        console.log(attr.name)
    }
    
    // console.log(element.getAttribute("id"))
}
//生成一个模型
