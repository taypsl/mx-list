// load tools
const express = require('express');
const app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

//===============================
//configuration
//===============================
app.set('view engine', 'ejs'); // use ejs
app.use(express.static('images'));// use db

mongoose.connect(configDB.url);
// require('./config/passport')(passport)

//setup express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser())

//===============================
//passport stuff
//===============================
app.use(session({ secret: 'illjustleavethishere' }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//===============================
//routes
//===============================
require('./app/routes.js')(app, passport)

//index||home page with ejs
app.get('/', function(req, res) {
	res.render('pages/index');
});

//sign up page
app.get('/signup', function(req, res) {
	res.render('pages/signup');
});

//login page
app.get('/login', function(req, res) {
	res.render('pages/login');
});

//create new playlist page
app.get('/new', function(req, res) {
	res.render('pages/new');
});

//authenticated user page
app.get('/user', function(req, res) {
	res.render('pages/user');
});

//===============================
//launch at port...
//===============================
app.listen(8080);
console.log('Mixin at 8080');
