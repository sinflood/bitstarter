var express = require('express');
var fs = require("fs");

var app = express.createServer(express.logger());
app.use(express.static(__dirname));
var index = fs.readFileSync("index.html");
var home = fs.readFileSync("home.html");
var about = fs.readFileSync("about.html");

app.get('/', function(request, response) {
  response.send(index.toString());
});

app.get("/about.html", function(request, response){
	response.send(about.toString());
});

app.get("/home.html", function(request, response){
	response.send(home.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
