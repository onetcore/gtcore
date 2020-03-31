import { queue, options } from './core';

function resize(current, scaleX, scaleY) {
    var min = Math.min(scaleX, scaleY);
    //大小
    current.scale('width', scaleX)
        .scale('height', scaleY)
        //位置
        .scale('left', scaleX)
        .scale('top', scaleY)
        .scale('right', scaleX)
        .scale('bottom', scaleY)
        //margin
        .scale('margin-left', scaleX)
        .scale('margin-top', scaleY)
        .scale('margin-right', scaleX)
        .scale('margin-bottom', scaleY)
        //padding
        .scale('padding-left', scaleX)
        .scale('padding-top', scaleY)
        .scale('padding-right', scaleX)
        .scale('padding-bottom', scaleY)
        //transform
        .scale('scale', scaleX, scaleY)
        .scale('scale-x', scaleX, scaleY)
        .scale('scale-y', scaleX, scaleY)
        //font-size
        .scale('font-size', min)
        .scale('line-height', scaleY);
}

var unit = /^(\d+)px$/ig;

function parsePX(value) {
    value = $.trim(value);
    if (!value) return undefined;
    var px = false;
    var match = unit.exec(value);
    if (match && match.length) {
        value = match[1];
        px = true;
    }
    value = parseFloat(value);
    if (isNaN(value)) return undefined;
    return {value, px};
}

$.fn.scale = function(type, scale) {
    var v = parsePX(this.attr(`css-${type}`), scale);
    if (v) {
        switch (type.toLowerCase()) {
            case 'scale-y':
                this.css('transform', `scaleY(${v.value})`);
                break;
            case 'scale-x':
                this.css('transform', `scaleX(${v.value})`);
                break;
            case 'scale':
                this.css('transform', `scale(${v.value},${v.value})`);
                break;
            default:
                if(v.px)
                    this.css(type, v.value * scale + 'px');
                else
                    this.css(type, v.value * scale);
                break;
        }
    }
    return this;
}

function getScale(current) {
    var win = current.jsAttr('resize')
    if (!win) throw new Error(options.resize);
    win = win.split(/x/ig);
    if (win.length != 2) { throw new Error(options.resize); }
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var container = current.parent();
    if (!container.is('body')) {
        screenWidth = container.width();
        screenHeight = container.height();
    }
    var scaleX = screenWidth / parsePX(win[0]).value;
    var scaleY = screenHeight / parsePX(win[1]).value;
    if (isNaN(scaleY) || isNaN(scaleX)) throw new Error(options.resize);
    var mode = current.jsAttr('resize-mode') || 'auto'
    switch (mode) {
        case 'x':
            return { scaleX, scaleY: scaleX };
        case 'y':
            return { scaleX: scaleY, scaleY };
        case 'xy':
            return {scaleX, scaleY};
        default:
            scaleX = scaleY = Math.min(scaleX, scaleY);
            return { scaleX, scaleY };
    }
}

function scale(context) {
    $('[js-resize]', context).exec(current => {
        var scale = getScale(current);
        current.addClass('js-resize').data('scale', scale);
        resize(current, scale.scaleX, scale.scaleY);
        //缩放子项
        $('.scalable,.resizable', current).exec(c => resize(c, scale.scaleX, scale.scaleY));
    });
}

queue(context => scale(context), true);