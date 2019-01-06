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
    res.render("superadmin/superAdminHome");
});

router.get("/income", function(req,res){
    res.render("superadmin/superAdminIncome");
});

router.get("/results", function(req,res){
    
    var sql="SELECT lecID,name FROM lecturer";
    pool.query(sql,(err,res1,cols)=>{
        if(err) throw err;
        
        var sql1="SELECT subID,subname,year,lecID FROM subject";
        pool.query(sql1,(err,res2,cols)=>{
            if(err) throw err;
            
            // var sql2="SELECT * FROM enrolment";
            // pool.query(sql2,(err,res3,cols)=>{
            //     if(err) throw err;
                
            // })
            res.render("superadmin/superAdminResults",{lecturers:res1,subjects:res2});
            
        })
    })
    
    
    
    
    
    
});

router.get("/attendance", function(req,res){
    res.render("superadmin/superAdminAttendance");
});



module.exports = router;