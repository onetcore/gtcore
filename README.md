# 本框架用于Mozlite前端开发

本框架集成了`eonasdan-bootstrap-datetimepicker`,`moment`，依赖于`jQuery`,`bootstrap`,`popper.js`和`fontawesome`，并对`jQuery`进行扩展，以及一些辅助方法。

## NPM&Taobao

原始地址：

```bash
npm config set registry http://registry.npmjs.org
```

淘宝镜像

```bash
npm config set registry https://registry.npm.taobao.org
```

## API文档

模块导出为"Mozlite"，在前端UI中可以直接调用，通过Script标签引入库。

```html
<link href="~/css/font-awesome.min.css" rel="stylesheet"/>
<link href="~/css/bootstrap.min.css" rel="stylesheet"/>
<link href="~/css/mozlite.min.css" rel="stylesheet"/>
<script type="text/javascript" src="~/js/jQuery.min.js"></script>
<script type="text/javascript" src="~/js/popper.min.js"></script>
<script type="text/javascript" src="~/js/bootstrap.min.js"></script>
<script type="text/javascript" src="~/js/mozlite.min.js"></script>
```

## Mozlite.alert(msg: string | StatusMessage, type?: StatusType, func?: Function)

使用Bootstrap的Modal，弹窗显示一条信息。

* msg:string | StatusMessage：表示消息字符串，或者消息实体类对象；
    1. StatusMessage实例对象，包含如下结构：
    ```typescript
    /** 
     * 消息接口。
    */
    interface StatusMessage {
        /**消息类型。 */
        type: StatusType;
        /**消息字符串。 */
        message: string;
        /**其他实例对象。 */
        data?: any;
    }
    ```
    2. StatusType枚举：
    ```typescript
    /**报警类型 */
    enum StatusType {
        /**成功。 */
        Success,
        /**消息。 */
        Info,
        /**警告。 */
        Warning,
        /**错误。 */
        Danger,
    }
    ```
* type?:StatusType：展示的类型枚举；
* func?:Function：回调函数，点击确定后回调的函数。

## Mozlite.ajax(url: string, data: object, success?: Function, error?: Function)

执行ajax的Post提交功能，参数如下：

* url:string：提交的地址；
* data:object：发送的对象；
* success?:Function：成功后执行的方法；
* error?:Function：失败后执行的方法。
