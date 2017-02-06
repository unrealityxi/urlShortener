var express = require("express");
var engines = require("consolidate");
var mongoose = require("mongoose");
var assert = require("assert");
var path = require("path");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var newUrl = require("./routes/new");

const PORT = process.env.PORT || 3000; 

var app = express();

// handle mongoose stuff
mongoose.connect("mongodb://dragan:nagard@ds139989.mlab.com:39989/short-urls");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



app.engine("html", engines.nunjucks);
app.set("view engine", "html");
app.set("views", __dirname + "/views");





app.use('/static', express.static(path.join(__dirname, 'public')));







// handle routing
app.use("/new", newUrl);
app.use("/", index);



app.listen(PORT, console.log(`App listening on port ${PORT}`));