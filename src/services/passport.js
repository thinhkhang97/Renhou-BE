const LocalStrategy = require('passport-local').Strategy;
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
        session: false,
      },
        (email, password, done) => {
            User.findOne({email:email}).exec((e,user)=>{
            console.log(e)
            const token = jwt.sign({data:`${user.email}`}, 'secret', { expiresIn: 60 * 60 *24 *30 });
            if (e || !user || !bcrypt.compareSync(password,user.password)) {
              return done(null, false, { message: 'Error' });
            }
            return done(null, token);
            })
        }
      ));   
      passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'secret'
      },
      function (jwtPayload, cb) {
        user.findOne({
          email:jwtPayload.data,
        }).exec((e,user) => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
      }
      )); 
}