import { queue } from './core';
import { alert, BsType } from './alert';

$.fn.formSubmit = function(success, error) {
    var form = this;
    var data = new FormData(this[0]);
    var submit = form.find('[js-submit=true],[type=submit]').attr('disabled', 'disabled');
    var icon = submit.find('i.fa');
    var css = icon.attr('class');
    icon.attr('class', 'fa fa-spinner fa-spin');
    $.ajax({
        type: "POST",
        url: form.attr('action') || location.href,
        contentType: false,
        processData: false,
        data: data,
        headers: getHeaders(),
        success: function(d) {
            submit.removeAttr('disabled').find('i.fa').attr('class', css);
            if (success) {
                success(d, form);
                return;
            }
            if (d.message) {
                alert(d.message, d.type, function() {
                    if (d.data && d.data.url)
                        location.href = d.data.url;
                    else if (d.type === BsType.Success)
                        location.href = location.href;
                });
            }
        },
        error: function(e) {
            submit.removeAttr('disabled').find('i.fa').attr('class', css);
            onError(e, error);
        }
    });
    return false;
};

function onError(e, error) {
    if (e.status === 401) {
        alert('需要登入才能够执行此操作！<a href="/login">点击登入...</a>');
        return;
    } else if (error) { error(e); } else {
        alert(e.responseText);
    }
};

function getHeaders() {
    var token = $('#ajax-protected-form').find('[name="__RequestVerificationToken"]');
    if (token.length == 0)
        return {};
    return { 'RequestVerificationToken': token.val() };
};

export function ajax(url, data, success, error) {
    $('#js-loading').fadeIn();
    $.ajax({
        url: url,
        data: data,
        dataType: 'JSON',
        type: 'POST',
        headers: getHeaders(),
        success: function(d) {
            $('#js-loading').fadeOut();
            var callback = d.data && success;
            if (d.message && d.type)
                alert(d.message, d.type, d.type === BsType.Success && !callback);
            if (callback)
                success(d.data);
            else if (d.type === BsType.Success && d.data && d.data.affected)
                location.href = location.href;
        },
        error: function(e) {
            $('#js-loading').fadeOut();
            onError(e);
        }
    });
};

function ajaxAction(current, url, action, ids) {
    var message = current.jsAttr('confirm');
    if (message && !window.confirm(message))
        return false;
    //post
    if (action == 'post') {
        var data = current.jsAttrs('data');
        if (ids) { data['ids'] = ids; }
        ajax(url, data);
        return false;
    }
    //get
    if (ids) {
        if (url.indexOf('?') == -1)
            url += '?id=';
        else
            url += '&id=';
        url += ids.join(',');
    }
    //modal
    if (action == 'modal') {
        current.loadModal(url);
        return false;
    }
    location.href = url;
    return false;
}

queue(context => {
    //actionbar
    $('.data-view', context).exec(current => {
        var actionbar = $(current.jsAttr('actionbar'), context);
        if (!actionbar.data('moz-data-view')) {
            actionbar.data('moz-data-view', current);
            $('[js-action]', actionbar).exec(cur => {
                var action = cur.jsAttr('action').trim();
                var url = cur.jsAttr('url') || cur.attr('href');
                if (!url) {
                    url = action;
                    action = 'post';
                }
                action = action.toLowerCase();
                if (!url) {
                    throw new Error('操作地址没有配置，请检查js-url,href,action值！');
                }
                cur.click(function() {
                    var ids = actionbar.data('moz-data-view').find('.data-content').checkedVal();
                    if (ids.length) {
                        alert('请选择项目后再进行操作！');
                        return false;
                    }
                    return ajaxAction(cur, url, action, ids);
                });
            });
        }
    });
    //action
    $('[js-action]', context).exec(current => {
        var action = current.jsAttr('action').trim();
        var url = current.jsAttr('url') || current.attr('href');
        if (!url) {
            url = action;
            action = 'post';
        }
        action = action.toLowerCase();
        if (!url) {
            throw new Error('操作地址没有配置，请检查js-url,href,action值！');
        }
        current.click(function() {
            return ajaxAction(current, url, action);
        });
    });
    //脚本提交表单
    $('[js-submit]', context).exec(current => {
        var selector = current.attr('js-submit');
        if (selector == 'true')
            selector = current.parents('form');
        else
            selector = $(selector);
        if (selector.length > 0)
            current.click(function() {
                selector.formSubmit();
                return false;
            });
    });
});