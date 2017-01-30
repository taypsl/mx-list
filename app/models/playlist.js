//require mongoose to build schema
const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
// "id":  mongo generated
// "user": userID, //author
  "title": String,
  "synopsis": String,
  "keywords":[],
  "songs":[{
    "name": String,
    "artist": String,
    "songUrl": String,
    "imgURL": String 
}],
  "imgURL": String, 
  "type": String // song/artist list. 
});
