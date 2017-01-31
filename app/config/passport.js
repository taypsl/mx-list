var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
	//===============================
	//passport session
	//===============================
	//serialize user 
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	//deserialize user
	passport.deserializeUser(function(user, done) {
		done(null, user.id);
	});

	//===============================
	//local signup
	//===============================
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, username, password, done) {
		process.nextTick(function() {
			User.findOne({'local.email': email}, function(err, user){
				if(err)
					return done(err);
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
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
}