require('dotenv').config();
const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: "localhost",
    port:3306,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:"employee"
})