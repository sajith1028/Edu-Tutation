var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var moment          =   require('moment'); //To parse, validate, manipulate, and display dates and times

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
    var sql="SELECT count(stID) as numOfStudents from student;";
    
    var sql2="SELECT count(lecID) as numOfLecturers from lecturer";
    
    var sql3="select *,sum(amount) as amount from payment where YEAR(date) = YEAR(CURDATE()) group by subID,month";
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
        
        pool.query(sql2,(err,res3,cols)=>{
            if(err) throw err;
                
            pool.query(sql3,(err,res4,cols)=>{
                if(err) throw err;
                
                res.render("superadmin/superAdminHome",{nos:res2,nol:res3,incomes:res4});
            });
        });
    });
});

router.get("/income", function(req,res){
    var sql="select p.year,s.subname,s.year as ALyear,p.subID,p.month,sum(amount) as totalfee from payment p,subject s where s.subID=p.subID group by subID,month order by year;"
    pool.query(sql, (err, res2, cols)=>{
        if(err) 
            throw err;
         res.render("superadmin/superAdminIncome",{incomes:res2});
        res.end();
    });
});


router.get("/results", function(req,res){
    
    var sql="SELECT lecID,name FROM lecturer";
    pool.query(sql,(err,res1,cols)=>{
        if(err) throw err;
        
        var sql1="SELECT subID,subname,year,lecID FROM subject";
        pool.query(sql1,(err,res2,cols)=>{
            if(err) throw err;
            
            var sql2="SELECT * FROM enrolment";
            pool.query(sql2,(err,res3,cols)=>{
                if(err) throw err;
                
                var sql3="SELECT stID, name FROM student";
                pool.query(sql3,(err,res4,cols)=>{
                    if(err) throw err;
                    
                    res.render("superadmin/superAdminResults",{lecturers:res1,subjects:res2,averages:res3,students:res4});
                })
                
            })
            
            
        })
    })
});
module.exports = router;