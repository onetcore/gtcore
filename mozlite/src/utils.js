import { queue } from './core';

queue(context => {
    $('.js-menu', context).exec(current => {
        $('.has-sub', current).each(function () {
            var _this = $(this);
            _this.children('a').off('click').on('click', function () {
                if (_this.parents('.mini').length && $(this).hasClass('level-0')) {
                    return false;
                }
                if (_this.hasClass('opened')) {
                    _this.children('ul').slideUp("fast", function () {
                        _this.removeClass('opened');
                    });
                    return false;
                }
                var opened = _this.parent().find('.opened');
                opened.children('ul').slideUp("fast", function () {
                    opened.removeClass('opened');
                });
                _this.children('ul').slideDown("fast", function () {
                    _this.addClass('opened')
                        .removeAttr('style');
                });
                return false;
            });
        });
        current.parents('.sm').hover(function () {
            $(this).removeClass('sm');
        }, function () {
            $(this).addClass('sm');
        });
    });
    $('[js-toggle=sidebar]', context).exec(current => {
        current.on('click', function () {
            var sidebar = $('.sidebar', context).toggleClass('mini').addClass('no-js');
            sidebar.hasClass('mini') && sidebar.find('.js-menu')
                .find('ul')
                .removeAttr('style');
            current.toggleClass('fa-dedent').toggleClass('fa-indent');
        });
    });
});
queue(context => {
    $('.sidebar', context).exec(current => {
        if ($(document.body).width() < 768)
            current.addClass('mini');
        else
            current.removeClass('mini');
    });
}, true);