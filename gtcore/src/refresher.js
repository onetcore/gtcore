import { queue, options } from './core';
import { ajax } from './ajax';

const url = '/js-refresher'
var refreshTimer;

function refresh(timer) {
    if (refreshTimer) clearTimeout(refreshTimer);
    ajax(url, { version: window.$version }, function(d) {
        if (d.data && d.data.affected)
            window.location.reload();
        else
            setTimeout(function() { refresh(timer); }, timer);
        return true;
    }, function(e) {
        setTimeout(function() { refresh(timer); }, timer);
        return true;
    });
}

$(function() {
    var current = $('[js-refresher]');
    if (current.length != 1) return; //一个页面只能有一个
    var timer = parseInt(current.attr('js-refresher-timer'));
    if (isNaN(timer)) timer = 600; //10分钟
    timer *= 1000;
    window.$version = current.attr('js-refresher');
    refresh(timer);
});

queue(context=>{
    $('[js-enabled]', context).exec(current => {
        var text = current.html();
        var format = current.attr('js-enabled-format')||options.refersher.enabled;
        var timer = current.attr('js-enabled')*1;
        setInterval(function(){
            if(current.hasClass('disabled')||current.attr('disabled')){
                timer--;
                if(timer<=0){
                    current.removeClass('disabled').removeAttr('disabled');
                    timer = current.attr('js-enabled')*1;
                    current.html(text);
                }
                else{
                    current.html(format.replace('$delay;', timer))
                }
            }
        }, 1000);
    });
});