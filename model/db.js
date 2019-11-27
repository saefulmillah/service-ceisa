'user strict';

var mysql = require('mysql');

//local mysql db connection
// var connection = mysql.createConnection({
//     host     : '209.58.180.97',
//     user     : 'ndriiy',
//     password : 'ndriiy1234',
//     database : 'zadmin_tomsdb'
//     multipleStatements: true
// });

var connection = mysql.createConnection({
    host     : '209.58.180.97',
    user     : 'ceisa',
    password : 'ceisa123',
    database : 'zadmin_ceisa',
    multipleStatements: true
});


connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;