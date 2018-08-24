

// 验证手机号
function checkPone(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (myreg.test(str)) {
        return true;
    } else {
        return false;
    }
}

// function checkMobile(str) {
//     var re = /^1\d{10}$/
//     if (re.test(str)) {
//         alert("正确");
//     } else {
//         alert("错误");
//     }
// }
// checkMobile('13800138000'); //调用
// checkMobile('139888888889');//错误示例


// 验证邮箱
// 验证规则：姑且把邮箱地址分成“第一部分@第二部分”这样
// 第一部分：由字母、数字、下划线、短线“-”、点号“.”组成，
// 第二部分：为一个域名，域名由字母、数字、短线“-”、域名后缀组成，
// 而域名后缀一般为.xxx或.xxx.xx，一区的域名后缀一般为2-4位，如cn,com,net，现在域名有的也会大于4位
function checkMail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
// checkMail("contact@cnblogs.com");//调用




module.exports = checkPone;
module.exports = checkMail;