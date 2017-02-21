// $(document).ready(function() {
	// =================================
	// create and cue youtube iframe to 
	// enable custom pause/play buttons
	// (future feature)
	// =================================
	var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
	  	var firstScriptTag = document.getElementsByTagName('script')[0];
	  	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		var player;

	function onYouTubeIframeAPIReady() {
	    player = new YT.Player('video', {
	      //videoId: $('.video').attr('href'),  
	      events: {
	            onReady: onPlayerReady, 
	            onState: onStateChange
	        }
	    });
	}

	function onPlayerReady(event) {
	    $(".pause").on("click", function(event) {
	      event.preventDefault();
	      player.pauseVideo();
	    });
	};

	function onStateChange(url) {
	  player.loadVideoByUrl(url);
	}

	$('.play-video').on('click', function(event) {
	  event.preventDefault();
	  var thisUrl = $(this).attr('href');
	  console.log(thisUrl)
	  onStateChange(thisUrl);
	});

	$('.song-container').on('mouseover', function(event) {
	  event.preventDefault();
	  console.log('mouseover')
	  var thisURl = $(this).attr('id');
	  console.log(thisUrl)
	  // onStateChange(thisUrl);
	});
 
/*
// === add later when video feature is working ===>
$('.song-container').on('mouseover', function(event) {
	player.playVideo();
})

$('.song-container').on('mouseout', function(event) {
	player.pauseVideo();
})
*/
// });