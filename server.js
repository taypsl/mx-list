// load tools
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./app/config/database.js');

//===============================
//configuration
//===============================
mongoose.connect(configDB.url);
require('./app/config/passport')(passport)

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs'); // use ejs
app.use(express.static(__dirname + '/public'));// make this folder public, dont need relative path


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

require('./app/routes.js')(app, passport)

//===============================
//launch at port...
//===============================
app.listen(8080);
console.log('Mixin at 8080');

