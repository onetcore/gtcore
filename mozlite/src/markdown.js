import {queue} from './core';
import {markdown} from 'markdown';

queue(context=>{
    $('.mozmd-editor', context).exec(current=>{
        var _source = $('.mozmd-source', current)
            .on('input', function(){
                var source = this.innerText;
                _preview.html(markdown.toHTML(source));
            });
        var _preview = $('.mozmd-preview', current);
        $('.mozmd-toolbar a', current).exec(btn=>{
            btn.off('click').on('click', function(){
                var _this = $(this);
                switch(this.className){
                    case 'mozmd-fullscreen':
                        $(document.body).addClass('fullscreen');
                        current.addClass('fullscreen-container');
                        _this.attr('class', 'mozmd-exitfull').attr('title','退出全屏').find('i').attr('class', 'fa fa-window-restore');
                    break;
                    case 'mozmd-exitfull':
                        $(document.body).removeClass('fullscreen');
                        current.removeClass('fullscreen-container');
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
            });
        });
    });
});