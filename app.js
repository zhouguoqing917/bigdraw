var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var responseTime = require('response-time');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var routes = require('./routes/index');
var users = require('./routes/users');
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
};
var app = express();

// setup the morgan logger
morgan.date = function getDateToken(req, res, format) {
  var date = new Date();
  return date.toLocaleString();
};
// create morgan a rotating write stream access.log
var accessLogStream = FileStreamRotator.getStream({
  filename: 'logs/access.%DATE%.log',
  frequency: 'daily',
  date_format: "YYYYMMDD",
  verbose: false
});
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 },
  stream: accessLogStream
}));
app.use(responseTime());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);
// set static file
app.use(serveStatic(__dirname + '/public', {
   maxAge: '1d',
   setHeaders: setCustomCacheControl
}));

function setCustomCacheControl (res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

app.use('/', routes);
app.use('/users', users);
app.enable('trust proxy');
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
