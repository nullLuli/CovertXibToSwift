这是一个可以把xib或者storyboard转成swift代码的工具

## 使用
*tip：需要node环境，node环境安装自行百度*

下载CovertXibToSwift工程
将manager.js文件中的“./View.xib”改成自己的目标xib或者storyboard地址
使用node命令运行manager.js，如下
```
node /path/to/manager.js
```

输出样例：
```
var pictureImageView = UIImageView()
view.addSubview(pictureImageView)
pictureImageView.heightAnchor.constraint(equalToConstant: 128).isActive = true
pictureImageView.topAnchor.constraint(equalTo:self.safeAreaLayoutGuide.topAnchor, constant: 125).isActive = true
pictureImageView.widthAnchor.constraint(equalToConstant: 240).isActive = true
pictureImageView.centerXAnchor.constraint(equalTo:self.safeAreaLayoutGuide.centerXAnchor).isActive = true
```