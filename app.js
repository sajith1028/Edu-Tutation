var express         =   require("express");
var app             =   express(),
    bodyParser  = require("body-parser");
var mongoose        =   require("mongoose");
var passport        =   require("passport"),
    LocalStrategy   =   require("passport-local"),
    User            =   require("./models/user");
var flash           =   require("connect-flash");

mongoose.connect("mongodb://localhost/akura"); //Connect to the mongoDB
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static('public')); //for css files
app.use(flash());

app.use(require("express-session")({
    secret:"Nimetha is a sudu baba",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
    var newUser=new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err,user)
    {
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/home");
        });
        
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/home",
    failureRedirect:"/login"}), function(req,res){});

app.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","You logged out!");
   res.redirect("/landing");
});

app.get("/home",function(req, res) {
    res.render("home");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Akura server has started ...");
});