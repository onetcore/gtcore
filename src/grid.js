import {queue} from './core';

export default class Grid {
    constructor(current, grid) {
        this.current = current;
        this.grid = grid;
        if (!grid.render)
            this.render();
        else
            this.calc();
    }

    render() {
        for (var i = 0; i < this.grid.rows; i++) {
            var row = $('<div/>').addClass('grid-row row')
                .addClass('grid-row-' + i)
                .appendTo(this.current);
            for (var j = 0; j < this.grid.cols; j++) {
                var col = $('<div/>').addClass('grid-col col-auto')
                    .addClass('grid-col-' + j)
                    .addClass('grid-' + i + 'x' + j)
                    .appendTo(row);
            }
        }
        return this.calc();
    }

    calc() {
        var width = 100.0 / this.grid.cols;
        width = this.current.find('.grid-col').css({ width: width + '%' }).width();
        var height = width;
        if (this.grid.box != 'square')
            height = this.current.height() / this.grid.rows;
        this.current.find('.grid-col').height(height);
        return this;
    }
}

queue(context => {
    $('[js-grid]', context).exec(current => {
        var grid = current.jsAttrs('grid');
        var attr = grid['_this'].toLowerCase().split('x');
        if (attr.length == 2) {
            grid.rows = parseInt(attr[0]);
            grid.cols = parseInt(attr[1]);
        }

        current.data('js-grid', new Grid(current, grid));
    });
});