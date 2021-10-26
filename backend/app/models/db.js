const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

/* connect to DB */
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

/* open MySQL Connection */
connection.connect(error => {
    if(error) throw error;
    console.log("Successfully connected to the databse");
});

module.exports = connection;