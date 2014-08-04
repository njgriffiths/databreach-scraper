// MODULES
var fs = require('fs');
var request = require('request');
var parseString = require('xml2js').parseString;

// VARIABLES
var xmlMerge = true; // see xml2json docs for details


// FUNCTIONS
function init(feed, callback) {
	// check for a web url
	if (feed && feed.substring(0,4) !== 'http') {
		// local JSON file 
		readFromFile(feed, callback);

		return;
	} else if (!feed) {
		console.log('Missing file/URL...');
	}
	// get our file
	fetch(feed, callback);
}

function feedToJSON(xml, callback) {
	console.log('XML2JSON: Converting xml to json...');
	
	parseString(xml, { mergeAttrs: xmlMerge }, function(err, resp) {
		if (err) {
			console.log('JSON PARSE ERROR: ', err);
		} else {
			// DO SOMETHING HERE
			callback(resp);
		}
	});
}

var fetch = function(url, callback) {
	request(url, function(err, resp, data) {
		console.log('FETCH: Getting', url);

		if (err) {
			console.log('FETCH ERROR: ', err, resp);
		} else { //if (!err && resp.statusCode == 200) {
			feedToJSON(data, callback);
		}
	});
};

var readFromFile = function(file, callback) {
	console.log('READ FILE: reading ', file);

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			return console.log('READ FILE ERROR: ', err);
		} else {
			var format = file.substr(file.length - 4).toLowerCase();
			
			if (format === '.exml' || format === '.xml') {
				// convert xml to json
				feedToJSON(data, callback);

				return;
			} else {
				console.log('READ FILE ERRROR: Required file format is .xml or .exml');
			}
		}
	});
};


// EXPORTS
exports.init = init;