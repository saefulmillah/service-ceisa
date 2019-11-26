const express = require('express'),
	app = express(),
	bodyParser = require('body-parser');
	port = process.env.PORT || 8666;
// cors
const cors = require('cors');
app.use(cors());
const mysql = require('mysql');
// connection configurations
const mc = mysql.createConnection({
    host     : '209.58.180.97',
    user     : 'ndriiy',
    password : 'ndriiy1234',
    database : 'zadmin_tomsdb'
});

// const mc = mysql.createConnection({
//     host     : '209.58.180.97',
//     user     : 'ceisa',
//     password : 'ceisa123',
//     database : 'zadmin_ceisa'
// });
 
// connect to database
mc.connect();

app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes/appRoutes'); //importing route
routes(app); //register the route
