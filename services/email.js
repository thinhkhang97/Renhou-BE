//var smtpConfig = require('../config/mailConfig');
var nodemailer = require('nodemailer');
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: "rent.house.server@gmail.com",
        pass: process.env.PASS_EMAIL
    },
    tls: {
        rejectUnauthorized: false
    }
}
var smtpTransport = nodemailer.createTransport(smtpConfig);
module.exports = smtpTransport;