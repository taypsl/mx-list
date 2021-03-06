//require mongoose to build schema
const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  id: String,
  username: String, //author
  title: String,
  synopsis: String,
  keywords: { type: Array, default: [] },
  songs:[{
    id: String,
    name: String,
    artist: String,
    songId: String,
    imgURL: String,
    wikiExcerpt: String,
    description: String,
  }],
  imgURL: String,
  type: String // 'song' or 'artist' list.
});

//create user model and expose it to app
module.exports = mongoose.model('Playlist', playlistSchema);
