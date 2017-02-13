$(document).ready(function() {
	"use-strict";

	// =================================
	// create and cue youtube iframe // not working outside of html file!!
	// =================================
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";

	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			events: {
				'onReady': onPlayerReady
			}
		});
	};

	function onPlayerReady(){
		player.cueVideoByUrl('<%= playlist.songs[i].songURL %>');
	};

	// =================================
	// add songs to new playlist form
	// =================================
	var songId = 0 // to give songs within playlists an id

	function addSongToForm() {
		var newSong = $('.song-form');
		var addSongButton = $('.add-song-button');
		$(newSong).append(`
			<div class="new-song-form" id="${songId}">
				
				<div class="form-group row col-sm-8 col-sm-offset-2">
					<label class="col-sm-2 col-form-label"></label>
					<div class="col-sm-10">
						<input class="form-control artist" type="text" placeholder="artist" name="artist">
					</div>
				</div>
				<div class="form-group row col-sm-8 col-sm-offset-2">
					<label class="col-sm-2 col-form-label"></label>
					<div class="col-sm-10">
						<input class="form-control song-imgURL" type="text" placeholder="link to image" name="song-imgURL">
					</div>
				</div>
				<div class="form-group row col-sm-8 col-sm-offset-2">
					<label class="col-sm-2 col-form-label"></label>
					<div class="col-sm-10">
						<input class="form-control name" type="text" placeholder="most essential song" name="name">
					</div>
				</div>
				<div class="form-group row col-sm-8 col-sm-offset-2">
					<label class="col-sm-2 col-form-label"></label>
					<div class="col-sm-10">
						<input class="form-control songURL" type="text" placeholder="link to song" name="songURL">
						<small id="linkHelp" class="form-text text-muted"> For optimal experience, use a link from <a href="http://www.youtube.com">YouTube.</a></small>
					</div>
				</div>
				<div class="form-group row col-sm-8 col-sm-offset-2">
					<label class="col-sm-2 col-form-label"></label>
					<div class="col-sm-10">
						<textarea class="form-control description" type="text" rows="3" cols="50" placeholder="description" name="description"></textarea>
					</div>
				
					<div class="rs-btn"><a class="remove-song-button" href="#"><span class="glyphicon glyphicon-minus black"></span> Remove</a></div>
				</div>			

				<div class="row col-sm-12"><hr></div>

			</div>
		`);
		
		songId++
	};
	
	addSongToForm();

	function removeSong() {
		$(this).parent('div').remove();
	};

	function getFormInputs() {

		var playlistData = {
			title: $('#title').val(),
			username: $('#username').attr('value'), // get username from form to store author with playlist
			synopsis: $('#synopsis').val(),
			keywords: $('#keywords').val().split(" "),
			songs: [],
			imgURL: $('#imgURL').val(),
			type: $('.type').val() // look for the one that's checked... ?
		}

		songId=0;

		var songsForms = $('.new-song-form');

		for(var i=0; i<songsForms.length; i++) {
			var item = songsForms[i];
			var song = {
				artist: $(item).find('.artist').val(),
				name: $(item).find('.name').val(),
				imgURL: $(item).find('.song-imgURL').val(),
				songURL: $(item).find('.songURL').val(),
				description: $(item).find('.description').val()
			}
			playlistData.songs.push(song)
		}

		$.ajax({
			type: 'POST',
			url: '/api/playlists',
			data: playlistData,
			dataType: 'json',
			encode: true,
		})
			.done(function(data) {
				//console.log(data);

			});
		event.preventDefault();
	};

	// =================================
	// event listeners -> iframe video
	// =================================

	$('.title-container').on('click', function(event) {
		location.href=`/playlists/${this.id}`;
		event.preventDefault();
	});

	$('.play').on('click', function(event) {
		player.playVideo();
		event.preventDefault();
	});

	$('.pause').on('click', function(event) {
		player.pauseVideo();
		event.preventDefault();
	});

	/* === add later when it's working ===>
	$('.song-container').on('mouseover', function(event) {
		player.playVideo();
	})

	$('.song-container').on('mouseout', function(event) {
		player.pauseVideo();
	})
	*/

	// =================================
	// event listeners -> add to form
	// =================================
	$('.add-song-button').on('click', function(event) {
		event.preventDefault();
		addSongToForm();
	});

	$('.song-form').on('click', '.remove-song-button', function(event) {
		event.preventDefault();
		$(this).parents('.new-song-form').remove();
	});

	$('#submitForm').on('click', function(event) {
		event.preventDefault();
		getFormInputs();
		console.log('submit was clicked');
		window.location = ('/');

	});

});
