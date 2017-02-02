const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {User} = require('../models/user');
const {Playlist} = require('../models/playlist');
const configTestDB = require('../app/config/test-database');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

// ======== test logic =================
// seed database with fake playlist data
function seedPlaylistData() {
	console.info('seeding playlist data')
	const seedData = [];
	for(let i=1; i<10; i++) {
		seedData.push(generatePlaylistData());
	}
	return Playlist.insertMany(seedData);
}

// create fake playlist data
function generatePlaylistData() {
	return {
		//id: faker.random.uuid(), is this generated automatically?
		username: faker.internet.userName(),
		title: faker.random.words(),
		  synopsis: faker.random.sentence(),
		  //keywords:[],
		  songs:[{
		    name: faker.random.words(),
		    artist: faker.random.word(),
		    songUrl: String,
		    imgURL: faker.image.imageUrl() 
		}],
		  imgURL: faker.image.imageUrl(), 
		  type: faker.random.word() // 'song' or 'artist' list. 
		}
	}
}

// tear down database
function tearDownDb() {
	console.warn('deleting database');
	return mongoose.connection.dropDatabase();
};

describe('Playlist API resource', function() {
	// before any tests run, start server
	before(function() {
		return runServer(configTestDB);
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

	describe('GET endpoint', function() {
		it('should return all existing playlists', function() {
			let res; 
			let count = 0;
			return chai.request(app)
			.get('/posts')
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
			.get('/posts')
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

	describe('POST endpoint', function() {
		it('should add a new playlist', function() {
			const newPlaylist = generatePlaylistData();
			return chai.request(app);
			.post('/posts')
			.send(newPlaylist)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id', 'username', 'title', 'synopsis', 'songs', 'imgUrl', 'type');
				res.body.songs.should.not.be.null;
				res.body.synopsis.should.equal(newPlaylist.synopsis);
				res.body.id.should.equal(newPlaylist.id);
				res.body.username.should.equal(newPlaylist.username);
				res.body.title.should.equal(newPlaylist.title);
				res.body.imgUrl.should.equal(newPlaylist.imgUrl);
				res.body.type.should.equal(newPlaylist.type);
				return Playlist.findById(res.body.id).exec();
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

