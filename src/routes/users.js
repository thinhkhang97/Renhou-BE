var express = require('express');
var router = express.Router();

const User = require('../models/userModel');
//Sign in
//Cái này express có hỗ trợ session cho đăng nhập hay không ???
//Nếu có thì xài còn không thì phải tự tạo session cho người đăng nhập
router.get('/signin', function (req, res, next) {
  res.send('API SIGN IN');
});

//Sign up
//Lưu lại tên đăng nhập và hash của mật khẩu kèm đại lượng random vào database
router.post('/signup', function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    return next(err);
  }
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/signin');
      }
    });
  }
});
module.exports = router;
