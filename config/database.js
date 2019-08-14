const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "nimesha",
    password: "",
    database: "akura",
    charset: "utf8"
});

console.log("MySQL connection pool initialized!");

exports.connections = pool;