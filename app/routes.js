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

	app.get('/playlists', function(req, res) {
		Playlist
		.find()
		.exec()
		.then(playlists => {
			res.json(playlists);
		})
		.catch(err => {
			res.status(500).json({error: 'Something went wrong'})
		});
	//	res.render('index.ejs', {Playlist:res})
	})
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
	// create new playlist
	// ====================================
	app.get('/playlist/new', isLoggedIn, function(req, res) {
		res.render('pages/new');
	});

	app.post('/playlists', function(req, res) {
		const requiredFields = ['username', 'title', 'synopsis', 'songs', 'imgURL', 'type'];

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
	});

	// ====================================
	// update playlist
	// ====================================
	app.put('/playlists/:id', (req, res) => {
		if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
			res.status(400).json({
				error: 'Request path id and request body id values must match'
			});
		}
		const updated = {};
		const updateableFields = ['_id', 'username','keywords', 'title', 'synopsis', 'songs', 'imgURL', 'type'];
		updateableFields.forEach(field => {
			if (field in req.body) {
				updated[field] = req.body[field];
			}
		});

		Playlist
			.findByIdAndUpdate(req.body._id, {$set: updated}, {new: true})
			.exec()
			.then(updatedPlaylist => res.status(201).json(updatedPlaylist))
			.catch(err => res.status(500).json({message: 'Something went wrong'}));
	});

	// ====================================
	// delete playlist
	// ====================================
	app.delete('/playlists/:id', (req, res) => {
		Playlist
			.findByIdAndRemove(req.params.id)
			.exec()
			.then(() => {
				res.status(200).json({ message: 'successfully deleted' })
			})
			.catch(err => {
				console.error(err);
				res.status(500).json({ error: 'something went wrong' });
			});
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
	res.render('pages/index', { message: req.flash('loginMessage') });
};
