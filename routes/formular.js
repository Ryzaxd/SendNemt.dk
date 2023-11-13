var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const db = require('../models');

/* Post submit formular page. */
router.post('/submit-parcel-info', async function(req, res, next) {
  try {
    const user = await User.create(req.body);
    const package = await Package.create(req.body);
    const transaction = await Transaction.create(req.body);

    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;