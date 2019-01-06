var express         =   require("express");
var router          =   express.Router();
var passport        =   require('passport');
var mysql           =   require("mysql");
var flash           =   require("connect-flash");
var SqlString       =   require('sqlstring');
var bcrypt          =   require("bcrypt");

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

router.post("/login", passport.authenticate("local-login", 
    {
failureRedirect: "/login"
    }), function(req, res){
        req.flash("success","You logged in!");
        if(req.user.username.charAt(0)=='A')
        res.redirect("/admin");
        else if(req.user.username.substring(0,2)=="SA")
        res.redirect("/superadmin");
        else if(req.user.username.charAt(0)=='S')
        res.redirect("/student");
        else if(req.user.username.charAt(0)=='L')
        res.redirect("/lecturer");
        
        
        
});

router.get("/login",function(req,res)
{
    res.render("login");
});

router.get("/", function(req,res){
    
    var sql="SELECT s.*, l.* from subject s, lecturer l where s.lecID=l.lecID order by l.name;";
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("landing",{'classes':res2});
            res.end();
    });
});

router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
   
   
       bcrypt.hash(password, 10, function(err, hash) { //hash contains the encrypted password 
       var users={
        "username":req.body.username,
        "password":hash }
             
            //insert  details into the db
        con.query("INSERT INTO user SET ?",users,function (error, results, fields){
            if(error){
                res.json({
                    status:false,
                    message: "there is some error with the query"
                })
            }
            else {
                res.json({
                    status:true,
                    data:results,
                    message:"user registered successfully"
                })
            }
       });
       
    });
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash("success","You logged out!");
    res.redirect("/");
});

module.exports = router;