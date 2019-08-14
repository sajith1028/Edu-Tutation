const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "nimesha",
    password: "",
    database: "akura",
    charset: "utf8"
});

exports.connections = pool;