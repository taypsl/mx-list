$(document).ready(function() {
	"use strict";

// function to send data to API

$('#submit').on('click', function(){
	const playlist = {
		title: $('#title').val();
		synopsis: $('#synopsis').val();
		keywords: $('#keywords').val();
		type: $('.type').val();
	const songs = {
		
	}
} 

( URL, data, callback);




$("#btn").click(function(){
var vname = $("#name").val();
var vemail = $("#email").val();
if(vname=='' && vemail=='')
{
alert("Please fill out the form");
}
else if(vname=='' && vemail!==''){alert('Name field is required')}
else if(vemail=='' && vname!==''){alert('Email field is required')}
else{
$.post("jquery_post.php", //Required URL of the page on server
{ // Data Sending With Request To Server
name:vname,
email:vemail
},
function(response,status){ // Required Callback Function
alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);//"response" receives - whatever written in echo of above PHP script.
$("#form")[0].reset();
});
}
});

});