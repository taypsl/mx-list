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
	};

	function onPlayerReady(event) {
	    $(".pause").on("click", function(event) {
	      event.preventDefault();
	      player.pauseVideo();
	    });
	};

	function onStateChange(url) {
	  player.loadVideoByUrl(url);
	};

	$('.play-video').on('click', function(event) {
	  	event.preventDefault();
	  	var thisUrl = $(this).attr('href');
	  	onStateChange(thisUrl);
	  	$(this).siblings('.pause').toggleClass('hidden');
	  	// $('.pause').toggleClass('hidden');
	  	$(this).toggleClass('hidden');
	});

	$('.pause').on('click', function(event) {
		event.preventDefault();
		$(this).siblings('.play-video').toggleClass('hidden');
		// $('.play-video').toggleClass('hidden');
	  	$(this).toggleClass('hidden');
	});
