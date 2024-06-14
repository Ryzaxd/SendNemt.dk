var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models');

var indexRouter = require('./routes/index');

var app = express();

const sessionStore = new SequelizeStore({
  db: sequelize,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: 'your-random-secret-key', 
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/formular', indexRouter);
app.use('/sporPakke', indexRouter);
app.use('/pakkeOversigt', indexRouter);
app.use('/login', indexRouter);
app.use('/submit-parcel-info', indexRouter);
app.use('/visPakkeID', indexRouter);
app.use('/sporetPakke', indexRouter);
app.use('/tracePackage', indexRouter);
app.use('/admin/login', indexRouter);

// Sync session store
sessionStore.sync();

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // set title
  res.locals.title = 'Error';

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await sequelize.close();
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
