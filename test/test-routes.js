const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {User} = require('../app/models/user');
const Playlist = require('../app/models/playlist');
const configTestDB = require('../app/config/test-database');
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
}

// create fake playlist data
function generatePlaylistData() {
	return {
		//id: faker.random.uuid(), is this generated automatically?
		username: faker.internet.userName(),
		title: faker.random.words(),
		synopsis: faker.random.word(),
		//keywords:[],
		songs:[{
			name: faker.random.words(),
			artist: faker.random.word(),
			songUrl: faker.image.imageUrl(),
			imgURL: faker.image.imageUrl()
		}],
		imgURL: faker.image.imageUrl(),
		type: faker.random.word() // 'song' or 'artist' list.
	}
}


const configDB = require('../app/config/database.js');

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
		return tearDownDb();
	});
	// when all the tests have run, close the server
	after(function() {
		return closeServer();
	});

	describe('POST endpoint', function() {
		it('should add a new playlist', function() {
			const newPlaylist = generatePlaylistData();

			return chai.request(app)
			.post('/playlist')
			.send(newPlaylist)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('_id', '__v', 'username','keywords', 'title', 'synopsis', 'songs', 'imgURL', 'type');
				res.body.songs.should.not.be.null;
				res.body.synopsis.should.equal(newPlaylist.synopsis);

				res.body.username.should.equal(newPlaylist.username);
				res.body.title.should.equal(newPlaylist.title);
				res.body.imgURL.should.equal(newPlaylist.imgURL);
				res.body.type.should.equal(newPlaylist.type);
				return Playlist.findById(res.body.id).exec();
			});
		});
	});

	describe('GET endpoint', function() {
		it('should return all existing playlists', function() {
			let res;
			let count = 0;
			return chai.request(app)
			.get('/')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.should.have.length.of.at.least(1);

				return Playlist.count();
			})
			.then(function(count) {
				res.body.should.have.length.of(count);
			})
		});
		it('should return playlists with correct fields', function() {
			let resPlaylists;
			return chai.request(app)
			.get('/')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.length.of.at.least(1);
				res.body.forEach(function(playlist) {
					playlist.should.be.a('object');
					playlist.should.include.keys(
						'id', 'username', 'title', 'synopsis', 'songs', 'imgUrl', 'type');
					});
					resPlaylist = res.body[0];
					return Playlist.findById(resPlaylists.id).exec();
				})
				.then(function(playlist) {
					resPlaylists.title.should.equal(playlist.title);
					resPlaylists.synopsis.should.equal(playlist.synoposis);
					resPlaylists.songs.should.equal(playlist.songs);
					resPlaylists.id.should.equal(playlist.id);
					resPlaylists.username.should.equal(playlist.username);
					resPlaylists.imgUrl.should.equal(playlist.imgUrl);
					resPlaylists.type.should.equal(playlist.type);
				});
			});
		});
		// tests to allow playlists to be edited...
		describe('PUT endpoint', function() {
			it('should update playlist', function() {
				///
			})
		});
		// tests to allow playlists to be deleted
		describe('DELETE endpoint', function() {
			it('should delete a playlist by id', function() {
				let playlist;

				return Playlist
				.findOne()
				.exec()
				.then(function(_playlist) {
					playlist = _playlist;
					return chai.request(app).delete(`/posts/${playlist.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Playlist.findById(playlist.id);
				})
				.then(function(_playlist) {
					should.not.exist(_playlist);
				});
			});

		});
	})
