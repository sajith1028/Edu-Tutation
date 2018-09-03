var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');

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

var sess;
router.get("/",function(req, res) {
    
    res.render("admin/adminHome");
});

/*****************************************************/
router.get("/register", function(req,res){
    
    sess=req.session;
    
    
    var sql ="SELECT distinct s.subname,l.name,s.year FROM subject s, lecturer l where s.lecID=l.lecID";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
        if(sess.username)
            res.render("admin/adminRegister",{subjects:res2,user:sess.username});
    });    
});

router.post("/register/new",function(req, res) {
   console.log(req.body);
   var name=req.body.firstname+" "+req.body.lastname;
   var email=req.body.email;
   var ALyear=req.body.ALYear;
   
 //************************************************
 //HARD CODED STID
 //***********************************************
   
   
   var stID="s006";
   var subjects=req.body.subject;
   
   var sql="INSERT INTO student (stID,name,email,ALyear) values ("+SqlString.escape(stID)+","+SqlString.escape(name)+","+SqlString.escape(email)+","+SqlString.escape(ALyear)+");";
  con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("Inserted into student");
 });
 console.log(sql);
 
    if(Array.isArray(subjects)){
        
    subjects.forEach(function(subject){
        
        var sql2="INSERT INTO enrolment values("+SqlString.escape(subject)+","+SqlString.escape(stID)+");";
        con.query(sql2, function (err, result) {
        if (err) throw err;
        console.log("Inserted into enrolment");
 });
         console.log(sql2);
    });
    }
    else
    {
        var sql3="INSERT INTO enrolment values("+SqlString.escape(subjects)+","+SqlString.escape(stID)+");";
        console.log(sql3);
    }
});

router.post("/register/alyear", function(req,res){
    var sql ="SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='"+req.body.alyears.year+"'";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxRegisterTableTemplate",{subjects:res2});
            res.end();
    });
});
/*****************************************************/


router.get("/payments", function(req,res){
    
    var sql ="SELECT s.subname,p.month,s.fee from subject s,payment p where p.stID='s001' && p.subID=s.subID group by s.subID order by date desc";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("admin/adminPayment",{payments:res2});
    });
});

router.get("/attendance", function(req,res){
    res.render("admin/adminAttendance");
});

router.get("/newsfeeds", function(req,res){
    res.render("admin/adminNewsfeed");
});

module.exports = router;