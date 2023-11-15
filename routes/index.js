var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = require('../models');
const generateHash = require('../utils/hashGenerator');
const { Transaction } = require('../models');
const { User } = require('../models');
const { Package } = require('../models');
const pakkeStatus = require('../config/pakkeStatus.json');

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

    const Package = await db.Package.create({
      senderID: sender.id,
      recipientID: receiver.id,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      contents: req.body.contents,
      value: req.body.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const Transaction = await db.Transaction.create({
      packageID: Package.id,
      senderID: sender.id,
      recipientID: receiver.id,
      hash: generateHash(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.redirect('/visPakkeID');
  } catch (err) {
    console.error('Error submitting parcel info:', err);

    // Check if it's a validation error
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).send('Validation errors');
    }

    res.status(500).send('Internal Server Error');
  }
});

/* GET visPakkeID page. */
router.get('/visPakkeID', async function(req, res, next) {
  try {
    let transaction = await Transaction.findOne({
      order: [
        ['createdAt', 'DESC']
      ]
    });

    if (transaction) {
      res.render('visPakkeID', {title: 'SendNemt', hash: transaction.hash });
    } else {
      res.render('visPakkeID', {title: 'SendNemt', hash: 'No transactions found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

/* GET sporPakke page. */
router.get('/sporPakke', function(req, res, next) {
  res.render('sporPakke', { title: 'SendNemt' });
});

/* Post sporPakke page. */
router.post('/tracePackage', async function(req, res, next) {
  try {
    const hash = req.body.hash;

    const transaction = await db.Transaction.findOne({
      where: { hash: hash },
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'recipient' },
        { model: Package, as: 'package' },
      ],
    });

    if (transaction) {

      const packageStatusMessages = pakkeStatus.pakke;
      const randomIndex = Math.floor(Math.random() * packageStatusMessages.length);
      const randomMessage = packageStatusMessages[randomIndex];

      res.render('sporetPakke', {
        title: 'SendNemt',
        senderName: transaction.sender.name,
        senderAddress: transaction.sender.address,
        recipientName: transaction.recipient.name,
        recipientAddress: transaction.recipient.address,
        weight: transaction.package.weight,
        dimensions: transaction.package.dimensions,
        contents: transaction.package.contents,
        value: transaction.package.value,
        transaction: transaction,
        randomMessage: randomMessage,
      });
    } else {
      res.render('error', { title: 'SendNemt' }); 
    }
  } catch (error) {
    console.error(error);
    res.render('error', { title: 'SendNemt', message: 'Internal Server Error' });
  }
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
