function fetchJSONP(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    var script = document.createElement('script');

    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

var url = "https://api.etsy.com/v2/listings/active.js?api_key=cdwxq4soa7q4zuavbtynj8wx&keywords=whiskey&includes=Images,Shop";
var $results = document.querySelector('.content-results-placeholder');

// function logResults(data) {
// 	console.log(data);
// }

fetchJSONP(url, unpackData);

function unpackData(data) {

	var source = document.querySelector('#expressions-template').innerHTML;
	
	var template = Handlebars.compile(source);

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

	$results.insertAdjacentHTML('beforeend', compiledHTML);
}

function apostropheFix(string) {
	string = string.replace(/&#39;/g, "'");
	return string;
}

function quoteFix(string) {
	string = string.replace(/&quot;/g, '"');
	return string;
}

