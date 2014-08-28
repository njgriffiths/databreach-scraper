// modules
var mysql = require('mysql');

// functions
function initConnection(host, user, dbName) {
	console.log('SQL: Opening connection...')

	var connection = mysql.createConnection({
		host: host,
		user: user,
		database: dbName
	});

	connection.connect();
	connection.query('use ' + dbName + ';');
	connection.query('SET CHARACTER SET utf8;');

	return connection;
}

function queryConnection(connection, query, jsonEntry, table, callback) {
	connection.query(query, jsonEntry, function(err, result, fields) {
		if (err) { throw err; }

		if (callback) { callback(result, fields); } // not used
	});
}

// function checkRecordExists(connection, idName, idValue, table) {
// 	var deleteQuery = 'DELETE FROM ' + table + ' WHERE ' + idName + ' LIKE ' + idValue + ';';

//  	connection.query(deleteQuery, idValue, function(err, result, fields) {
//  		if (err) { throw err; }

//  		if (result.affectedRows > 0) {
//  			console.log(idName + ' ' + idValue + ' exists.');
//  		}
//  	});
// }

// EXPORTS
exports.initConnection = initConnection;
exports.queryConnection = queryConnection;
// exports.checkRecordExists = checkRecordExists;