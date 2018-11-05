import {queue} from './core';

queue(context=>{
    $('.js-menu', context).exec(current=>{
        var menus = current.find('li.has-sub');
        menus.each(function(){
            var _this = $(this);
            _this.children('a').off('click').on('click', function(){
                if(_this.hasClass('opened'))
                    return false;
                menus.removeClass('opened');
                _this.addClass('opened');
                return false;
            });
        });
        current.parents('.sm').hover(function(){
            $(this).removeClass('sm');
        },function(){
            $(this).addClass('sm');
        });
    });
});
