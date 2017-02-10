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
}
function onPlayerReady(){
     player.cueVideoByUrl('<%= playlist.songs[i].songURL %>');
}

// =================================
// add songs to new playlist form
// =================================
var songId = 0 // to give songs within playlists an id

function addSongToForm() {
	var newSong = $('.new-song-form');	
	var addSongButton = $('.add-song-button');
	$(newSong).append(`
		<div class="song-form" id="${songId}"> 
			<input type="text" placeholder="artist" name="artist" id="artist">
			<input type="text" placeholder="song name" name="name" id="name">
			<input type="text" placeholder="link to image" name="link to image" id="song-imgURL">
			<input type="text" placeholder="link to song" name="link to song" id="songURL">
			<input type="text" placeholder="song description" name="song description" id="description">
			<a href="#" class="remove-song">Remove</a>
			<hr class="song-line">
		</div>`);
	songId++
}
//check if ln34 is reading songId as a variable

function removeSong() {
	$(this).parent('div').remove();
}

function getFormInputs() {
	var playlistData = {
		title: $('#title').val(),
		synopsis: $('#synopsis').val(),
		keywords: $('#keywords').val(),
		songs: [],
		imgURL: $('#imgURL').val(),
		type: $('.type').val() // look for the one that's checked... ?
	}

	// iterate over song divs to find values and add to songs array
		var song = {
			id: $(`#${songId}`), //again, check if songId is reading as a variable
			artist: $('#artist').val(),
			name: $('#name').val(),
			imgURL: $('#song-imgURL').val(),
			songURL: $('#songURL').val(),
			description: $('#description').val(),
		}

	if (songId = i) {
		// need to look at each song-form div and if it doesn't yet exist
		// then add it to the songs[]
		playlistData.songs.push(song);
	}

	$.ajax({
		type: 'POST',
		url: '/api/playlists',
		data: playlistData,
		dataType: 'json',
			encode: true,
	})
	.done(function(formData) {
		console.log(formData);
	});
}

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
})

$('.pause').on('click', function(event) {
	player.pauseVideo();
	event.preventDefault();
})

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
	addSongToForm();
	event.preventDefault();
})

$('.new-song-form').on('click', '.remove-song', function(event) {
	$(this).parent('div').remove(); 
	event.preventDefault();
})

$('#submitForm').on('click', function(event) {
	getFormInputs();
	songId=0;
	event.preventDefault();
});

});