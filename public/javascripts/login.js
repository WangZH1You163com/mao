if ($.cookie('logname')) {
    $('#logname').val($.cookie('logname'))
}


$('#btnLogin').click(function (ev) {
    ev.preventDefault();
    // 此处的logname为登录页面用户输入的值可能为手机号，邮箱，用户名
    var logname = $.trim($('#logname').val());
    var password = $.trim($('#password').val());
    if (!logname || !password) {
        $('#myModal .modal-body').text('账号或密码不能为空！');
        $('#myModal').modal();
        return;
    }
    var remember = $('#remember').prop('checked');
    console.log(remember);
    $.post("/login", { logname, password, remember }, function (data) {
        if (data.code != 200) {
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }

        location.href = "/";
    })
})