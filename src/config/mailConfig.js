var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: "@gmail.com",
            pass: ""
        },
        tls: {
            rejectUnauthorized: false
        }
    }

module.exports = smtpConfig;