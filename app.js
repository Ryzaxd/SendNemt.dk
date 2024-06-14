const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models'); 
const bcrypt = require('bcrypt');
const indexRouter = require('./routes/index');

const app = express();

// Initialize SequelizeStore with the sequelize instance
const sessionStore = new SequelizeStore({
  db: db.sequelize, // Ensure sequelize is correctly referenced from db
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set("trust proxy", 1);

// Session setup
app.use(
  session({
    secret: 'your-random-secret-key', 
    store: sessionStore,
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "none" },
  })
);

// Middleware setups
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes setup
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
db.sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Set title
  res.locals.title = 'Error';

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
