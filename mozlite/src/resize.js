import { queue, options } from './core';
import { alert } from './alert';

function resize(current, scaleX, scaleY) {
    var sacle = Math.min(scaleX, scaleY);
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
        .scale('font-size', sacle)
        .scale('line-height', scaleY);
}

var unit = /^(\d+)px$/ig;

function parsePX(value) {
    value = $.trim(value);
    if (!value) return undefined;
    var match = unit.exec(value);
    if (match && match.length) {
        value = match[1];
    }
    value = parseFloat(value);
    if (isNaN(value)) return undefined;
    return value;
}

$.fn.scale = function(type, scale) {
    var value = parsePX(this.attr(`css-${type}`));
    if (!value) return this;
    value *= scale;
    switch (type.toLowerCase()) {
        case 'scale-y':
            this.css('transform', `scaleY(${value})`);
            break;
        case 'scale-x':
            this.css('transform', `scaleX(${value})`);
            break;
        case 'scale':
            this.css('transform', `scale(${value},${value})`);
            break;
        default:
            this.css(type, value + 'px');
            break;
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
    var scaleX = screenWidth / parsePX(win[0]);
    var scaleY = screenHeight / parsePX(win[1]);
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
        current.addClass('js-resize');
        resize(current, scale.scaleX, scale.scaleY);
        //缩放子项
        $('.scalable', current).exec(c => resize(c, scale.scaleX, scale.scaleY));
    });
}

queue(context => scale(context));
window.onresize = function() { scale(); }