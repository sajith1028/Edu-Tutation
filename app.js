var express         =   require("express");
var app             =   express(), bodyParser  = require("body-parser");

var flash           =   require("connect-flash");
var CookieParser    =   require('cookie-parser');
var passport        =   require('passport');
var passportConfig  =   require('./config/passport');
var fileUpload      =   require('express-fileupload'); //for images

require('dotenv').config();

app.use(CookieParser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(fileUpload());

app.use(require("express-session")({
    secret:"ahg dgdwud gyudg",
    resave:false,
    saveUninitialized:false
})); 

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs");
app.use(express.static('public')); //for css files
app.use(flash());
passportConfig(passport);

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});

var indexRoutes = require("./routes/index");
app.use("/",indexRoutes);

var studentRoutes    = require("./routes/student");
app.use("/student", studentRoutes);

// var parentRoutes    = require("./routes/parent");
// app.use("/parent", parentRoutes);

var lecturerRoutes    = require("./routes/lecturer");
app.use("/lecturer", lecturerRoutes);

var adminRoutes    = require("./routes/admin");
app.use("/admin", adminRoutes);

var superAdminRoutes    = require("./routes/superadmin");
app.use("/superAdmin", superAdminRoutes);


process.env.PORT = 8000;
process.env.IP = "127.0.0.1";

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Akura server has started at ...");
    console.log(process.env.IP+":"+process.env.PORT);
}); 