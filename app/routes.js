const Playlist = require('./models/playlist');

module.exports = function(app, passport) {
	// ====================================
	// index page with ejs
	// ====================================
	app.get('/', function(req, res) {
		res.render('pages/index');

		Playlist
		.find()
		.exec()
		.then(playlists => {
			res.json(playlists);
		})
		.catch(err => {
			res.status(500).json({error: 'Something went wrong'})
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
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// ====================================
	// new playlist
	// ====================================
	app.get('/playlist/new', function(req, res) {
		res.render('pages/new');
	});

	app.post('/playlist', function(req, res) {
		const requiredFields = ['username', 'title', 'synopsis', 'songs', 'imgURL', 'type'];
		// requiredFields.forEach(field => {
		// 	if (!(field in req.body)) {
		// 		res.status(400).json(
		// 			{error: `Missing "${field}" in request body`});
		// 		}
		// 	});

			Playlist
			.create({
				username: req.body.username,
				title: req.body.title,
				synopsis: req.body.synopsis,
				songs: req.body.songs, //??
				imgURL: req.body.imgURL,
				type: req.body.type
			})
			.then(playlist => res.status(201).json(playlist))
			.catch(err => {
				console.error(err);
				res.status(500).json({error: 'Something went wrong'});
			});
			/*	Song
			.create({
			name: req.body.song.name,
			artist: req.body.song.artist,
			songUrl: req.body.song.songUrl,
			imgUrl: req.body.song.imgUrl
		})
		*/
	});

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
};

//function to check if user is logged in
function isLoggedIn(req, res, next) {
	//if user is logged in
	if (req.isAuthenticated())
	return next();
	//if user is not logged in, redirect them
	res.redirect('/');
};
