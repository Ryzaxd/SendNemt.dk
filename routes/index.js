var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SendNemt.dk' });
});

/* GET formular page. */
router.get('/formular', function(req, res, next) {
  res.render('formular', { title: 'SendNemt.dk' });
});

/* GET sporPakke page. */
router.get('/sporPakke', function(req, res, next) {
  res.render('sporPakke', { title: 'SendNemt.dk' });
});


// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/pakkeOversigt', isAuthenticated, (req, res) => {
  res.render('pakkeOversigt', { title: 'Sendnemt.dk', user: req.session.user });
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'SendNemt.dk'}); 
});

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Simulated authentication logic 
  if (username === 'admin' && password === 'admin123') {
    req.session.user = { username }; 
    res.redirect('/pakkeOversigt');
  } else {
    res.redirect('/login'); 
  }
});



module.exports = router;
