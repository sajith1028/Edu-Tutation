var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  user: "nimesha",
  password: "",
  database: "akura",
  charset: "utf8"
});

var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

router.get("/",function(req, res) {
    var sql="SELECT s.*, l.* from subject s, lecturer l where s.lecID=l.lecID and l.lecID='L-AKURA-01';";
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("lecturer/lecturerHome", {'myself':res2});
            res.end();
    });
});

router.get("/profile", function(req,res){
    res.render("lecturer/lecturerProfile");
}); 

router.get("/income", function(req,res){
    res.render("lecturer/lecturerIncome");
});

router.get("/addAssignmentResults/:id", function(req,res){
    var id = req.params.id;
    res.render("lecturer/lecturerAddResults", {'abc': "abc"});
});

router.get("/viewResults/:id", function(req,res){
    var id = req.params.id;
    res.render("lecturer/lecturerViewResults");
});

router.get("/newsfeeds", function(req,res){
    res.render("lecturer/lecturerNewsfeed");
});

module.exports = router;