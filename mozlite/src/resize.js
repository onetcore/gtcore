import { queue } from './core';
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
        .scale('font-size', sacle);
}

var unit = /^(\d+)px$/ig;

function getNumber(current, type) {
    var value = $.trim(current.attr(`_${type}`));
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
    var value = getNumber(this, type);
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

function scale(context) {
    $('[js-resize]', context).exec(current => {
        var scaleY = $(window).height() / getNumber(current, 'win-height');
        var scaleX = $(window).width() / getNumber(current, 'win-width');
        if (isNaN(scaleY) || isNaN(scaleX)) {
            throw new Error('没有配置当前元素得原始分辨率大小：_win-width和_win-height!');
            return;
        }
        if (current.attr('js-resize') != 'xy') {
            scaleX = scaleY = Math.min(scaleX, scaleY);
        }
        current.addClass('js-resize');
        resize(current, scaleX, scaleY);
        //缩放子项
        $('.scalable', current).exec(c => resize(c, scaleX, scaleY));
    });
}

queue(context => scale(context));
window.onresize = function() { scale(); }