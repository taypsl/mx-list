// load tools
var express = require('express');
var app = express();

// configure to use ejs
app.set('view engine', 'ejs');

//===============================
//use res.render to load ejs file
//===============================

//index||home page
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
//port
//===============================
app.listen(8080);
console.log('Mixin at 8080');
