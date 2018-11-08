import {
    queue, options
} from './core';
import {
    markdown
} from 'markdown';

class MozMD {
    constructor(selector) {
        this.selector = selector;
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

    init() {
        this.source.on('input', e => this.update());
        this.actions.exec(current => current.off('click').on('click', e => {
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
                    current.attr('class', 'mozmd-mode-source').attr('title', options.markdown.source).find('i').attr('class', 'fa fa-code');
                    break;
                case 'mozmd-mode-source':
                    this.source.show();
                    this.preview.hide();
                    current.attr('class', 'mozmd-mode-preview').attr('title', options.markdown.preview).find('i').attr('class', 'fa fa-eye');
                    break;
            }
            this.selector.trigger(name.replace(/-+/ig, '.'));
        }));
    }
}

queue(context => {
    $('.mozmd-editor', context).exec(current => {
        current.data('mozmd-editor', new MozMD(current));
    });
});