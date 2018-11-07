import {queue} from './core';
import {markdown} from 'markdown';

class MozMD{
    constructor(selector){
        this.selector = selector;
        this.preview = $('.mozmd-preview', selector);
        this.source = $('.mozmd-source', selector);
        this.actions = $('.mozmd-toolbar a', selector);
        this.init();
    }

    init(){
        this.source.on('input', function(){
            var source = this.innerText;
            _preview.html(markdown.toHTML(source));
            this.selector.trigger('mozmd.input');
        });
        this.actions.exec(current=>current.off('click').on('click', e=>{
            var _this = $(e.target);
            switch(_this.attr('class')){
                case 'mozmd-fullscreen':
                    $(document.body).addClass('fullscreen');
                    this.selector.addClass('fullscreen-container');
                    _this.attr('class', 'mozmd-exitfull').attr('title','退出全屏').find('i').attr('class', 'fa fa-window-restore');
                break;
                case 'mozmd-exitfull':
                    $(document.body).removeClass('fullscreen');
                    this.selector.removeClass('fullscreen-container');
                    _this.attr('class', 'mozmd-fullscreen').attr('title','全屏显示').find('i').attr('class', 'fa fa-window-maximize');
                break;
                case 'mozmd-mode-preview':
                    _source.hide();
                    _preview.show();
                    _this.attr('class', 'mozmd-mode-source').attr('title','源码').find('i').attr('class', 'fa fa-code');
                break;
                case 'mozmd-mode-source':
                    _source.show();
                    _preview.hide();
                    _this.attr('class', 'mozmd-mode-preview').attr('title','预览').find('i').attr('class', 'fa fa-eye');
                break;
            }
        }));
    }
}

queue(context=>{
    $('.mozmd-editor', context).exec(current=>{
       current.data('mozmd-editor', new MozMD(current));
    });
});