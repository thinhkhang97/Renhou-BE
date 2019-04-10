var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('../services/passport')
var smtpTransport  = require('../services/email')
var fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

//Send email to verify
sendVerificationEmail = (verificationMail, req, res) => {
	link = "http://" + req.get('host') + "/user/verify/" + verificationMail.id;
	mailOptions = {
		from: '@gmail.com',
		to: verificationMail.email,
		subject: "Please confirm your Email account",
		html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
	};
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.end();
		} else {
			console.log("Message sent: " + response.message);
			res.end();
		}
	});
};

//Verify signup
router.get('/verify/:sign',function(req, res, next){
	try {
		const ids = jwt.verify(req.params.sign, 'thisisascret');
		var email = ids.data;
		User.findOneAndUpdate({email:email},{isActive: true}).exec((e,data)=>{
			if(e)
				return res.status(400).json({ message: e });
		})
	} catch (err) {
		return res.status(400).json({ message: err });
	}
	return res.status(200).json('successful');
});


//Sign in
//Cái này express có hỗ trợ session cho đăng nhập hay không ???
//Nếu có thì xài còn không thì phải tự tạo session cho người đăng nhập
router.get('/signin', function(req, res, next) {
  res.send('API SIGN IN');
});

//Sign up
router.get('/signup', function(req, res, next) {
  if (validator.validate(req.body.email)) {
    var salt = bcrypt.genSaltSync(10)
		req.body.password = bcrypt.hashSync(req.body.password, salt);
		user.findAll({email: req.body.email}).exec((err,checkUser) => {
			if (checkUser.length === 0) {
				var newUser = {
					email: req.body.email,
					password: req.body.password,
					isActive: false
        };
        const user  = new User(newUser);
        user.save((user) => {
					const token = jwt.sign({ data: `${user.email}` }, 'thisisascret', { expiresIn: 60 * 3 });
					res.status(200).json({id: user.id });
					var verificationMail = {
						email: user.email,
						id: token
					};
					sendVerificationEmail(verificationMail, req, res);
				}).catch(err => {
					console.log(err);
					res.status(500).json({ message: err });
				});
			}
			else {
				res.status(400).json({ message: "Email already exists" });
			}
		})
	}
	else {
		res.status(401).json({ message: "Invalid email" });
	}
});
module.exports = router;
