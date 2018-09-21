import { queue, call } from './core';

$.fn.extend({
    //多选值
    checkedVal: function() {
        var values = [];
        this.find('input[type=checkbox], input[type=radio]').each(function() {
            if (this.checked)
                values.push(this.value);
        });
        return values;
    },
    //单选值
    radioVal: function() {
        return this.find('input[type=radio]:checked').val();
    },
    //设置选项
    checkedSet: function(checked) {
        checked = checked || false;
        var box = this;
        if (!box.is('input'))
            box = this.find('input[type=checkbox], input[type=radio]');
        if (this.attr('oncheck'))
            call(this.attr('oncheck'), checked);
        return box.prop('checked', checked);
    }
});

//添加单选和复选框得事件
queue(context => {
    //checkbox
    $('.moz-checkbox', context).click(function() {
        if ($(this).hasClass('disabled')) return;
        var checked = $(this).toggleClass('checked').hasClass('checked');
        $(this).checkedSet(checked);
    });
    //radioboxlist
    $('.moz-radiobox', context).click(function() {
        if ($(this).hasClass('checked') || $(this).hasClass('disabled')) {
            return;
        }
        $(this).parents('.moz-radioboxlist')
            .find('.moz-radiobox')
            .removeClass('checked')
            .checkedSet();
        $(this).addClass('checked').checkedSet(true);
    });
    //checkall
    $('.moz-checkall', context).click(function() {
        var dataView = $(this).parents('.data-view');
        var actionbar = $(dataView.jsAttr('actionbar'), context);
        var target = $(this).targetElement(dataView.find('.data-content').find('.moz-checkbox'));
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
    $('.data-content', context).find('.moz-checkbox').click(function() {
        var dataView = $(this).parents('.data-view');
        var actionbar = $(dataView.jsAttr('actionbar'), context);
        var checkbeds = $('.data-content', dataView).find('.moz-checkbox.checked').length;
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
        var checkall = dataView.find('.moz-checkall');
        if (checkbeds < $('.data-content', dataView).find('.moz-checkbox').length) {
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
    $('form[method=get]', context).exec(current => {
        current.find('input,select,textarea').each(function() {
            var name = this.name.toLowerCase();
            if (name.startsWith('model.'))
                name = name.substr(6);
            this.name = name;
        });
    });
});