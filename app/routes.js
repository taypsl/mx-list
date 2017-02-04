const Playlist = require('./models/playlist');

module.exports = function(app, passport) {
	// ====================================
	// Read playlists on index page
	// ====================================
	app.get('/', function(req, res) {
		res.render('pages/index', {
			message: req.flash('signupMessage'),
		   title: 'Please work'
		});
	});

	// ====================================
	// signup page
	// ====================================
	app.get('/signup', function(req, res) {
		res.render('pages/signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', //might want to redirect to where clicked (e.g. create new)
		failureRedirect: '/signup',
		failureFlash: true
	}));

	// ====================================
	// login page
	// ====================================
	app.get('/login', function(req, res) {
		res.render('pages/login',  { message: req.flash('loginMessage') })
	});
	//	process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// ====================================
	// user protected view
	// ====================================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('pages/profile', {
			user: req.user
		});
	});

	// ====================================
	// logout
	// ====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// ====================================
  // create new playlist
  // ====================================
  app.get('/api/playlist/new', isLoggedIn, function(req, res) {
    res.render('pages/new');
  });

};



//function to check if user is logged in
function isLoggedIn(req, res, next) {
	//if user is logged in
	if (req.isAuthenticated())
	return next();
	//if user is not logged in, redirect them
	res.render('pages/index', { message: req.flash('loginMessage') });
};
