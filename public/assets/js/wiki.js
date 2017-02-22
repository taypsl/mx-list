
	// get excerpt from Wikipedia 
	// find, parse, and return url to query Wikipedia API
	var countPlaylists = $('.playlistLength').attr('id')
	console.log(countPlaylists);


	var wikiUrls = []
	function getWikiUrl() {
		console.log('hello')
		for(var i=0; i<countPlaylists; i++) {
			var pageUrl = $(`.wikiExcerpt${i}`).attr('id');
			console.log(pageUrl)
			var splitUrl = pageUrl.split('/wiki/');	
			var titleUrl = splitUrl[1];
			var percentUrl = titleUrl.replace("_", "%20");
			// need to request multiple pages with one api call "titles=PageA|PageB|PageC"
			//then need to disperse page information to each div


			console.log(percentUrl);
			var newUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + percentUrl + '&callback=?';
			
			wikiUrls.push(newUrl);

		}
		// console.log(wikiUrls)
	}



 	// query Wikipedia API
 	function getWikiExcerpt(url) {
 		for(var j=0; j<wikiUrls.length; j++) { 
	 		$.ajax({
		        type: 'GET',
		        url: url,
		        contentType: 'application/json; charset=utf-8',
		        async: false,
		        dataType: "json",
		        success: function (data, textStatus, jqXHR) {
		            var pageId = Object.keys(data.query.pages);
					var findByPageId = pageId[0];
					var textract = data.query.pages[findByPageId].extract;
					var finalExtract = textract.substring(0, 500);

					$(`.wikiExcerpt${j}`).html(finalExtract);

		         },
		        error: function (errorMessage) {
		        }
	    	});
	    }
 	}


getWikiExcerpt()
    




