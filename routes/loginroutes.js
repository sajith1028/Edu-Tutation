var mysql      = require("mysql");
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "akura",
  database : "akura"
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

exports.register = function(req,res){
  console.log("req",req.body); }