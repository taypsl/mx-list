$(document).ready(function(){
	// get excerpt from Wikipedia 
	// find, parse, and return url to query Wikipedia API
	function getWikiUrl() {
		var pageUrl = $('.wikiExcerpt').attr('id');
		var splitUrl = pageUrl.split('/wiki/');	
		var titleUrl = splitUrl[1];
		var percentUrl = titleUrl.replace("_", "%20");
		console.log(percentUrl);
		var newUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + percentUrl + '&callback=?';
		return newUrl;
	}


 	// query Wikipedia API
 	function getWikiExcerpt() {
 		$.ajax({
	        type: 'GET',
	        url: getWikiUrl(),
	        contentType: 'application/json; charset=utf-8',
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	            var pageId = Object.keys(data.query.pages);
				var findByPageId = pageId[0];
				var textract = data.query.pages[findByPageId].extract;
				var finalExtract = textract.substring(0, 500);
				$('.wikiExcerpt').html(finalExtract);
	         },
	        error: function (errorMessage) {
	        }
    	});
 	}
    
getWikiExcerpt();

});

