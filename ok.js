var mysql = require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  user: "nimesha",
  password: "",
  database: "akura",
  charset: "utf8"
});

var sql ="SELECT distinct s.subname,l.name,s.year FROM subject s, lecturer l where s.lecID=l.lecID";

pool.query(sql, (err, res, cols)=>{
  if(err) throw err;
  for(var i=1;i<res.length;i++)
  {
      console.log(res[i].subname+ " "+res[i].name+" "+res[i].year);
  }
});