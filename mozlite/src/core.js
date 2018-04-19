//对jQuery得扩展
$.fn.extend({
    /**
     * 获取或设置缓存数据。
     */
    dset: function(key, func) {
        var data = this.data(key);
        if (!data) {
            data = func();
            this.data(key, data);
        }
        return data;
        },
    /**
     * 回调不包含no-js得所有元素。
     */
    exec: function(callback) {
        return this.each(function() {
            var current = $(this);
            if (!current.hasClass('no-js')) {
                callback(current);
            }
        });
    },
    /**
     * 预览文件地址，当前元素必须为input[type=file]。
     */
    createObjectURL: function() {
        if (!this.is('input') || this.attr('type') !== 'file')
            return null;
        if (navigator.userAgent.indexOf("MSIE") > 0) return this.val();
        if (window.createObjectURL) return window.createObjectURL(this[0].files[0]);
        if (window.URL) return window.URL.createObjectURL(this[0].files[0]);
        if (window.webkitURL) return window.webkitURL.createObjectURL(this[0].files[0]);
        return null;
    },
    /**
     * 获取或设置js-开头的属性。
     */
    jsAttrs: function(type) {
        var attrs = {};
        var prefix = 'js-';
        if (type)
            prefix += type;
        const attributes = this.get(0).attributes;
        for (var i = 0; i < attributes.length; i++) {
            const attr = attributes[i];
            var name = $.trim(attr.name);
            if (name.startsWith(prefix)) {
                name = name.substr(prefix.length);
                while (name.startsWith('-'))
                    name = name.substr(1);
                if (!name) name = '_this';
                var value = $.trim(attr.value);
                if (value == 'true')
                    value = true;
                else if (value == 'false')
                    value = false;
                attrs[name] = value;
            }
        }
        return attrs;
    },
    /**
     * 获取或设置js-开头的属性。
     */
    jsAttr: function(name, value) {
        if (value) return this.attr('js-' + name, value);
        return $.trim(this.attr('js-' + name));
    },
    /**
     * 获取或设置data-开头的属性。
     */
    dataAttr: function(name, value) {
        if (value) return this.attr('data-' + name, value);
        return $.trim(this.attr('data-' + name));
    },
    /**
     * 返回当前元素内js-target属性指示的元素对象，如果不存在就为当前实例对象。
     */
    targetElement: function(def) {
        var target = $(this.jsAttr('target'));
        if (target.length > 0)
            return target;
        return def || this;
    }
});

var _executors = [];

/**
 * 执行当前队列中得方法。
 * @param context 当前上下文。
 */
export function render(context) {
    for (const executor of _executors) {
        executor(context);
    }
}
/**
 * 添加执行队列，这个队列一般在页面加载完或者Modal加载完后执行得方法。
 * @param func 执行得方法。
 */
export function queue(func) {
    _executors.push(func);
}

/**
 * 执行方法。
 * @param name 方法名称。
 * @param args 参数列表。
 */
export function call(name, ...args) {
    var current = window;
    var parts = name.split('.');
    for (var i in parts) {
        current = current[parts[i]];
    }
    if (current) {
        if (args)
            return current.apply(null, args);
        else
            current();
    }
    return null;
}

//格式化显示日期字符串
Date.prototype.toFormatString = function(fmt) {
    ///<summary>格式化日期字符串。</summary>
    ///<param name="fmt" type="String">格式化字符串：yyyy-MM-dd HH:mm:ss</param>
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours() % 12, //小时 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
//添加随机码
String.prototype.randomSuffix = function() {
    if (this.indexOf('?') === -1)
        return this + '?_=' + (+new Date);
    return this + '&_=' + (+new Date);
};
//格式化日期字符串
String.prototype.toDateString = function(fmt) {
    var date = new Date(this.replace('T', ' '));
    if (!fmt) fmt = 'yyyy-MM-dd HH:mm:ss';
    return date.toFormatString(fmt);
};
//转换为驼峰形式
String.prototype.toCamelCase = function() {
    return this.replace(/-([a-z])/ig, (all, cur) => cur.toUpperCase());
}

if (typeof String.prototype.startsWith !== 'function')
    String.prototype.startsWith = function(str) {
        if (this.length < str.length) return false;
        return this.substr(0, str.length) == str;
    };

//选项配置
export var options = {
    status: {
        404: '请求出错，网页地址不存在！', //not found
        401: '很抱歉，你没有访问权限，如果没有登入可<a href="/login?returnUrl=' + location.href + '">点击登入...</a>', //没权限
    },
    unknownError: '很抱歉，出现了未知错误，请检查是否正确操作后请重试，如果多次出现问题请联系技术支持人员进行排查！',
    alert: { confirm: '确认' },
    ajax: {
        notFoundUrl: '操作地址没有配置，请检查js-url,a[href],form[action]值！',
        selectedFirst: '请选择项目后再进行操作！'
    },
    modal: {
        timeout: '服务器请求超时！'
    },
    resize: '配置原始分辨率大小错误，格式：js-resize="widthxheight"!',
    editable:{
        notFoundUrl: '操作地址没有配置，请检查js-editable-url的值！'
    }
};

//调用render
$(function() {
    if (_executors.length > 0) { render(); }
});