const Playlist = require('./models/playlist');

module.exports = function(app, passport) {
	// ====================================
	// Read playlists on index page
	// ====================================

	//this one should display all the posts to the public
	// public route.
	app.get('/', function(req, res) {
		Playlist
		.find()
		.exec()
		.then(playlists => {
			res.render('pages/index', {
				isAuthenticated: req.isAuthenticated(),
				playlists: playlists,
				message: ''
//				title: 'Please work'
			});
		})
		.catch(err => {
			res.render('pages/index', {
				message: 'Something went wrong',
				title: 'Please work'
			});
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
	app.get('/profile', sendToHomeIfNotAuthenticated, function(req, res) {
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
	// view selected playlist
	// ====================================
	app.get('/playlists/new', /*sendToHomeIfNotAuthenticated,*/ function(req, res) {
		res.render('pages/new');
	});

	app.get('/playlists/:id', function(req, res) {
		Playlist
	   .findById(req.params.id)
	   .exec()
	   .then(playlist => {
			res.render('pages/playlist', {
				playlist: playlist,
			});
	   })
	   .catch(err => {
	     console.error(err);
	     res.status(500).json({ error: 'something went wrong' });
	   })
	});




};



//function to check if user is logged in
function sendToHomeIfNotAuthenticated(req, res, next) {
	//if user is logged in
	if (req.isAuthenticated())
	return next();
	//if user is not logged in, redirect them
	res.render('pages/index', { 
		message: req.flash('loginMessage') }); // throws error w/out sending isAuthenticated and playlists
};

// if logged in, hide "login" and "Sign up" from menu options
function hideLoginIfAuthenticated(req, res, next) {
	//if user is logged in, hide menu options
	if (req.isAuthenticated()) {
		$('#login').addClass('hidden');
		$('#signup').addClass('hidden');
		$('#logout').removeClass('hidden');
	}
};
