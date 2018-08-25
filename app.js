var express         =   require("express");
var app             =   express(),
    bodyParser  = require("body-parser");
var mysql           =   require("mysql"),
    User            =   require("./models/user");
var flash           =   require("connect-flash");
var Cryptr          =   require("cryptr"),
    cryptr          =   new Cryptr("nimma is a sonta");
var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

//ok
con.connect(function(err){
    if(err) 
        throw err;
    console.log("Connected to mysql!");
});

//handles exports of login & registration routes
//var authenticateController=require('./controllers/authenticate-controller');
//var registerController=require('./controllers/register-controller');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set("view engine","ejs");
app.use(express.static('public')); //for css files
app.use(flash());

app.use(require("express-session")({
    secret:"Nimetha is a sudu baba",
    resave:false,
    saveUninitialized:false
}));


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/landing", function(req,res){
    res.render("landing");
});


app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register",function(req,res){
    //encrypt the password using cryptr
   var encryptedString = cryptr.encrypt(req.body.password);
   var users={
        "username":req.body.username,
        "password":encryptedString
             }
    //insert  details into the db
   con.query("INSERT INTO users SET ?",users,function (error, results, fields){
       if(error){
           res.json({
               status:false,
               message: "there is some error with the query"
           })
       } else {
           res.json({
               status:true,
               data:results,
               message:"user registered successfully"
           })
       }
   });

});

app.post("/login",function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  
  con.query("SELECT * FROM users where username=?",[username],function (error, results, fields){
      if(error){
          res.json({
              status:false,
              message:"there is some error with the query"
          })
      }else{
          if(results.length>0){
              var decryptedString = cryptr.decrypt(results[0].password);
              if(password==decryptedString)
              {
                 res.render("profile");
              } else {
                  res.json({
                      status:false,
                      message:"Email & password do not match"
                  });
              }
          }
          else{
              res.json({
                  status:false,
                  message:"Email does not exist"
              });
          }
      }
  });
  
  
  
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/profile", function(req,res){
    res.render("profile");
});

app.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","You logged out!");
   res.redirect("/landing");
});

app.get("/home",function(req, res) {
    res.render("home");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Akura server has started ...");
});