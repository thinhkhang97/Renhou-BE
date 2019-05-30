var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport')
var fs = require('fs');
var smtpTransport  = require('../services/email')
var validator = require("email-validator");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

//Send email to verify
sendVerificationEmail = (verificationMail, req, res) => {
	link = "http://" + req.get('host') + "/user/verify/" + verificationMail.id;
	mailOptions = {
		from: 'rent.house.server@gmail.com',
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
router.get('/verify/:sign',function(req, res){
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
router.post('/signin', function(req, res,next) {
	passport.authenticate('local', (err, token, msg) => {
		if (err || !token) {
			return res.status(400).json(
				msg,
			);
		}
		return res.status(200).json({
			message: "Login successful",
			token
		});
	})(req, res, next)
		
});


//Verify again
router.post('/reverify',function(req, res) {
	if (validator.validate(req.body.email)) {
	  User.findOne({email: req.body.email}).exec((e,checkUser) => {
		    if (!checkUser) {
			  return res.status(400).json({ code: 1, message: "Email have not signed up" });
			}
			if (checkUser.isActive) {
				return res.status(400).json({ code: 2,message: "Email have verify yet" });
			}
			const token = jwt.sign({ data: `${checkUser.email}` }, 'thisisascret', { expiresIn: 60 * 3 });
			res.status(200).json({id: checkUser.id });
			var verificationMail = {
				email: checkUser.email,
				id: token
			};
			sendVerificationEmail(verificationMail, req, res);
		  })
  	}
  	else {
	  res.status(400).json({ code: 1, message: "Invalid email" });
  	}
})

//Sign up
router.post('/signup', function(req, res) {
  	if (validator.validate(req.body.email)) {
    	var salt = bcrypt.genSaltSync(10)
		req.body.password = bcrypt.hashSync(req.body.password, salt);
		User.findOne({email: req.body.email}).exec((e,checkUser) => {
			if (!checkUser) {
				var newUser = {
					email: req.body.email,
					password: req.body.password,
					isActive: false
       		};
			const user  = new User(newUser);
			user.save((err,user) => {
				if(err)
				{
					console.log(err);
					return res.status(500).json({ message: err });
				}
				const token = jwt.sign({ data: `${user.email}` }, 'thisisascret', { expiresIn: 60 * 3 });
				res.status(200).json({id: user.id });
				var verificationMail = {
					email: user.email,
					id: token
				};
				sendVerificationEmail(verificationMail, req, res);
			})}
			else {
				res.status(400).json({code:1, message: "Email already exists" });
			}
		})
	}
	else {
		res.status(401).json({code:1, message: "Invalid email" });
	}
});
module.exports = router;
