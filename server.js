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
mongoose.Promise = global.Promise;


app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs'); // use ejs
app.use(express.static(__dirname + '/public/')); // make this folder public, dont need relative path
app.use('/playlists', express.static(__dirname + '/public/')) // serve public folder for /playlist requests
app.use('/playlists/:id', express.static(__dirname + '/public/')) // serve public folder for /playlist requests

//setup express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser())

//===============================
//passport stuff
//===============================
require('./app/config/passport')(passport)

app.use(session({ secret: 'illjustleavethishere' }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport);
require('./app/apiRoutes.js')(app, passport);

//===============================
//launch at port...
//===============================
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=configDB.url, port=(process.env.PORT || 8080)) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Mixin at ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}
function tearDownDb() {
  console.warn('deleting database');
  return mongoose.connection.db.dropDatabase();
};

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer, tearDownDb};

/*// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/
