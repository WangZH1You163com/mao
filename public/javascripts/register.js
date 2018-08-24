// 验证手机号格式
function checkPhone(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (myreg.test(str)) {
        return true;
    } else {
        return false;
    }
}
// 验证邮箱格式
function checkMail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}



// 获取邮箱验证码
$('#btnCheckMail').click(function (ev) {
    ev.preventDefault();
    console.log("btnCheckMail");
    // 获取邮箱账号
    var mail = $.trim($('#mail').val());

    // 验证邮箱格式
    if (!checkMail(mail)) {
        $('#myModal .modal-body').text('请输入正确的邮箱格式');
        $('#myModal').modal();
        return;
    }

    $.post('/checkMail', { mail }, function (data) {
        if (data.emailCode == 201) {
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }
    })
})



$('#btnRegister').click(function (ev) {
    ev.preventDefault();
    var name = $.trim($('#name').val());
    var gender = $.trim($('#gender').val());
    var phone = $.trim($('#phone').val());
    var mail = $.trim($('#mail').val());
    var mailCode = $.trim($('#mailCode').val());
    var logname = $.trim($('#logname').val());
    var password = $.trim($('#password').val());
    // console.log(name);
    // var acceptClause = $('#acceptClause').prop('checked');
    var refuseClause = $('#refuseClause').prop('checked');
    // console.log(acceptClause);
    console.log(refuseClause);



    if(refuseClause){
        $('#myModal .modal-body').text('请阅读服务条款和隐私条款，并选择“我同意”222222222222');
        $('#myModal').modal();
        return;
    }
    // if (!mailCode) {
    //     $('#myModal .modal-body').text('验证码不能为空！！2222');
    //     $('#myModal').modal();
    //     return;
    // }
    if (!name || !phone || !mail || !logname || !password || !mailCode) {
        $('#myModal .modal-body').text('姓名，手机号，邮箱，用户名，密码，验证码不能为空！！2222');
        $('#myModal').modal();
        return;
    }

    // 客户端验证手机，邮箱格式
    if (!checkPhone(phone)) {
        $('#myModal .modal-body').text('请输入正确的手机号');
        $('#myModal').modal();
        return;
    }
    if (!checkMail(mail)) {
        $('#myModal .modal-body').text('请输入正确的邮箱格式');
        $('#myModal').modal();
        return;
    }

    if(logname.length > 30){
        $('#myModal .modal-body').text('用户名不可超过30个字符');
        $('#myModal').modal();
        return;
    }
    if(password.length < 6){
        $('#myModal .modal-body').text('密码不能少于6个字符');
        $('#myModal').modal();
        return;
    }

    
    





    $.post('/register', { name, gender, phone, mail, mailCode, logname, password,refuseClause }, function (data) {

        if (data.code != 200) {
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }

        $('#myModal .modal-body').text(data.message);
        $('#myModal').modal();
        $('#btnModal').click(function () {
            location.href = '/';
        })
        return;

    })

})

// 服务条款和隐私条款
$('.clause').click(function(){
    $('#myModalclause .modal-body').text('我就是服务条款+隐私条款');
    $('#myModalclause').modal();
    $('#acceptClause').click(function(){
        if($('#acceptClause').prop('checked')){
            $('#refuseClause').prop('checked',false);
        }
    })
    $('#refuseClause').click(function(){
        if($('#refuseClause').prop('checked')){
            $('#acceptClause').prop('checked',false);
        }
    })
    
    
})