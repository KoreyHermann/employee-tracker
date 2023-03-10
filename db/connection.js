// adds connection to MySQL
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'peakfiction',
    database: 'employee_tracker_db',

});

module.exports = db;