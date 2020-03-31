import {queue,options} from './core';
import { ajax } from './ajax';
import { alert, StatusType } from './alert';

queue(context => {
    $('[js-editable]', context).exec(current => {
        var url = current.jsAttr('editable-url');
        if (!url) {
            alert(options.editable.notFoundUrl);
            return;
        }
        current.addClass('js-editable');
        // 干掉IE http之类地址自动加链接
        try {
            document.execCommand("AutoUrlDetect", false, false);
        } catch (e) {}

        if (!current.jsAttr('editable-src')) {
            current.jsAttr('editable-src', current.text());
        }
        current.on('click', function(e) {
            current.find('.editable-status').remove();
            current.attr('contenteditable', current.jsAttr('editable')).focus();
        });

        current.on('blur', function(e) {
            var data = current.jsAttrs('data');
            data.value = $.trim(current.text());
            // 没有变化
            if (data.value == current.jsAttr('editable-src'))
                return false;
            ajax(url, data, function(d) {
                current.removeAttr('contenteditable');
                if (current.attr('js-success'))
                    call(current.attr('js-success'), d);
                current.find('.editable-status').remove();
                if (d.type == StatusType.Success) {
                    current.append('<i class="editable-status text-success fa fa-check"></i>');
                } else {
                    current.html(current.jsAttr('editable-src'));
                    current.append('<i title="' + d.message + '" class="editable-status text-danger fa fa-warning"></i>');
                }
                return true;
            }, function(e) {
                current.find('.editable-status').remove();
                current.append('<i class="editable-status text-danger fa fa-warning"></i>');
            });
            return false;
        });

        current.on('paste', function(e) {
            e.preventDefault();
            var text = null;

            if (window.clipboardData && clipboardData.setData) {
                // IE
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain');
            }

            if (document.body.createTextRange) {
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    sel = window.getSelection();
                    var range = sel.getRangeAt(0);

                    // 创建临时元素，使得TextRange可以移动到正确的位置
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }
                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            } else {
                // Chrome之类浏览器
                document.execCommand("insertText", false, text);
            }
        });
    });
});