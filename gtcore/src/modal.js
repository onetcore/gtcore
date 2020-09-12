import {
    alert,
    StatusType
} from './alert';
import {
    queue,
    call,
    render,
    options
} from './core';

$.fn.loadModal = function (url) {
    var s = this;
    var current = s.dset('js-modal', () => $('<div class="js-modal modal fade" data-backdrop="static"><div>')
        .appendTo(document.body)
        .data('target', s.targetElement()));
    url = url || s.attr('href') || s.jsAttr('url');
    var data = s.jsAttrs('data');
    for (const key in data) {
        if (url.indexOf('?') == -1)
            url += '?';
        else
            url += '&';
        url += key + '=' + data[key];
    }
    current.load(url, (response, status, xhr) => {
        switch (status) {
            case 'error':
                if (xhr.status == 404) {
                    if (response) {
                        alert(response);
                        return;
                    }
                }
                var errorMsg = options.status[xhr.status];
                if (!errorMsg) errorMsg = options.unknownError;
                alert(errorMsg);
                return;
            case 'timeout':
                alert(options.modal.timeout);
                return;
        }
        var form = current.find('form');
        if (form.length > 0) {
            if (!form.attr('action'))
                form.attr('action', url);
            if (form.find('input[type=file]').length > 0)
                form.attr('enctype', 'multipart/form-data');
            current.find('[js-submit=true],[type=submit]').click(function () {
                form.formSubmit(function (d, form) {
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
        if (errmsg.length > 0 && d.type !== StatusType.Success) {
            var span = errmsg.attr('class', 'modal-summary text-' + d.type).show().find('.modal-summary-text');
            if (span.length == 0)
                span = errmsg;
            span.html(d.message);
            return;
        }
        alert(d.message, d.type, () => {
            if (d.data && d.data.url)
                location.href = d.data.url;
            else if (d.type === StatusType.Success)
                location.href = location.href;
        });
        if (d.type === StatusType.Success)
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
        let element = modal.find(`[data-valmsg-for="${key}"]`);
        if (element.length == 0) {
            let char = key.charAt(0);
            if (char >= 'a' && char <= 'z') { 
                let current = char.toUpperCase() + key.substr(1);
                element = modal.find(`[data-valmsg-for="${current}"]`); 
            }
        }
        if (element.length)
            element.html(state[key]).show();
    }
}

export function showModal(id, body, footer, func) {
    var modal = $(document.body)
        .dset('js-' + id, () => $('<div class="js-' + id + ' modal fade" data-backdrop="static"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary submit"> ' + options.modal.confirm + ' </button></div></div></div></div>')
            .appendTo(document.body));
    modal.find('.modal-body').html(body);
    if (typeof footer === 'function') {
        func = footer;
        footer = undefined;
    }
    if (footer) {
        modal.find('.modal-footer').html(footer);
    }
    var button = modal.find('button.submit');
    if (func) {
        button.removeAttr('data-dismiss').on('click', () => {
            if (typeof func === 'function') {
                func(modal);
                modal.data('bs.modal').hide();
            } else if (typeof func === 'object') {
                location.href = func.url || location.href;
            } else {
                location.href = location.href;
            }
        });
    } else
        button.attr('data-dismiss', 'modal').off('click');
    render(modal);
    modal.modal('show');
    return modal;
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