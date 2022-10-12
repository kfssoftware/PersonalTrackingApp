var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The request you have made is a threat.', subTitle: 'Your IP address has been added to the black list and forwarded to the relevant operator companies.', tNumber:Math.floor(Math.random() * 9999999999) });
});

module.exports = router;
