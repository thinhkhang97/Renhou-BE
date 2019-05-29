var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var feeRouter = require('./routes/fee');
var membersRouter = require('./routes/members');
var roomRouter = require('./routes/room')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/member',passport.authenticate('jwt', {session: false}), membersRouter);
app.use('/room',passport.authenticate('jwt', {session: false}), roomRouter);
app.use('/fee',passport.authenticate('jwt', {session: false}), feeRouter);

require('dotenv').config();
require('./services/passport')(passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

console.log(process.env.PASS_EMAIL)
console.log(process.env.SECRET_PASS)

//Init database
// make a connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Renhou',{ useNewUrlParser: true });

//mongoose.connect('mongodb://default:manager1@ds159164.mlab.com:59164/renhou');
 
// get reference to database
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connection Successful!");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
