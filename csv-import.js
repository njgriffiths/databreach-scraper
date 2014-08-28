var fs = require('fs');
var csv = require('ya-csv');
var mysql = require('./sql-import');
// var mysql = require('mysql');

// VARIABLES
var csvPath = './databreaches-import.csv';


// mysql variabls
var user = 'root';
var host = 'localhost';
var dbName = 'databreaches';
var dbTable = 'breaches';

// mysql queries
var insertRecord = 'INSERT INTO ' + dbTable + ' SET ?';


// FUNCTIONS
var init = function() {
	var length = 0;
	// open database connection
	var connection = mysql.initConnection(host, user, dbName);
	// create csv reader
	var reader = csv.createCsvFileReader(csvPath);

	// parse csv file
	reader.addListener('data', function(entry) {
		length += 1;
		var json = csvToJSON(entry);

		// insert the new record
		mysql.queryConnection(connection, insertRecord, json, dbTable);
	});

	// close up shop
	reader.addListener('end', function() {
		console.log('Done. Total rows processed: ', length);
		connection.end();
	});
}

function csvToJSON(entry) {
	var json = {
		guid: parseInt(entry[0]) || 0,
		name: entry[2],
		public_date: new Date(entry[1]).toISOString().slice(0, 19).replace('T', ' '), // format for mysql datetime
		entity: entry[3],
		type: entry[4],
		year: parseInt(entry[14]),
		url: null,
		records_ssn: parseInt(entry[10]) || null,
		records_all: parseInt(entry[11]) || null,
		source: entry[13],
		description: entry[12].toString(),


		// address info
		street: entry[5],
		city: entry[6],
		state: entry[7],
		postal: entry[8],
		country: entry[9]
	}

	return json;
}


// KICK IT OFF
init();