$(document).ready(function() {
	"use strict";

// ===============================================
// youtube iframe api and custom player functions
// ===============================================
// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
	    events: {
	        'onReady': onPlayerReady,
	        'onStateChange': onPlayerStateChange
	    }
  	})
};
// The API will call this function when the video player is ready
//function onPlayerReady(event) {
//	event.target.playVideo();  // on mouseover... 
//}



function onPlayerReady(event) {
  // bind events
  var playButton = $(event.target.c).parent().find('.play');
  playButton.on('click', function() {
    event.target.playVideo();
  });
}




// ===============================================
// display event listeners
// ===============================================

//click on playlist title to be taken to playlist
$('.title-container').on('click', function(event) {
	location.href=`/playlists/${this.id}`;
	event.preventDefault();
})

$('.player-icon').on('click', function(event) {
	var thisVideo = $(this).sibling('iframe')
	thisVideo.play();
})

/*
// when hovering on song container, play the audio with the id of the song position
$('.song-container').on('mouseover', function(event) {
	//'audio' html
	//var currentClip = $(this).children('audio').attr('id');
	
	//iframe html
	var currentClip = $(this).children('iframe').attr('id');
	playSongClip(currentClip);
	//at some point add volume animation from 0 to 1
});


$('.song-container').on('mouseout', function(event) {
	//'audio' html
	//var currentClip = $(this).children('audio').attr('id');

	//iframe html
	var currentClip = $(this).children('iframe').attr('id');
	playSongClip(currentClip);
	pauseSongClip(currentClip);
	//at some point add volume animation from 1 to 0
}); */

// ===============================================
// custom code -- saving for later JIC ------->>>>
// ===============================================
// custom: play music on hover functions 

/*
function playSongClip(songObj) {
	console.log(songObj);
	var thisSong = document.getElementById(songObj);
	thisSong.play();
}

function pauseSongClip(songObj) {
	var thisSong = document.getElementById(songObj);
	thisSong.pause();
	thisSong.currentTime = 0; 
} 

//click on playlist title to be taken to playlist
$('.title-container').on('click', function(event) {
	location.href=`/playlists/${this.id}`;
	event.preventDefault();
})

// when hovering on song container, play the audio with the id of the song position
$('.song-container').on('mouseover', function(event) {
	var currentClip = $(this).children('audio').attr('id');
	playSongClip(currentClip);
	//at some point add volume animation from 0 to 1

});


$('.song-container').on('mouseout', function(event) {
	var currentClip = $(this).children('audio').attr('id');
	pauseSongClip(currentClip);
	//at some point add volume animation from 1 to 0
});

*/
}); 
