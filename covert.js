var fs = require('fs')
var contentText = fs.readFileSync('Main.xml', "utf8")
//解析contenttext
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(contentText)

var $ = require("jquery")(dom.window)

// require("view.js")
var controllerModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/controller")

//从controller开始分析
let unionControllerClassNameList = ["tableViewController","viewController","collectionViewController"] //最后需要支持所有controller
for (let index = 0; index < unionControllerClassNameList.length; index++) {
    const unionClassName = unionControllerClassNameList[index];
    $(unionClassName.toUpperCase).each(function(){
        let controlerID = $(this).attr("id")
        let controller = new controllerModule.Controller(controlerID,$)
        console.log("---------------------------")
        controller.viewDic
    })
}

// let unionClassNameList = ["view", "button", "textField", "label", "imageView", "switch","tableViewCell","tableView"] //可以根据Xcode中所有view来补全数组
// for (const index in unionClassNameList) {
//     let unionClassName = unionClassNameList[index]
//     let eleList = dom.window.document.querySelectorAll(unionClassName)
//     for (let index = 0; index < eleList.length; index++) {
//         const element = eleList[index];
//         let elementID = $(element).attr("id")
//         let view = new View(elementID)
//         viewDic[elementID] = view
//     }
// }

// for (const key in viewDic) {
//     if (viewDic.hasOwnProperty(key)) {
//         const element = viewDic[key];
//         // console.log(element)
//         console.log("------------------------------")
//         element.description()
//     }
// }