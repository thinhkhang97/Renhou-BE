var express = require('express');
var router = express.Router();

const User = require('../models/userModel');
//Sign in
//Xài session của express
router.post('/signin', function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      console.log(error);
      console.log(user._id);
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        console.log(user._id);
        req.session.userId = user._id;
        return res.redirect('/users/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

//Sign up
//Lưu lại tên đăng nhập và hash của mật khẩu kèm đại lượng random vào database
router.post('/signup', function (req, res, next) {

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }
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
        req.session.userId = user._id;
        return res.redirect('/users/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.json({ name: user.username, email: user.email });
      }
    });
});


// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
