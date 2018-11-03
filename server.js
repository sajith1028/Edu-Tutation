var session         =   require('express-session');
var express         =   require("express");
var app             =   express();
var BodyParser      =   require('body-parser');
var CookieParser    =   require('cookie-parser');
//var {userResponse, validateUser, secret} = require('./config');
var passport = require('passport');
var passportConfig = require('./config/passport');
var flash           =   require("connect-flash");

app.use(BodyParser.json());
app.use(CookieParser());
app.use(BodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static('public')); //for css files
app.use(flash());
passportConfig(passport);

app.use(require("express-session")({
    secret:"some strong secret which is lengthy",
    resave:false,
    saveUninitialized:false
})); 

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});

app.post('/signup', passport.authenticate('local-signup'));

app.post("/login", passport.authenticate("local-login", 
    {
successRedirect: "/landing",
failureRedirect: "/login"
    }), function(req, res){
});

app.get("/landing",function(req, res) {
    res.render("landing");
})

app.get("/login",function(req,res)
{
    res.render("login");
})

app.get('/logout', (req, res)=>{
req.logout();
return res.json({status:'success'});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log(" server has started ...");
}); 