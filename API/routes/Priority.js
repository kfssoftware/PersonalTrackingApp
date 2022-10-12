var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var general = require('../general');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/dropdown', urlencodedParser, async function (request, response, next) {
  try {
    let data = [];
    data.push({ name: "Urgent", value: "Urgent", color: "#E83D6D" });
    data.push({ name: "Regular", value: "Regular", color: "#F1A824" });
    data.push({ name: "Trivial", value: "Trivial", color: "#2277E0" });
    response.status(200).json(general.responseFormat(data, "", "", null));
  }
  catch (error) {
    return response.status(500).send({
      message: error.message
    });
  }
});

module.exports = router;