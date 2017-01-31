module.exports = function(app, passport) {
	// ====================================
	// index page with ejs
	// ====================================
	app.get('/', function(req, res) {
		res.render('pages/index');
	});

	//app.post('/login, passport stuff)

	// ====================================
	// signup page 
	// ====================================
	app.get('/signup', function(req, res) {
		res.render('pages/signup', { message: req.flash('signupMessage')});
	});

	// ====================================
	// login page
	// ====================================
	app.get('/login', function(req, res) {
		res.render('pages/login',  { message: req.flash('loginMessage') });
	});

	// ====================================
	// new playlist
	// ====================================
	app.get('/new', function(req, res) {
		res.render('pages/new');
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
	res.redirect('/')''
};
