var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var general = require('../general');

router.post('/login', urlencodedParser, async function (request, response, next) {
   var securityCode = request.headers.securitycode;
   if (securityCode === "v9AjFd.l<X)ytQyc:b-toX?Bu%E4*vEo8mqTienE0^B.|)Pq?me8~8?Xw*{Vud0[QgAvSnX9[Lsqw@f{Q,G8?}&p{%E#9]t)<K9") {
      var username = request.body.username;
      var password = request.body.password;
      if (username == "admin" && password == "admin") {
         let data = new Object();
         data.id = 1;
         data.username = "admin";
         data.fullname = "Admin";
         data.email = "admin@example.com";
         data.languageId = 1;
         const token = jwt.sign(data, request.app.get("api_secret_key"), { expiresIn: 9999999999999 });
         data.token = token;
         response.status(200).json(general.responseFormat(data, "", "", null));
      }
      else {
         response.status(400).json(general.responseFormat(null, "NotFound", "User Not Found", null));
      }
   }
   else {
      response.status(401).json(general.responseFormat(null, "Exception", "You are not authorized!", null));
   }
});

router.get('/userinfo', urlencodedParser, async function (request, response, next) {
   try {
      let data = new Object();
      data.id = 1;
      data.username = "admin";
      data.fullname = "Admin";
      data.email = "admin@example.com";
      data.languageId = 1;
      response.status(200).json(general.responseFormat(data, "", "", null));
   }
   catch (error) {
      console.log(error);
      response.status(401).json(general.responseFormat(null, "Exception", error.message, null));
   }
});

module.exports = router;