import {
    queue
} from './core';

queue(context => {
    $('.js-menu', context).exec(current => {
        var isTopMenu = $('.gt-topmenu', context).length > 0;
        if (isTopMenu) {//移除菜单显示
            $('.active.opened', current).removeClass('opened');
        }
        $('.has-sub', current).each(function () {
            var _this = $(this);
            if (isTopMenu) {
                _this.off('mouseenter').on('mouseenter', function () {
                    if (_this.hasClass('opened')) {
                        return false;
                    }
                    _this.addClass('opened');
                    return false;
                });
                _this.off('mouseleave').on('mouseleave', function () {
                    _this.removeClass('opened');
                    return false;
                });
            }
            else {
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
            }
        });
        current.parents('.sm').hover(function () {
            $(this).removeClass('sm');
        }, function () {
            $(this).addClass('sm');
        });
    });
    $('[js-toggle=sidebar], .mini-bg', context).exec(current => {
        current.on('click', function () {
            var sidebar = $('.sidebar', context).toggleClass('mini').addClass('no-js');
            if (sidebar.hasClass('mini')) {
                sidebar.find('.js-menu')
                    .find('ul')
                    .removeAttr('style');
                $('.mini-bg').hide();
            } else if ($('.gt-xs').length) {
                $('.mini-bg').show();
            }
            current.toggleClass('fa-dedent').toggleClass('fa-indent');
        });
    });
    //菜单tabs，点击后不隐藏
    $('.dropdown-panel-body .nav-tabs', context).on('click', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).tab('show');
        return false;
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