//require mongoose to build schema
const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  id: String,
  username: String, //author
  title: String,
  synopsis: String,
  keywords: { type: Array, default: [] },
  songs:[{
    name: String,
    artist: String,
    songUrl: String,
    imgURL: String
  }],
  imgURL: String,
  type: String // 'song' or 'artist' list.
});

//create user model and expose it to app
module.exports = mongoose.model('Playlist', playlistSchema);
