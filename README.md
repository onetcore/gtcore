# 本框架用于Mozlite前端开发

本框架集成了`bootstrap`，`eonasdan-bootstrap-datetimepicker`,`moment`,`popper.js`，依赖于`jQuery`和`fontawesome`，并对`jQuery`进行扩展，以及一些辅助方法。

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

## Mozlite.alert(msg: string | BsMessage, type?: BsType, func?: Function)

使用Bootstrap的Modal，弹窗显示一条信息。

* msg:string | BsMessage：表示消息字符串，或者消息实体类对象；
    1. BsMessage实例对象，包含如下结构：
    ```typescript
    /** 
     * 消息接口。
    */
    interface BsMessage {
        /**消息类型。 */
        type: BsType;
        /**消息字符串。 */
        message: string;
        /**其他实例对象。 */
        data?: any;
    }
    ```
    2. BsType枚举：
    ```typescript
    /**报警类型 */
    enum BsType {
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
* type?:BsType：展示的类型枚举；
* func?:Function：回调函数，点击确定后回调的函数。

## Mozlite.ajax(url: string, data: object, success?: Function, error?: Function)

执行ajax的Post提交功能，
