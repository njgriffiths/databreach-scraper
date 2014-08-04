var fetch = require('./fetch-xml');
var mysql = require('./sql-import');
var cheerio = require('cheerio');


// VARIABLES
var feed;
var defaultURL = 'https://www.privacyrights.org/breach-rss';

// mysql variabls
var user = 'root';
var host = 'localhost';
var dbName = 'databreaches';
var dbTable = 'breaches';

// mysql queries
var insertRecord = 'INSERT INTO ' + dbTable + ' SET ?';


// FUNCTIONS
var init = function(url) {
	// default or custom file/URL
	if (url) {
		feed = url;
	} else {
		feed = defaultURL;
	}

	// go get the data
	fetch.init(feed, processFeed);
}

var processFeed = function(data) {
	var json = {};
	var channel = data.rss.channel[0];
	var breaches = channel.item;

	// open database connection
	var connection = mysql.initConnection(host, user, dbName);

	// prep & insert each entry into the database
	breaches.forEach(function(entry, i) {
		// console.log('ENTRY: ', Object.keys(entry))

		// prepare a json object for db insert
		parseMetadata(entry, json);	
		// prepDescription(entry.description[0], json);
		parseDescription(entry.description[0], json);

		// check for the guid & delete the record if it exists in the db
		// THIS SHOULD TRIGGER AN UPDATE, NOT DELETE
		mysql.checkRecordExists(connection, 'guid', json.guid, dbTable);
		// insert the new record
		mysql.queryConnection(connection, insertRecord, json, dbTable);
	});

	// close db connection
	connection.end();
}

var parseDescription = function(entry, json) {
	var $ = cheerio.load(entry);
	var location = $('.location-locations-wrapper');

	// Address info
	json.street = $('.street-address', location).text();
	json.city = $('.locality', location).text();
	json.state = $('.region', location).text();
	json.country = $('.country-name', location).text();

	// breach info
	json.records_all = parseInt($('.field-field-breach-quanity p').text().toLowerCase().replace(/,/g , '')) || null;
	json.source = $('.field-field-source .field-item').text().replace(/\n/g , '').replace(/ /g, '');
	json.description = $('.location-locations-header').nextAll('p').text();
	// json.public_date = $('.date-display-single').text(); // this is in metadata
}

var parseMetadata = function(entry, json) {
	json.guid = parseInt(entry.guid[0]['_'].split(' ')[0]);
	json.name = entry.title[0];
	json.public_date = new Date(entry.pubDate[0]).toISOString().slice(0, 19).replace('T', ' '); // format for mysql datetime
	json.entity = entry.category[1]['_'];
	json.type = entry.category[0]['_'];
	json.year = parseInt(entry.category[2]['_']);
	json.url = entry.link[0];
}


// EXPORTS
exports.init = init;