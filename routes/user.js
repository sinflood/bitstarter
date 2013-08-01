var passport = require('passport');
var db = require('../config/dbschema');
exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

exports.getlogin = function(req, res) {
  res.render('login', { user: req.user, message: req.session.messages });
};

exports.getcreate = function(req, res){
  res.render('create', {user:req.user, message: req.session.messages });
};

exports.admin = function(req, res) {
  res.send('access granted admin!');
};

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
//   
/***** This version has a problem with flash messages
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });
*/
  
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
exports.postlogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.apipostlogin = function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){
			return res.json(403, {message: err});
		}

		if(!user){
			return res.json(403, {"status":"failed", message: 'Invalid username/password'});
		}
		req.logIn(user, function(err){
			if(err){return res.json(403,{message: err});}
			return res.json(200, {"status":"success", user_id:user._id, "user":user});


		});

	})(req, res, next);
};

exports.postcreate = function(req, res, next){
	var user = new db.userModel({ username:req.param('username')
     , email: req.param('email')
     , password: req.param('password')
     , accounttype: req.param('type')
     /*, admin: adm*/ });
    //TODO check if user exists
	console.log(user.username);
    // save call is async, put grunt into async mode to work
    //var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
	return res.redirect('create');
        //next(false);
      } else {
        console.log('saved user: ' + user.username);
	req.logIn(user, function(err) {
  		if (err) return next(err);
  		// login success!
  		return res.redirect('/'); // or whereever

        	//return res.redirect('/');
		//next();
      	});
	}
    });
}
exports.apipostcreate = function(req, res, next){
	var user = new db.userModel({ username:req.param('username')
     , email: req.param('email')
     , password: req.param('password')
     , accounttype: req.param('type')
     /*, admin: adm*/ });
    //TODO check if user exists
	console.log(user.username);
    // save call is async, put grunt into async mode to work
    //var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
	return res.json(403, {"status":"failed", message: err});//redirect('create');
        //next(false);
      } else {
        console.log('saved user: ' + user.username);
	req.logIn(user, function(err) {
  		if (err) return res.json(403, {"status":"failed", message: err});
  		// login success!
  		return res.json(200, {"status":"success", user_id:user._id}); // or whereever

        	//return res.redirect('/');
		//next();
      	});
	}
    });

}

exports.apiaddtp = function(req, res, next){

	var username = req.param('username');
	var tp = req.param('tp');
	
	//get user object from db
	//add tp
	//save user object
	//return status
}

exports.postemail = function(req, res, next){
	if(!email){
		req.session.messages = [info.message];
		return res.redirect('/login');
	}
	return res.redirect('/');	


};
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
