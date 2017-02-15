const Playlist = require('./models/playlist');

module.exports = function(app, passport) {


  app.get('/api/playlists', function(req, res) {
    Playlist
    .find()
    .exec()
    .then(playlists => {
      res.json(playlists);
    })
    .catch(err => {
      res.status(500).json({error: 'Something went wrong'})
    });
    //  res.render('index.ejs', {Playlist:res})
  })


  app.post('/api/playlists', function(req, res) {

  //  const requiredFields = ['username', 'title', 'synopsis', 'songs', 'imgURL', 'type'];
  console.log(req.body);
    Playlist
    .create({
      username: req.body.username,
      title: req.body.title,
      synopsis: req.body.synopsis,
      songs: req.body.songs, //??
      imgURL: req.body.imgURL,
      type: req.body.type
    })
    .then(playlist =>
      res.status(201).json(playlist)
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
  });

  // ====================================
  // update playlist
  // ====================================
  app.put('/api/playlists/:id', (req, res) => {
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
    app.delete('/api/playlists/:id',  (req, res) => {
    // TODO VALIDATE USER IS LOGGED IN & IS OWNER OF PLAYLIST
    // Playlist.find()  playlist
    // if req.user.id === playlist.author
    //   delete.
    
    var authorName;
    var requestName;

    Playlist
    .find(req.params.user)
    .exec()
    .then(playlist => {
        requestName = req.user.local.username
        //console.log(req.user.local.username);
        //console.log(playlist)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
  });

  /* 
    app.delete('/api/playlists/:id',  (req, res) => {
    // TODO VALIDATE USER IS LOGGED IN & IS OWNER OF PLAYLIST
    // Playlist.find()  playlist
    // if req.user.id === playlist.author
    //   delete.

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
  */
};


//function to check if user is logged in
function sendToHomeIfNotAuthenticated(req, res, next) {
  //if user is logged in
  if (req.isAuthenticated())
  return next();
  //if user is not logged in, redirect them
  res.status(500).json({ error: 'not auth' });
};
