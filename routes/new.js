var express = require("express");
var router = express.Router();
var urlModel = require.main.require("./schemas/urlModel");
var dns = require("dns");
var urlCode = require.main.require("./logic/codeGenerator");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//populate req.body
router.use(bodyParser.urlencoded({extended: false}));



// in unlikely case of get request
router.get("/", function(req, res){
  res.send("Please specify url to shorten");
});

// handle post request
router.post("/", function (req, res){
  
  // check if request is legit
  if (!req.body){
    return res.sendStatus(400);
  }
  var url = req.body.url;
  var code = urlCode();
  // apease lords of DNS lookup, remove http(s) from urls begining
  var dnsUrl = url.replace(/https:\/\//i, "").replace(/http:\/\//i, "").split("/");
  dnsUrl = dnsUrl[0];
  // Check if url is valid. 
  dns.lookup(dnsUrl, function(err, address, family) {
    if (err){
      res.send({"error": "invalid url"});
      return;
    }
      var ShortenedUrlModel = urlModel;
    

    
    function verifyAndSave(){

      // set up query
      var query = ShortenedUrlModel.findOne({$or: [{"url": url}, {"shortUrl": code}]}, {"_id": 0, "url": 1, shortUrl: 1});
      
      // check if items props are unique
      query.exec(function(err, doc){

        if (err) {
          res.sendStatus(500);
          return res.send("theres been an error");
        }
        // get random default 5 lettered code to represent short url
        

        // Ensure uniqueness of data  
        if (doc){

          // if url is already in database, just send doc
          if (doc.url == url) {
            res.setHeader('Content-Type', 'application/json');
            res.send(doc);
            return; 
          }
          // ensure that shortened url is also unique
          if (code == doc.shortUrl){
            code = urlCode();
            verifyAndSave();
          }  
        }

        // After previous fallthrough, we should have unique data to work with ...
        // instantiate shortenedUrl model
        var obj = {"url": url, "shortUrl": code };
        var shortenedUrl = new ShortenedUrlModel(obj);
        shortenedUrl.save();
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(obj));
      });
    }
    
    verifyAndSave();
  });
});


module.exports = router;