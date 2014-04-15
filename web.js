var express = require('express')
  , app = express()
  , db = require('./config/dbschema')
  , pass = require('./config/pass')
  , passport = require('passport')
  , basic_routes = require('./routes/basic')
  , user_routes = require('./routes/user');
var fs = require("fs");

//var app = express.createServer(express.logger());
var index = fs.readFileSync("views/index2.html");
var home = fs.readFileSync("views/home.html");
var about = fs.readFileSync("views/about.html");

var ssindex = fs.readFileSync("index.html");

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'supersecretsauce' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  //app.use(express.static(__dirname + '/../../public'));
 app.use(express.static(__dirname));
 
});

app.get('/index2.html', function(request, response) {
  response.send(index.toString());
});

app.get('/ssindex.html', function(request, response){
	response.send(ssindex.toString());

});

app.get("/about.html", function(request, response){
	response.send(about.toString());
});

app.get("/home.html", function(request, response){
	response.send(home.toString());
});

app.get('/', function(request, response){
	response.send(ssindex.toString());

});

// User pages
app.get('/account', pass.ensureAuthenticated, user_routes.account);
app.get('/login', user_routes.getlogin);
app.post('/login', user_routes.postlogin);
app.post('/create', user_routes.postcreate)
app.get('/create', user_routes.getcreate);
app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), user_routes.admin);
app.get('/logout', user_routes.logout);
app.post('/api/create', user_routes.apipostcreate);
app.post('/api/login', user_routes.apipostlogin);
app.post('/api/addtp', user_routes.apiaddtp);
//app.post('/addemail', user_routes.postEmail);
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
