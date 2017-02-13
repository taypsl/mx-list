var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
	//===============================
	//passport session
	//===============================
	//serialize user
	passport.serializeUser(function(user, done) {
		//done(null, user.id);
		done(null, user.id);
	});

	//deserialize user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	//===============================
	//local signup
	//===============================
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	
	function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({'local.username': username}, function(err, user){
				if(err)
				return done(err);
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That username is already taken'));
				} else {
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if (err)
						throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));


	//===============================
	//local login
	//===============================
	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) { // callback with username and password from our form
		console.log("login")
		// find a user whose username is the same as the forms username
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.username' :  username }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err)
			return done(err);

			// if no user is found, return the message
			if (!user)
			return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
			if (!user.validPassword(password))
			return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

			// all is well, return successful user
			return done(null, user);
		});

	}));

};
