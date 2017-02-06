var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var urlModel = require.main.require("./schemas/urlModel");





router.get("/", function(req, res){
  res.render("index.html", {"website": req.protocol + "://" + req.get("host")});
});

router.get("/:shortUrl", function(req, res){
  var shortUrl = req.params.shortUrl;
  
  urlModel.findOne({"shortUrl": shortUrl}, function(err, doc){
    if (err) {
      res.send(500, "Something blew!");
      console.log(err);
      return;
    }
    if (!doc) {
      
      res.send(500, {"Error": "No such url"});
      return; 
    }
    
    console.log(doc.url);
    res.redirect(doc.url);
    
    
  });
  
});

module.exports = router;