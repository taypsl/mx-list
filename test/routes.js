const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {User} = require('../app/models/user');
const Playlist = require('../app/models/playlist');
const configDB = require('../app/config/database');
const {app, runServer, closeServer, tearDownDb} = require('../server');

chai.use(chaiHttp);

// ======== test logic =================
// seed database with fake playlist data
function seedPlaylistData() {
	console.info('seeding playlist data')
	const seedData = [];
	for(let i=1; i<10; i++) {
		seedData.push(generatePlaylistData());
	}

	Playlist.insertMany(seedData);
};

// create fake playlist data
function generatePlaylistData() {
	return {
		//id: faker.random.uuid(), is this generated automatically?
		username: faker.internet.userName(),
		title: faker.random.words(),
		synopsis: faker.random.word(),
		keywords: faker.random.words(),
		songs:[{
			name: faker.random.words(),
			artist: faker.random.word(),
			songUrl: faker.image.imageUrl(),
			imgURL: faker.image.imageUrl()
		}],
		imgURL: faker.image.imageUrl(),
		type: faker.random.word() // 'song' or 'artist' list.
	}
};

describe('Playlist API resource', function() {
	// before any tests run, start server
	before(function() {
		return runServer(configDB.testurl);
	});
	// before each call, seed the database
	beforeEach(function() {
		return seedPlaylistData();
	});
	// after each call, tear down database
	afterEach(function() {
		//return tearDownDb();
	});
	// when all the tests have run, close the server
	after(function() {
		//return closeServer();
	});

	// describe POST endpoint
	describe('POST endpoint', function() {
		it('should add a new playlist', function() {
			const newPlaylist = generatePlaylistData();
			return chai.request(app)
			.post('/playlists')
			.send(newPlaylist)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.should.be.a('object');
				res.body.should.include.keys(['_id', 'username','keywords', 'title', 'synopsis', 'songs', 'imgURL', 'type']);
				res.body.songs.should.not.be.null;

				res.body.username.should.equal(newPlaylist.username);
				res.body.title.should.equal(newPlaylist.title);
				res.body.imgURL.should.equal(newPlaylist.imgURL);
				res.body.type.should.equal(newPlaylist.type);
				res.body.synopsis.should.equal(newPlaylist.synopsis);

				return Playlist.findById(res.body._id)
			});
		});
	});

	// describe GET endpoint
	describe('GET endpoint', function() {
		it('should return all existing playlists', function() {
			let res;
			let count = 0;
			return chai.request(app)
			.get('/playlists')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.length.of.at.least(1);

				return Playlist.count();
			})
			.then(function(count) {
				res.body.should.have.length.of(count);
			});
		});

		it('should return playlists with the correct fields', function() {
			let testPlaylist;
			return chai.request(app)
			.get('/playlists')
			.then(function(res) {
				//console.log(res.body)
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.not.be.empty;

				res.body.forEach(function(playlist) {
					playlist.should.be.a('object');
					playlist.should.include.keys(
						'_id', 'username', 'keywords', 'title', 'synopsis', 'songs', 'imgURL', 'type');
					});
					//just pick one to examine
					testPlaylist = res.body[0];
					return Playlist.findById(testPlaylist._id).exec();
				})
				.then(function(playlist) {
					//console.log(playlist);
					testPlaylist.title.should.equal(playlist.title);
					testPlaylist.synopsis.should.equal(playlist.synopsis);
					testPlaylist.username.should.equal(playlist.username);
					//testPlaylist.songs.should.equal(playlist.songs);
					testPlaylist._id.should.equal(playlist._id.toString());
					testPlaylist.imgURL.should.equal(playlist.imgURL);
					testPlaylist.type.should.equal(playlist.type);
				});
			});
		});

		// describe PUT endpoint
		describe('PUT endpoint', function() {
			it('should update playlists by id', function() {
				const updatedPlaylist = generatePlaylistData();
				 Playlist
				.findOne()
				.exec()
				.then(function(playlist) {
					console.log(updatedPlaylist._id);
					updatedPlaylist._id = playlist._id;
					return chai.request(app)
					.put(`/playlists/${playlist._id}`)
					.send(updatedPlaylist);
				})
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.should.be.a('object');
					res.body.should.include.keys(['_id', 'username','keywords', 'title', 'synopsis', 'songs', 'imgURL', 'type']);
					res.body.songs.should.not.be.null;
					res.body.username.should.equal(updatedPlaylist.username);
					res.body.title.should.equal(updatedPlaylist.title);
					res.body.imgURL.should.equal(updatedPlaylist.imgURL);
					res.body.type.should.equal(updatedPlaylist.type);
					res.body.synopsis.should.equal(updatedPlaylist.synopsis);
					return Playlist.findById(res.body._id).exec();
				})
				.then(function(playlist) {
					playlist.title.should.equal(updatedPlaylist.title);
					playlist.synopsis.should.equal(updatedPlaylist.synopsis);
					playlist.username.should.equal(updatedPlaylist.username);
					//playlist.songs.should.equal(updatedPlaylist.songs);
					playlist._id.toString().should.equal(updatedPlaylist._id.toString());
					playlist.imgURL.should.equal(updatedPlaylist.imgURL);
					playlist.type.should.equal(updatedPlaylist.type);
				});
			});
		});

		// describe delete endpoint
		describe('DELETE endpoint', function() {
			it('should delete a playlist by id', function() {
				let playlist;
			 Playlist
				.findOne({}, function(error, _playlist) {
					playlist = _playlist;
					return chai.request(app).delete(`/playlists/${playlist._id}`)
				})
				.then(function(res) {
					console.log(res)
					res.should.have.status(200);
					return Playlist.findById(playlist._id).exec();
				})
				.then(function(_playlist) {
					should.not.exist(_playlist);
				});
			});
		});

	});
