var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api/ads');

var app = express();

// view engine setup
// Comment to evite no-undef error
/* global __dirname */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connectMongoose import
require('./lib/connectMongoose');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* API request */
app.use('/api', apiRouter);

/* Web request */
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('Este es el error: ',err);
  res.locals.url= req.url;
  
  if (err.status===422) {
    res.locals.message = err.errors[0].msg}
  else {res.locals.message = err.message}
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
