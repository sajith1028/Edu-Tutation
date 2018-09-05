var express         =   require("express");
var router          =   express.Router();
var passport        =   require('passport');
var mysql           =   require("mysql");
var flash           =   require("connect-flash");
var SqlString       =   require('sqlstring');
var bcrypt          =   require("bcrypt");
var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

router.post("/login", passport.authenticate("local-login", 
    {
successRedirect: "/landing",
failureRedirect: "/login"
    }), function(req, res){
        
});

router.get("/login",function(req,res)
{
    res.render("login");
});

router.get("/landing",function(req, res) {
    res.render("landing");
});

router.get("/", function(req,res){
    res.render("landing");
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
        con.query("INSERT INTO adminUser SET ?",users,function (error, results, fields){
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
    res.redirect("/landing");
});

module.exports = router;