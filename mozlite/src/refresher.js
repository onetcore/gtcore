import { queue } from './core';
import { ajax } from './ajax';

const url = '/js-refresher'

function refresh(timer, version) {
    ajax(url, { version: version }, function(d) {
        if (d && d.affected)
            window.location.reload();
        else
            setTimeout(function() { refresh(timer); }, timer);
    }, function(e) {
        setTimeout(function() { refresh(timer); }, timer);
    });
}

$(function() {
    var current = $('[js-refresher]');
    if (current.length != 1) return; //一个页面只能有一个
    var timer = parseInt(current.attr('js-refresher-timer'));
    if (isNaN(timer)) timer = 600; //10分钟
    timer *= 1000;
    var version = current.attr('js-refresher');
    refresh(timer, version);
});