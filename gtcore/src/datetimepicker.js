import { queue } from './core';
import './bootstrap-datetimepicker';
/**
 * 为了兼容bootstrap 4.x，需要修改eonasdan-bootstrap-datetimepicker.js
 * 1.将'collapse in'改为'collapse show'
 * 2.将togglePicker方法中的'in'改成'show'
 */
queue(context => {
    $('[js-date]').each(function() {
        var attrs = $(this).jsAttrs('date');
        var options = {
            icons: {
                time: 'fa fa-clock-o',
                date: 'fa fa-calendar',
                up: 'fa fa-angle-up',
                down: 'fa fa-angle-down',
                previous: 'fa fa-angle-left',
                next: 'fa fa-angle-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            },
            locale: 'zh-CN',
            tooltips: {
                today: '今日',
                clear: '清除',
                close: '关闭',
                selectMonth: '选择月份',
                prevMonth: '前一月',
                nextMonth: '下一月',
                selectYear: '选择年份',
                prevYear: '前一年',
                nextYear: '后一年',
                selectDecade: '选择十年',
                prevDecade: '前十年',
                nextDecade: '后十年',
                prevCentury: '上一世纪',
                nextCentury: '下一世纪',
                pickHour: '小时',
                incrementHour: '增加',
                decrementHour: '减少',
                pickMinute: '分钟',
                incrementMinute: '增加',
                decrementMinute: '减少',
                pickSecond: '秒钟',
                incrementSecond: '增加',
                decrementSecond: '减少',
                togglePeriod: '切换周期',
                selectTime: '选择时间'
            }
        };

        var name = 'date';
        for (const i in attrs) {
            if (i == '_this') {
                name = attrs[i].toLowerCase();
                switch (name) {
                    case 'time':
                        options.format = 'HH:mm:ss';
                        break;
                    case 'datetime':
                        options.format = 'YYYY-MM-DD HH:mm:ss';
                        break;
                    default:
                        name = 'date';
                        options.format = 'YYYY-MM-DD';
                        break;
                }
                $(this).addClass(`gt-${name}`);
                continue;
            }
            if (i == 'min' || i == 'max')
                continue;
            options[i.toCamelCase()] = attrs[i];
        }

        var dp = $(this).datetimepicker(options);
        //最小最大值
        if (attrs.min) {
            $(this).on('dp.change', function(e) {
                $(attrs.min).data('DateTimePicker').maxDate(e.date);
            });
        }
        if (attrs.max) {
            $(this).on('dp.change', function(e) {
                $(attrs.max).data('DateTimePicker').minDate(e.date);
            });
        }
    });
});