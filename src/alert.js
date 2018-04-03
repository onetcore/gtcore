import './core';
//弹窗类型
export const BsType = {
    Success: "success",
    Info: "info",
    Warning: "warning",
    Danger: "danger"
};

//弹窗方法
export function alert(msg, type, func){
    var message = msg;
    if (!message && typeof msg === "object") {
        var bsmsg = msg;
        type = bsmsg.type;
        message = bsmsg.message;
    }
    if (!message)
        return;
    var modal = $(document.body)
        .dset('js-alert', () => $('<div class="js-alert modal fade" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="modal-body" style="padding: 50px 30px 30px;"><div class="col-sm-2"><i style="font-size: 50px;"></i></div> <span class="col-sm-10" style="line-height: 26px; padding-left: 0;"></span></div><div class="modal-footer"><button type="button" class="btn btn-primary"><i class="fa fa-check"></i> 确定</button></div></div></div></div>')
            .appendTo(document.body));
    var body = modal.find('.modal-body');
    type = type || BsType.Warning;
    if (type == BsType.Success)
        body.attr('class', 'modal-body row text-success').find('i').attr('class', 'fa fa-check');
    else
        body.attr('class', 'modal-body row text-' + type).find('i').attr('class', 'fa fa-warning');
    body.find('span').html(message);
    var button = modal.find('button').attr('class', 'btn btn-' + type);
    if (func) {
        button.removeAttr('data-dismiss').on('click', () => {
            if (typeof func === 'function') {
                func(modal.data('bs.modal'));
                modal.data('bs.modal').hide();
            } else {
                location.href = location.href;
            }
        });
    } else
        button.attr('data-dismiss', 'modal').off('click');
    modal.modal('show');
};