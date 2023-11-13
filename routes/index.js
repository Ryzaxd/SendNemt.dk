var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = require('../models');
const generateHash = require('../utils/hashGenerator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SendNemt' });
});

/* GET formular page. */
router.get('/formular', function(req, res, next) {
  res.render('formular', { title: 'SendNemt' });
});

/* Post submit formular page. */
router.post('/submit-parcel-info', async function(req, res, next) {
  try {
    const senderInfo = {
      name: req.body.senderName,
      email: req.body.senderEmail,
      phone: req.body.senderPhone,
      address: req.body.senderAddress,
      zipcode: req.body.senderZipcode,
      city: req.body.senderCity,
    };

    const receiverInfo = {
      name: req.body.receiverName,
      email: req.body.receiverEmail,
      phone: req.body.receiverPhone,
      address: req.body.receiverAddress,
      zipcode: req.body.receiverZipcode,
      city: req.body.receiverCity,
    };

    // Create sender and receiver users
    const sender = await db.User.create(senderInfo);
    const receiver = await db.User.create(receiverInfo);

    const Package = await db.Package.create(req.body);
    const Transaction = await db.Transaction.create({
      packageID: Package.id,
      senderID: sender.id,
      recipientID: receiver.id,
      hash: generateHash(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

/* GET sporPakke page. */
router.get('/sporPakke', function(req, res, next) {
  res.render('sporPakke', { title: 'SendNemt' });
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
  res.render('pakkeOversigt', { title: 'Sendnemt', user: req.session.user });
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'SendNemt'}); 
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
