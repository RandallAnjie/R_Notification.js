# RNotification
一个简单的js弹窗插件，本项目旨在帮助一些html项目添加好看的弹窗功能～

[点我去往项目主页及演示](https://notification.randallanjie.com)

![](img/introduce.gif)

# 项目来源
本项目来自本人项目[aimage](https://aimage.zhuanjie.ltd/)中的弹窗内容部分，当时弹窗函数写的过分潦草，于是现在拿出来单独写一个js工具


# 使用说明

## 使用示例

### 使用方法1

```html
<script>
    // V1.8新特性：新增控制弹窗在靠近右边和上边时的距离
    var rPaddingTop = 10; // 距离顶部距离，默认20px
    var rPaddingRight = 10; // 距离右边距离，默认20px
</script>
<!-- 引入js文件 -->
<script src="https://notification.randallanjie.com/r_notification.js"></script>
<script>
    // 再在script中调用 rShowMessage() 方法即可
    rShowMessage('我是消息～', 0, 'up', 0);

    // V2.0新特性：能调用预设模板Success、Info、Warning、Error
    // 注意：内容是必填的，标题是可选的，内容在前，标题在后
    rStatusMessage.success('我是成功通知内容～', '成功标题');  // 其他三个分别是 info、warning、error
    rStatusMessage.success('我是成功通知内容～');  // 也可以只传一个参数，这样就没有标题了，其他使用方法与success类似
</script>
```

### 使用方法2

<del>打开[https://notification.randallanjie.com](https://notification.randallanjie.com)，然后鼠标右键点击选择查看网页源代码，查看官方用法</del>

## 参数说明

> rShowMessage(msg, save, position, autoDisappearTime);

message 弹窗内容 支持 HTML 片段

save 是否保存到sessionStorage中，1 保存，0 不保存

position 在顶部显示还是在底部显示，up 顶部，down 底部

autoDisappearTime 自动消失时间，0 不消失，其他 固定ms消失

## 高级功能（特性说明）

### 弹窗出现方式

弹窗可在右上角出现，新弹窗可以设置在已有弹窗上面出现（设置 `position ` 为 `"up"`）或者已有弹窗下面出现（设置 `position ` 为 `"down"`）

默认为在上方出现

### 弹窗消失方式

1. 点击弹窗使弹窗消失
* 在弹窗显示的时候点击弹窗气泡即可使得弹窗消失
2. 在发送弹窗时使弹窗定时消失
* 在js中发送弹窗时将其 `autoDisappearTime` 设置为非0正整数，即可实现对应数毫秒后自动关闭弹窗

### 按住 `alt` 键即可选中弹窗气泡中文字，松开鼠标即可复制

> V1.8新特性

macOS系统按住 `option` 键有相同效果

### 控制弹窗区域距离右边和上边的距离

> V1.8新特性

在引入 `script` 前进行对 `rPaddingTop` 和 `rPaddingRight` 进行定义，未定义时默认为20

### 使用预设模板

> V2.0新特性

V2.0新增四个预设模板（success、info、warning、error）

注意：内容是必填的，标题是可选的，内容在前，标题在后

rStatusMessage.success('我是成功通知内容～', '成功标题');  // 其他三个分别是 info、warning、error

rStatusMessage.success('我是成功通知内容～');  // 也可以只传一个参数，这样就没有标题了，其他使用方法与success类似

> V2.1新特性

V2.1新增更改弹窗内容模块

V2.1版本之后函数自动返回1个11位字符串，例如： `'dg7ygolkciu'` 现可以通过该字符串更改弹窗内容

```js
var msgId = rShowMessage('修改之前的消息～', 0, 'up', 0);  // msgId 应是类似 'xdfknjp0kig' 的字符串

// 现在调用更改弹窗内容函数
rChangeMessage(msgId, '修改后');  // 调用后立即更改弹窗内容

## 注意

`message` 属性虽然支持传入 `HTML` 片段，但是在网站上动态渲染任意 `HTML` 是非常危险的，因为容易导致 `XSS` 攻击。 因此请确保 `message` 的内容是可信的，永远不要将用户提交的内容赋值给 `message` 属性。由于本项目是js插件，用户能直接在控制台调用 `showMessage` 函数，后期更新将在内部修改进行安全性判定
# 更新日志

## V2.1

> 2023-09-25

增加更改弹窗内容模块

## V2.0

> 2023-09-21

增加模板预设（success、info、warning、error）

## V1.9

> 2023-09-19

封装方法，防止内部变量被外部修改，或者内部方法被外部调用

## V1.8

> 2023-09-17

修复弹窗残影问题、宽度适配、新增按住alt点击选择文本复制不关闭弹窗、新增控制弹窗在靠近右边和上边时的距离

## V1.7

> 2023-09-15

修复弹窗内容过长导致弹窗高度不够的问题

## V1.6

> 2023-09-14

弹窗内容支持HTML文本，改用js文件引入

## V1.5

> 2023-09-14

解决上下弹窗动画问题

## V1.4

> 2023-09-13

解决重复删除弹窗错误

## V1.3

> 2023-09-10

增加种类选择

## V1.2

> 2023-09-07

添加上下两处弹窗选择

## V1.1

> 2023-09-05

整合弹窗代码

## V1.0

> 2023-08-04

创建模板

