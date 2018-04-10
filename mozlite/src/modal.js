import 'bootstrap';
import { alert, BsType } from './alert';
import { queue, call, render } from './core';

$.fn.loadModal = function(url) {
    var s = this;
    var current = s.dset('js-modal', () => $('<div class="js-modal modal fade" data-backdrop="static"><div>')
        .appendTo(document.body)
        .data('target', s.targetElement()));
    url = url || s.attr('href') || s.jsAttr('url');
    current.load(url, () => {
        var form = current.find('form');
        if (form.length > 0) {
            if (!form.attr('action'))
                form.attr('action', url);
            if (form.find('input[type=file]').length > 0)
                form.attr('enctype', 'multipart/form-data');
            current.find('[js-submit=true],[type=submit]').click(function() {
                form.formSubmit(function(d, form) {
                    msgValid(current, d.data);
                    var func = s.jsAttr('submit');
                    if (func) {
                        call(s.jsAttr('submit'), d, form);
                        return;
                    }
                    msgHandler(current, d);
                });
            });
        }
        render(current);
        current.modal('show');
    });
}

//处理消息
function msgHandler(current, d) {
    if (d.message) {
        var errmsg = current.find('div.modal-summary');
        if (errmsg.length > 0 && d.type !== BsType.Success) {
            var span = errmsg.attr('class', 'modal-summary text-' + d.type).show().find('.modal-summary-text');
            if (span.length == 0)
                span = errmsg;
            span.html(d.message);
            return;
        }
        alert(d.message, d.type, () => {
            if (d.data && d.data.url)
                location.href = d.data.url;
            else if (d.type === BsType.Success)
                location.href = location.href;
        });
        if (d.type === BsType.Success)
            current.data('bs.modal').hide();
    } else if (d.data && d.data.url)
        location.href = d.data.url;
    else if (d.data && d.data.affected)
        location.href = location.href;
    else {
        var errmsg = current.find('div.modal-summary');
        if (errmsg.length) errmsg.hide();
    }
}

//显示验证相关
function msgValid(modal, state) {
    modal.find('.field-validation-valid').hide();
    if (!state) {
        return;
    }

    for (const key in state) {
        const element = modal.find(`[data-valmsg-for="${key}"]`);
        if (element.length)
            element.html(state[key]).show();
    }
}

queue(context => {
    $('[js-modal]', context).exec(current => {
        var eventName = current.jsAttr('modal') || 'click';
        current.on(eventName, e => {
            current.loadModal();
            return false;
        });
    });
});