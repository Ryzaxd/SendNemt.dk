var express = require('express');
var router = express.Router();

/* Post submit formular page. */
router.post('/submit', function(req, res, next) {
  res.render('submit', { title: 'SendNemt.dk' });
});

module.exports = router;