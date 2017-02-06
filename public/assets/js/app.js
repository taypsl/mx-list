$(document).ready(function() {
	"use strict";

// function to send data to API
/*
$('#submit').on('click', function(){
	const playlist = {
		title: $('#title').val(),
		synopsis: $('#synopsis').val(),
		keywords: $('#keywords').val(),
		type: $('.type').val();
	const songs = {

	}
}

( URL, data, callback);


*/

// state vars 

// functions that get data 
function getPlaylistDataById(currentId) {
	$.ajax({
		url: `http://localhost:8080/playlist/${currentId}`,
		dataType: 'jsonp',
		jsonp: 'jsonp',
		type: 'GET', 
		success: function(data) {
			console.log('success', data);
		},

	})
}
// functions that display 

// display event listeners
$('.title-container').on('click', function(event) {
	var currentPlaylistId = this.id;
	console.log(this.id);
	//getPlaylistDataById(currentPlaylistId);
	event.preventDefault();
	//take user to /playlist/:this.(#id)
})

});
