$('.search-button').on('click', function(event) {
	console.log('click');
	var params = {
		key: 'q47myhvvdbxey78e30zt33el',
		search: $('#keyword-search').val()
	}
	clearSearches();
	var url = 'https://api.etsy.com/v2/listings/active.js?api_key='+ params.key +'&keywords=' + params.search + '&includes=Images,Shop&sort_on=score';
	getData(params,url);
	event.preventDefault();
})

function clearSearches() {
	console.log('clearing');
	$('.shop-by-placeholder').html('');
	$('.content-categories-results-placeholder').html('');
	$('.content-results-placeholder').html('');
}

function getData(params, url) {
	console.log('getting data');
	$.get(url, unpackData, 'jsonp');
}

function unpackData(data) {

	console.log('unpacking data');

	resultsFunc(data);

	refineSearch(data);

	contentNameResults(data);

}

function resultsFunc(data) {
	var source = $('#expressions-template').html();
	var template = Handlebars.compile(source);
	var $results = $('.content-results-placeholder');
	Handlebars.registerHelper('productImage', function(){
        return this.Images[0].url_170x135;
    });
    Handlebars.registerHelper('checkTitle', function(string){
	    var str = apostropheFix(string);
	    str = quoteFix(str);
		if (str.length > 30){
	        str = str.slice(0,30);
	        return str + '...';
	    } else {
	    	return str;
	    }
	});
	Handlebars.registerHelper('checkShop', function(string){
		var str = apostropheFix(string);
	    str = quoteFix(str);
	    if (str.length > 18) {
	    	str = str.slice(0,18);
	    	return str;
	    } else {
	    	return str;
	    }
	});
	var compiledHTML = template(data);
	$results.append(compiledHTML);
}

function refineSearch(data) {
	var $results = $('.content-categories-results-placeholder');
	var categories = [];
	data.results.forEach(function(item) {
		if (categories.indexOf(item.category_path[0].toString()) === -1) {
			categories.push(item.category_path[0].toString());
		} else {
			return false;
		}
	});

	categories = categories.sort();



	categories.forEach(categoryLinks)

	
}

function categoryLinks(item) {
	var categoryText = item.replace(/and/g, '&');
	item = item.replace(/ and /gi, '-and-');
	var link = '<a href="https://www.etsy.com/search/' + item + '?q=' + $('#keyword-search').val() + '">' + categoryText + '</a>';

	$('.content-categories-results-placeholder').append(link).addClass('space');
}

function contentNameResults(data) {
	var $results = $('.content-results-category');
	// if ()
	$results.html('<span>' + '"' + $('#keyword-search').val() + '"</span>' + ' (' + data.count + ' Items)');
	$('#keyword-search').val('');
}

function apostropheFix(string) {
	string = string.replace(/&#39;/g, "'");
	return string;
}

function quoteFix(string) {
	string = string.replace(/&quot;/g, '"');
	return string;
}