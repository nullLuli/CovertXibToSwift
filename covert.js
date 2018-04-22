var fs = require('fs')
var contentText = fs.readFileSync('Main.xml', "utf8")
//解析contenttext
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(contentText)

var $ = require("jquery")(dom.window)

var controllerModule = require("/Users/nullluli/Desktop/luProject/CovertXibToSwift/controller")

//从controller开始分析
let unionControllerClassNameList = ["tableViewController","viewController","collectionViewController"] //最后需要支持所有controller
for (let index = 0; index < unionControllerClassNameList.length; index++) {
    const unionClassName = unionControllerClassNameList[index];
    let upUnionClassName = unionClassName.toUpperCase()
    $(upUnionClassName).each(function(){
        let controlerID = $(this).attr("id")
        if (typeof(controlerID) == "undefined"){
            console.log(upUnionClassName + "标签遍历出错")
        }
        else
        {
            let controller = new controllerModule.Controller($,controlerID)
            // console.log("*****************")
            // controller.rootView()
        }
    })
}

// for (const key in viewDic) {
//     if (viewDic.hasOwnProperty(key)) {
//         const element = viewDic[key];
//         // console.log(element)
//         console.log("------------------------------")
//         element.description()
//     }
// }