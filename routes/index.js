var express = require('express');
var router = express.Router();
var checkLogin = require('../modules/checkLogin')

/* GET home page. */
router.get('/', checkLogin,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
