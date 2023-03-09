// adds connection to MySQL
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //add password here later
    database: 'employee_tracker_db',

});

module.exports = db;