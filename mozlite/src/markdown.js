import {
    queue,
    options
} from './core';
import {
    upload
} from './ajax';
import {
    markdown
} from 'markdown';

class MozMD {
    constructor(selector) {
        this.selector = selector;
        this._uploadUrl = selector.attr('js-upload-url');
        this.preview = $('.mozmd-preview', selector);
        this.source = $('.mozmd-source', selector);
        this.actions = $('.mozmd-toolbar a', selector);
        this._value = $('.mozmd-source-value', selector);
        this._html = $('.mozmd-html-value', selector);
        this.init();
    }

    get value() {
        return this._value.val();
    }

    set value(source) {
        this.source.text(source);
        this.update();
    }

    get html() {
        return this._html.val();
    }

    update() {
        var source = this.source.text();
        this._value.val(source);
        var html = markdown.toHTML(source);
        this.preview.html(html);
        this._html.val(html);
        this.selector.trigger('mozmd.updated');
    }

    paste(e) {
        if (!this._uploadUrl) return true;
        this.saveSelection();
        var clipboardData = e.clipboardData || e.originalEvent.clipboardData;
        if (clipboardData && clipboardData.items) {
            for (var i = 0; i < clipboardData.items.length; i++) {
                var item = clipboardData.items[i];
                if (item.kind == 'file' && item.type.indexOf('image') != -1) {
                    var file = item.getAsFile();
                    var data = new FormData();
                    data.append("file", file);
                    var ajaxData = this.selector.jsAttrs('upload-data');
                    if (ajaxData) {
                        for (const key in ajaxData) {
                            data.append(key, ajaxData[key]);
                        }
                    }
                    upload(this.selector, this._uploadUrl, data, (d, cur) => {
                        this.replaceText(text => {
                            var title = '';
                            if (!text) text = '';
                            else title = ' "' + text + '"'
                            return '![' + text + '](' + d.url + title + ')';
                        });
                    });
                    return false;
                }
            }
        }
        return true;
    }

    saveSelection() {
        if (window.getSelection && document.createRange) {
            var sel = window.getSelection();
            if (!sel.rangeCount) {
                this._selection = {
                    start: 0,
                    end: 0
                };
                return;
            }
            var range = sel.getRangeAt(0);
            var preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(this.source[0]);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            var start = preSelectionRange.toString().length;

            this._selection = {
                start: start,
                end: start + range.toString().length
            };
        } else if (document.selection && document.body.createTextRange) {
            var selectedTextRange = document.selection.createRange();
            var preSelectionTextRange = document.body.createTextRange();
            preSelectionTextRange.moveToElementText(this.source[0]);
            preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
            var start = preSelectionTextRange.text.length;

            this._selection = {
                start: start,
                end: start + selectedTextRange.text.length
            };
        }
    }

    restoreSelection() {
        var savedSel = this._selection;
        if (window.getSelection && document.createRange) {
            var charIndex = 0,
                range = document.createRange();
            range.setStart(this.source[0], 0);
            range.collapse(true);
            var nodeStack = [this.source[0]],
                node, foundStart = false,
                stop = false;

            while (!stop && (node = nodeStack.pop())) {
                if (node.nodeType == 3) {
                    var nextCharIndex = charIndex + node.length;
                    if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                        range.setStart(node, savedSel.start - charIndex);
                        foundStart = true;
                    }
                    if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                        range.setEnd(node, savedSel.end - charIndex);
                        stop = true;
                    }
                    charIndex = nextCharIndex;
                } else {
                    var i = node.childNodes.length;
                    while (i--) {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }

            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && document.body.createTextRange) {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(this.source[0]);
            textRange.collapse(true);
            textRange.moveEnd("character", savedSel.end);
            textRange.moveStart("character", savedSel.start);
            textRange.select();
        }
    }

    replaceText(text, index) {
        this.restoreSelection();
        var sel, range, length;
        if (window.getSelection) {
            sel = window.getSelection();
            if (typeof text === 'function') {
                var selText = sel.toString();
                text = text(selText);
                length = selText.length;
            } else {
                length = text.length;
            }
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                var textNode = document.createTextNode(text)
                range.insertNode(textNode);
                sel.removeAllRanges();
                range = range.cloneRange();
                range.selectNode(textNode);
                range.collapse(false);
                sel.addRange(range);
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (typeof text === 'function') {
                text = text(range.text);
                length = range.text;
            } else {
                length = text.length;
            }
            range.pasteHTML(text);
            range.select();
        }
        if (typeof index != 'undefined') {
            if (!this._selection) this._selection = {
                start: 0,
                end: length
            };
            else
                this._selection = {
                    start: this._selection.start + index,
                    end: this._selection.start + index + length
                };
            this.restoreSelection();
        }
        this.update();
    }

    toggleActions() {
        if (this.source.is(':visible')) {
            this.actions.filter('.disabled').removeClass('disabled');
        } else {
            this.actions.each(function () {
                if (this.className.startsWith('mozmd-syntax-'))
                    $(this).addClass('disabled');
            });
        }
    }

    init() {
        this.source.on('input', e => this.update())
            .on('paste', e => this.paste(e))
            .on('keydown', e => {
                //tab和shift+tab缩进
                if (e.keyCode == 9) {
                    this.saveSelection();
                    if (e.shiftKey)
                        this.replaceText(text => {
                            if (!text) return '';
                            var lines = [];
                            text.split('\n').forEach(t => {
                                if (t.startsWith('\t'))
                                    lines.push(t.substr(1));
                                else
                                    lines.push(t);
                            })
                            return lines.join('\n');
                        });
                    else
                        this.replaceText(text => {
                            if (!text) return '\t';
                            return '\t' + text.split('\n').join('\n\t');
                        });
                    return false;
                }
            });
        this.actions.exec(current => current.off('mousedown').on('mousedown', e => {
            this.saveSelection();
            var name = current.attr('class');
            switch (name) {
                case 'mozmd-fullscreen':
                    $(document.body).addClass('fullscreen');
                    this.selector.addClass('fullscreen-container');
                    current.attr('class', 'mozmd-exitfull').attr('title', options.markdown.fullscreen.quit).find('i').attr('class', 'fa fa-window-restore');
                    break;
                case 'mozmd-exitfull':
                    $(document.body).removeClass('fullscreen');
                    this.selector.removeClass('fullscreen-container');
                    current.attr('class', 'mozmd-fullscreen').attr('title', options.markdown.fullscreen.show).find('i').attr('class', 'fa fa-window-maximize');
                    break;
                case 'mozmd-mode-preview':
                    this.source.hide();
                    this.preview.show();
                    current.attr('class', 'mozmd-mode-source').attr('title', options.markdown.source).find('i').attr('class', 'fa fa-keyboard-o');
                    this.toggleActions();
                    break;
                case 'mozmd-mode-source':
                    this.source.show();
                    this.preview.hide();
                    current.attr('class', 'mozmd-mode-preview').attr('title', options.markdown.preview).find('i').attr('class', 'fa fa-eye');
                    this.toggleActions();
                    break;
                case 'mozmd-syntax-bold':
                    this.replaceText(text => "**" + text.trim() + "**", 2);
                    break;
                case 'mozmd-syntax-italic':
                    this.replaceText(text => "_" + text.trim() + "_", 1);
                    break;
                case 'mozmd-syntax-header':
                    this.replaceText(text => {
                        text = text.trim();
                        if (text[0] == '#')
                            return '#' + text;
                        return "# " + text;
                    }, 1);
                    break;
                case 'mozmd-syntax-code':
                    this.replaceText(text => {
                        if (!text) return '```\n\n```\n';
                        if (text.indexOf('\n') == -1) {
                            if (text.startsWith('`'))
                                return text;
                            return '`' + text + '`';
                        }
                        if (text.startsWith('```'))
                            return text;
                        return '```\n' + text.trim() + '\n```\n';
                    });
                    break;
                case 'mozmd-syntax-ul':
                    this.replaceText(text => {
                        if (!text) return '* ';
                        var lines = [];
                        text.split('\n').forEach(t => {
                            if (t.startsWith('1. '))
                                lines.push('*' + t.substr(2));
                            else if (t.startsWith('* '))
                                lines.push(t);
                            else
                                lines.push('* ' + t);
                        });
                        return lines.join('\n');
                    });
                    break;
                case 'mozmd-syntax-ol':
                    this.replaceText(text => {
                        if (!text) return '1. ';
                        var lines = [];
                        text.split('\n').forEach(t => {
                            if (t.startsWith('* '))
                                lines.push('1.' + t.substr(1));
                            else if (t.startsWith('1. '))
                                lines.push(t);
                            else
                                lines.push('1.' + t);
                        });
                        return lines.join('\n');
                    });
                    break;
                case 'mozmd-syntax-link':
                    var link = window.prompt('请输入链接地址', 'http://');
                    if (link)
                        this.replaceText(text => {
                            if (!text) text = link;
                            return '[' + text + '](' + link + ')'
                        }, 1);
                    break;
                case 'mozmd-syntax-quote':
                    this.replaceText(text => '> ' + text, 1);
                    break;
            }
            this.selector.trigger(name.replace(/-+/ig, '.'));
            return false;
        }));
        this.update();
    }
}

queue(context => {
    $('.mozmd-editor', context).exec(current => {
        current.data('mozmd-editor', new MozMD(current));
    });
});