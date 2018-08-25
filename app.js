var express         =   require("express");
var app             =   express(),
    bodyParser  = require("body-parser");
var mysql           =   require("mysql"),
    User            =   require("./models/user");
var flash           =   require("connect-flash");

var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

con.connect(function(err){
    if(err) 
        throw err;
    console.log("Connected to mysql!");
});

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
   
});

app.post("/login",function(req,res){
    
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