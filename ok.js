//var http = require("http");
var mysql = require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  user: "nimesha",
  password: "",
  database: "akura",
  charset: "utf8"
});

//HTML string to be sent to the browser

// var reo="<html><head><title>Add Students</title></head><body><h1>New student enrolment</h1>{${table}}</body></html>";


// //Sets the HTML table with results from sql query

// function setHTML(sql,cb){
//   pool.getConnection((err,con)=>{
//     if(err) 
//       console.log(err);
//     else{
//       con.query(sql,(err,res,cols)=>{
//         if(err) console.log(err);
//         var table=""; //to store the HTML table
//         //create HTML table with data from res
//         table+="<table border='1'><tr><th>Number</th><th>Subject</th><th>Lecturer</th><th>Year</th></tr>";
//         for(var i=0;i<res.length;i++){
//           table+="<tr><td>"+(i+1)+"<input type='checkbox' name='subject' value='"+res[i].subname+"'> "+"</td><td>"+res[i].subname+"</td><td>"+res[i].name+"</td><td>"+res[i].year+"</td></tr>";
//         }
        
//         con.release();
//         return cb(table);
//         }
//       );
//     }
//   });
// }

var sql ="SELECT distinct s.subname,l.name,s.year FROM subject s, lecturer l where s.lecID=l.lecID";

// //create the server for browser access
// var server=http.createServer((req,res)=>{
//   setHTML(sql,resql=>{
//     reo=reo.replace("{${table}}",resql);
//     res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
//     res.write(reo,"utf-8");
//     res.end();
//   });
// });

// server.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Server is running ...");
// });

pool.query(sql, (err, res, cols)=>{
   if(err) throw err;
    console.log(res);
 });
//   for(var i=1;i<res.length;i++)
//   {
//       console.log(res[i].subname+ " "+res[i].name+" "+res[i].year);
//   }
// });