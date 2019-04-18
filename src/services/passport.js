var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs')
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
var User = require('../models/User');


module.exports = (passport)=>{
    passport.serializeUser(function(User, done) {
        done(null, User);
    });
    
    passport.deserializeUser(function(User, done) {
        done(null, User);
    });
    passport.use(new LocalStrategy({
      usernameField: 'email', 
      passwordField: 'password',
      session: false
      },
        function (email, password, done) {
            User.findOne({email:email}).exec((e,user)=>{
            if (e) {
              return done(e);
            }
            if (!user) {
              return done(null, false, {message :'Wrong email'});
            }
            if (!user.isActive) {
              return done(null, false, {message :'Email have not been verified'});
            }
            const token = jwt.sign({data:`${user.email}`}, 'thisisascret', { expiresIn: 60 * 60 *24 *30 });
            if (!user || !bcrypt.compareSync(password,user.password)) {
              return done(null, false, {message :'Wrong password'});
            }
            return done(null, {userID:user._id,token:token});
          })
        }
      ));

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'thisisascret'
      },
      function (jwtPayload, cb) {
        User.findOne({email:jwtPayload.data}).exec((err,user) => {
          if(err)   
            return cb(err);
          return cb(null, user);
        })
      }
      )); 
}