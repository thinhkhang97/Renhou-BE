var express = require('express');
var router = express.Router();


//Sign in
//Cái này express có hỗ trợ session cho đăng nhập hay không ???
//Nếu có thì xài còn không thì phải tự tạo session cho người đăng nhập
router.get('/signin', function(req, res, next) {
  res.send('API SIGN IN');
});

//Sign up
//Lưu lại tên đăng nhập và hash của mật khẩu kèm đại lượng random vào database
router.get('/signup', function(req, res, next) {
  res.send('API SIGN UP');
});
module.exports = router;
