$(document).ready(function() {
	"use-strict";



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
// event listeners
// =================================

$('.title-container').on('click', function(event) {
	location.href=`/playlists/${this.id}`;
	event.preventDefault();
});

$('.play').on('click', function(event) {
	player.playVideo();
})

$('.pause').on('click', function(event) {
	player.pauseVideo();
})

/*
$('.song-container').on('mouseover', function(event) {
	player.playVideo();
})

$('.song-container').on('mouseout', function(event) {
	player.pauseVideo();
})
*/

});