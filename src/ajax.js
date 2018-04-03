import {alert} from './alert';

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
            onError(e);
        }
    });
    return false;
};

function onError(e){
    if (e.status === 401) {
        alert('需要登入才能够执行此操作！<a href="/login">点击登入...</a>');
        return;
    } 
    else if (error) { error(e); } 
    else {
        alert(e.responseText);
    }
};

function getHeaders() {
    var token = $('#ajax-protected-form').find('[name="__RequestVerificationToken"]');
    if (token.length == 0)
        return {};
    return { 'RequestVerificationToken': token.val() };
};

export function ajax(url, data, success, error){
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