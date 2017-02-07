$(document).ready(function() {
	"use strict";


// functions that display 

// display event listeners
$('.title-container').on('click', function(event) {
	console.log(this.id);
	location.href=`/playlists/${this.id}`;
	event.preventDefault();
	//take user to /playlist/:this.(#id)
})

});
