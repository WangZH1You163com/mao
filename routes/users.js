

var express = require('express');
var router = express.Router();
var pool = require('../modules/db')
var md5 = require('md5')
// 在接口方法中使用
// 引入模块
const sendEmail = require('../modules/sendEmail')
const randomNum = require('../modules/randomNum')




/* 登录 */
router.get('/login', function (req, res, next) {
  res.render('login', { title: '你好' });
});
// 登录逻辑处理
router.post('/login', function (req, res, next) {
  // 此处获取的logname为login.js页面传来的值可能为手机号phone，邮箱mail，用户名logname
  var logname = req.body.logname;
  var password = req.body.password;
  var remember = req.body.remember;
  console.log(remember);
  if (!logname || !password) {
    res.json({ code: 201, message: "用户名和密码不能为空！！！" });
    return;
  }


  pool.query(`
  SELECT * FROM miao_man WHERE phone='${logname}' || mail='${logname}' || logname='${logname}';`, function (err, resulta) {
      if (resulta.length == 0) {
        res.json({ code: 201, message: "该账号未注册，请先注册！！！" });
        return;
      }

      pool.query(`
      SELECT * FROM miao_man WHERE phone='${logname}' AND password='${md5(password)}' 
      || mail='${logname}' AND password='${md5(password)}' 
      || logname='${logname}' AND password='${md5(password)}';
      `, function (err, result) {
          if (err) {
            res.json({ code: 202, message: '数据库操作失败！' });
            return;
          }
          if (result.length == 0) {
            res.json({ code: 203, message: '账号或密码有误！' });
            return;
          }

          if (result.length > 1) {
            res.json({ code: 204, message: '您的账号存在异常！' });
            return;
          }

          var user = result[0];

          if (user.yn != 1) {
            res.json({ code: 205, message: '您的账号被禁用或删除！' });
            return;
          }

          delete user.password;
          console.log(user);
          req.session.user = user;
          req.session.save();
          res.cookie("user", user);

          if (remember === 'true') {
            res.cookie("logname", user.logname);
            console.log(res.cookie("logname", user.logname));
          } else {
            res.clearCookie("logname");
          }

          res.json({ code: 200, message: '成功！' });
        })

    })





});

// 注册
// ****************************************************************************************************
// 注册页面渲染
router.get('/register', function (req, res, next) {
  res.render('register', { title: '注册' });
})

// 注册页面邮箱验证码
// 服务器端生成验证码
var emailCode = randomNum(6); //验证码为6位随机数
router.post('/checkMail', function (req, res, next) {
  // 获得用户邮箱和验证码
  var mail = req.body.mail;
  // var emailCode = 123456 //验证码为6位随机数

  var email = {
    title: '喵星人网站--邮箱验证码',
    htmlBody: '<h1>公益猫邮箱验证码</h1><p style="font-size: 18px;color:#000;">验证码为：<u style="font-size: 16px;color:#1890ff;">' + emailCode + '</u></p><p style="font-size: 14px;color:#666;">10分钟内有效</p>'
  }
  var mailOptions = {
    from: '"公益猫"463497020@qq.com', // 发件人地址
    to: mail, // 收件人地址，多个收件人可以使用逗号分隔
    subject: email.title, // 邮件标题
    html: email.htmlBody // 邮件内容
  };
  sendEmail.send(mailOptions);
  res.json({ code: 200, message: '邮件发送成功' });
})
// 注册逻辑处理
router.post('/register', function (req, res, next) {
  var name = req.body.name;
  var gender = req.body.gender;
  var phone = req.body.phone;
  var mail = req.body.mail;
  var mailCode = req.body.mailCode;
  var logname = req.body.logname;
  var password = req.body.password;
  var refuseClause = req.body.refuseClause;
  console.log(refuseClause);
  // console.log(emailCode);
  // console.log(mailCode);
  // 服务器端验证不能为空
  if (!name || !phone || !mail || !logname || !password || !mailCode) {
    res.json({ code: 201, message: '姓名，手机号，邮箱，用户名，密码,验证码不能为空！！' });
    return;
  }
  // emailCode服务器端保存的验证码，mailCode用户输入的验证码
  if (mailCode != emailCode) {
    res.json({ code: 202, message: '请查看邮箱中验证码邮件，输入正确的验证码' });
    return;
  }

  if (!refuseClause) {
    res.json({ code: 203, message: '请阅读服务条款和隐私条款，并选择“我同意”' });
    return;
  }



  // 验证手机号，邮箱，用户名是否已注册
  pool.query(`
  select * from miao_man where phone = '${phone}';
  select * from miao_man where mail = '${mail}';
  select * from miao_man where logname = '${logname}';
  `, function (err, result) {
      // console.log(result);
      if (err) {
        res.json({ code: 201, message: '数据库操作失败！' });
        return;
      }
      if (result[0].length > 0) {
        res.json({ code: 202, message: '该手机号已被注册！' });
        return;
      }
      if (result[1].length > 0) {
        res.json({ code: 203, message: '该邮箱已被注册！' });
        return;
      }
      if (result[2].length > 0) {
        res.json({ code: 204, message: '该用户名已被注册！' });
        return;
      }

      var sql = `insert into miao_man(name,gender,phone,mail,logname,password) value(?,?,?,?,?,?)`
      var data = [name, gender, phone, mail, logname, md5(password)];
      pool.query(sql, data, function (err, result1) {
        if (err) {
          res.json({ code: 201, message: '数据库操作失败！' });
          return;
        }

        res.json({ code: 200, message: '您已经注册成功，请登录！' })
      })
    })



})
// *********************************************************************************************************

// 修改密码
// 修改密码页面渲染
router.get('/rePassword', function (req, res, next) {
  res.render('rePassword', { title: '修改密码' });
});

// 修改密码逻辑处理，
// bug:未在数据库中进行查询，即修改密码的用户邮箱未进行注册，不会提示“邮箱未注册请先注册”
// 需要修改rePassword.js页面为模态框添加关闭按钮增加跳转到注册页的按钮
router.post('/rePassword', function (req, res, next) {
  var password = req.body.password;
  var rePassword = req.body.rePassword;
  var mail = req.body.mail;
  var mailCode = req.body.mailCode;




  // 服务器端验证
  if (!password || !rePassword || !mail) {
    res.json({ code: 201, message: '密码，确认密码，邮箱都不能为空！！' });
    return;
  }

  if (rePassword != password) {
    res.json({ code: 202, message: '两次输入的密码不一致！！' });
    return;
  }


  // console.log(mailCode);
  // console.log(rePassword);
  // console.log(emailCode);
  if (!mailCode) {
    res.json({ code: 204, message: '验证码不能为空！！' });
    return;
  }

  // emailCode服务器端保存的验证码，mailCode用户输入的验证码
  if (mailCode != emailCode) {
    res.json({ code: 205, message: '请查看邮箱中验证码邮件，输入正确的验证码' });
    return;
  }

  pool.query(`
  SELECT * FROM miao_man WHERE mail='${mail}';`, function (err, resulta) {
    if (resulta.length == 0) {
      res.json({ code: 201, message: "该邮箱未注册，请先注册！！！" });
      return;
    }

    var sql = `update miao_man set password = ? where mail = ?`
    var data = [md5(password), mail];
    pool.query(sql, data, function (err, result) {
      if (err) {
        res.json({ code: 201, message: '数据库操作失败！' });
        return;
      }

      res.json({ code: 200, message: '您已成功修改密码，请登录！' });
    })

  })

})



module.exports = router;
