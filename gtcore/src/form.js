import {
    queue,
    call
} from './core';

$.fn.extend({
    //多选值
    checkedVal: function () {
        var values = [];
        this.find('input[type=checkbox], input[type=radio]').each(function () {
            if (this.checked)
                values.push(this.value);
        });
        return values;
    },
    //单选值
    radioVal: function () {
        return this.find('input[type=radio]:checked').val();
    },
    //设置选项
    checkedSet: function (checked) {
        checked = checked || false;
        var box = this;
        if (!box.is('input')) {
            box = this.find('input[type=checkbox], input[type=radio]');
            box.trigger('checked', checked);
        }
        this.trigger('checked', checked);
        return box.prop('checked', checked);
    }
});

//添加单选和复选框得事件
queue(context => {
    //replace
    $('input[type=checkbox].js-checkbox,.gt-radioboxlist input[type=radio].js-radiobox', context).exec(current => {
        var wrapper = $('<div></div>')
        if (current.is('.js-radiobox')) wrapper.addClass('checked-style-default gt-radiobox circle');
        else wrapper.addClass('checked-style-check gt-checkbox');
        var className = current.attr('class');
        current.removeAttr('class');
        if (className) wrapper.addClass(className);
        if (current.is(':checked')) wrapper.addClass('checked');
        wrapper.append(current.clone(true));
        wrapper.append('<label class="box-wrapper"><div class="box-checked"></div></label>');
        var label = current.attr('.label');
        if (label) wrapper.append('<span>' + label + '</span>');
        current.replaceWith(wrapper);
    });
    //checkbox
    $('.gt-checkbox', context).click(function () {
        if ($(this).hasClass('disabled')) return;
        var checked = $(this).toggleClass('checked').hasClass('checked');
        $(this).checkedSet(checked);
    });
    //radioboxlist
    $('.gt-radiobox', context).click(function () {
        if ($(this).hasClass('checked') || $(this).hasClass('disabled')) {
            return;
        }
        $(this).parents('.gt-radioboxlist')
            .find('.gt-radiobox')
            .removeClass('checked')
            .checkedSet();
        $(this).addClass('checked').checkedSet(true);
    });
    //checkall
    $('.gt-checkall', context).click(function () {
        var dataView = $(this).parents('.data-view');
        var actionbar = $('.gt-toolbar', context);
        var target = $(this).targetElement(dataView.find('.data-content').find('.gt-checkbox').not('.disabled'));
        $(this).removeClass('some-checked');
        if ($(this).hasClass('checked')) {
            target.addClass('checked').parents('tr').addClass('active');
            target.checkedSet(true);
            actionbar.find('.show-checked').css('display', 'block');
            actionbar.find('.hide-checked').hide();
        } else {
            target.removeClass('checked').parents('tr').removeClass('active');
            target.checkedSet(false);
            actionbar.find('.show-checked').hide();
            actionbar.find('.hide-checked').css('display', 'block');
        }
    });
    //data-content checkbox
    $('.data-content', context).find('.gt-checkbox').click(function () {
        var dataView = $(this).parents('.data-view');
        var actionbar = $('.gt-toolbar', context);
        var checkbeds = $('.data-content', dataView).find('.gt-checkbox.checked').length;
        if ($(this).hasClass('checked')) {
            $(this).parents('tr').addClass('active');
            actionbar.find('.show-checked').css('display', 'block');
            actionbar.find('.hide-checked').hide();
        } else {
            $(this).parents('tr').removeClass('active');
            if (checkbeds == 0) {
                actionbar.find('.show-checked').hide();
                actionbar.find('.hide-checked').css('display', 'block');
            }
        }
        //全选按钮
        var checkall = dataView.find('.gt-checkall');
        if (checkbeds < $('.data-content', dataView).find('.gt-checkbox').length) {
            checkall.removeClass('checked');
            checkall.checkedSet(false);
            if (checkbeds > 0) {
                checkall.addClass('some-checked');
            } else {
                checkall.removeClass('some-checked');
            }
        } else {
            checkall.addClass('checked').removeClass('some-checked');
            checkall.checkedSet(true);
        }
    });
    //修改webpage中模型名称
    $('.gt-toolbar form', context).exec(current => {
        var method = current.attr('method') || 'get';
        if (method.toLowerCase() === 'get') {
            current.find('input,select,textarea').each(function () {
                var name = this.name.toLowerCase();
                var index = name.indexOf('.');
                if (index > 0)
                    name = name.substr(index + 1);
                this.name = name;
            });
        }
    });
});