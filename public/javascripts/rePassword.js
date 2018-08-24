// 验证邮箱格式
function checkMail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

// 获取邮箱验证码（与注册用的同样的接口）
$('#btnCheckMail').click(function(ev){
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

    $.post('/checkMail',{mail},function(data){
        if(data.emailCode == 201){
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }
    })
})

// 
$('#btnRegister').click(function(ev){
    ev.preventDefault();
    var password = $.trim($('#password').val());
    var rePassword = $.trim($('#rePassword').val());
    var mail = $.trim($('#mail').val());
    var mailCode = $.trim($('#mailCode').val());
    // console.log(name);
    if(!password || !rePassword || !mail){
        $('#myModal .modal-body').text('密码，确认密码，邮箱都不能为空！！2222');
        $('#myModal').modal();
        return;
    }

    if(rePassword != password){
        $('#myModal .modal-body').text('两次输入的密码不一致！！2222');
        $('#myModal').modal();
        return;
    }
    
    // 客户端验证邮箱格式
    if(!checkMail(mail)){
        $('#myModal .modal-body').text('请输入正确的邮箱格式');
        $('#myModal').modal();
        return;
    }
    if(!mailCode){
        $('#myModal .modal-body').text('验证码不能为空！！2222');
        $('#myModal').modal();
        return;
    }


    
    

    // rePassword接口在users.js中用于更新数据库中正常状态用户的密码
    $.post('/rePassword',{password,rePassword,mail,mailCode},function(data){
        if(data.code != 200){
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }

        $('#myModal .modal-body').text(data.message);
        $('#myModal').modal();
        $('#btnModal').click(function(){
            location.href = '/';
        })
        return;
        
    })
    
})