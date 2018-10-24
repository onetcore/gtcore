declare const Mozlite: IMozlite;
declare module 'mozlite' {
    export = Mozlite;
}
/** 
 * 扩展JQuery。
*/
interface JQuery {
    /**
     * 获取或设置缓存数据。
     * @param key 缓存唯一键。
     * @param func 获取缓存实例得方法。
     * @returns {any} 返回缓存实例。
     */
    dset(key: string, func: () => any): any;

    /**
     * 执行不包含no-js样式得所有元素得回调函数。
     * @param callback 回调函数。
     */
    exec(callback: (current: JQuery) => void): void;

    /**
     * 获取file表单预览地址。
     */
    createObjectURL(): null | string;

    /**
     * 获取或设置以'js-'开头得元素值。
     * @param key 当前元素唯一键。
     * @returns {string|undefined}当前元素值。
     */
    jsAttr(key: string): string | undefined;

    /**
     * 获取或设置以'js-'开头得元素值。
     * @param key 当前元素唯一键。
     * @param value 要设置得元素值。
     * @returns {this}当前元素值。
     */
    jsAttr(key: string, value?: string): this;

    /**
     * 获取或设置以'data-'开头得元素值。
     * @param key 当前元素唯一键。
     * @returns {string|undefined| HTMLElement}当前元素值。
     */
    dataAttr(key: string): string | undefined;

    /**
     * 获取或设置以'data-'开头得元素值。
     * @param key 当前元素唯一键。
     * @param value 要设置得元素值。
     * @returns {this}当前元素值。
     */
    dataAttr(key: string, value?: string): this;

    /**
     * js-target指定得元素实例。
     * @param def 默认元素。
     * @returns {undefined | JQuery} 返回当前对象元素实例。
     */
    targetElement(def?: JQuery): undefined | JQuery;

    /**
     * 载入弹窗。
     * @param url URL地址。
     */
    loadModal(url?: string): void;

    /** 获取选中的实例列表。 */
    checkedVal(): Array;

    /** 获取单选框得值。 */
    radioVal(): string;

    /**
     * 设置checkbox或者radio的选中状态。
     * @param checked 是否选中。
     */
    checkedSet(checked?: boolean): this;

    /**
     * 获取以js-${type}开头的所有属性对象。
     * @param type js-属性名称。
     */
    jsAttrs(type?:string): Object;

    /**
     * 缩放当前元素，单位为px。
     * @param type 缩放类型，如：scale,scale-x,scale-y,margin-left等。
     * @param scale 缩放比例。
     */
    scale(type:string, scale:Number):this;

    /**
     * 禁用当前元素。
     */
    disabled():this;
    /**
     * 激活当前元素。
     */
    enabled():this;
}

/**扩展日期。 */
interface Date {
    /**
     * 格式化日期字符串。
     * @param fmt 格式化字符串：yyyy-MM-dd HH:mm:ss。
     */
    toFormatString(fmt: string): string;
}

/**扩展字符串。 */
interface String {
    /**
     * 将JSON字符串转换为日期对象。
     * @param fmt 格式化字符串：yyyy-MM-dd HH:mm:ss。
     */
    toDateString(fmt?: string): string;

    /** 附加随机字符串。 */
    randomSuffix(): String;

    /** 将'-'分隔的字符串转换为驼峰字符串。 */
    toCamelCase(): string;
}

interface IMozlite {
    /**
     * 添加执行队列，这个队列一般在页面加载完或者Modal加载完后执行得方法。
     * @param func 执行得方法。
     * @param resize 是否重置大小时候执行。
     */
    queue(func: (context?: JQuery | undefined, resize?:boolean|undefined) => void);

    /**
     * 执行当前队列中得方法。
     * @param context 当前上下文。
     */
    render(context?: JQuery | undefined);

    /**
     * 执行方法。
     * @param name 方法名称。
     * @param args 参数列表。
     */
    call(name: string, ...args: any[]);

    /**
     * 弹窗警告。
     * @param msg 消息实例或字符串。
     * @param type 消息类型。
     * @param func 点击确认后回调函数。
     */
    alert(msg: string | BsMessage, type?: BsType, func?: Function);

    /**
     * 发送ajax的POST请求。
     * @param url 消息实例或字符串。
     * @param data 发送JSON实例。
     * @param success 发送成功后回调函数。
     * @param error 发送发生错误后的回调函数。
     */
    ajax(url: string, data: object, success?: Function, error?: Function);

    /**
     * 当前请求查询实例。
     */
    query: Query;

    /**
     * 配置选项。
     */
    options:object;
}

declare namespace Mozlite {
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

    /**
     * 网格。
     */
    interface Grid {
        /** 当前元素。 */
        current: JQuery;
        /** js-grid属性值。 */
        grid: object;

        /** 呈现网格。 */
        render(): this;

        /** 重新计算网格宽度和高度。 */
        calc(): this;
    }

    /**
     * 查询字符串。
     */
    interface Query {
        /**
         * 获取当前查询实例。
         * @param name 当前查询键值。
         */
        get(name: string): string | undefined;
        /**
         * 设置当前键值。
         * @param name 当前键实例。
         * @param value 当前键值。
         */
        set(name: string, value: string): this;
        /**
         * 格式化输出当前查询实例。
         */
        toString();
        /**
         * 删除当前项。
         * @param name 当前查询键值。
         */
        delete(name: string): this;
        /**
         * 清楚所有查询实例。
         */
        clear(): this;
    }

    var Query: {
        prototype: Query;
        new(): Query;
    }
}