var express         =   require("express");
var app             =   express(),
    bodyParser  = require("body-parser");
var mysql           =   require("mysql"),
    User            =   require("./models/user");
var flash           =   require("connect-flash");
var bcrypt          =   require("bcrypt");

var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});




var nodemailer = require('nodemailer'); //for mailing purposes
var randomstring = require("randomstring"); //to generate random strings as passwords

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
    
    var randomPassword=randomstring.generate(10);
    //encrypt the password using bcrypt
   bcrypt.hash(randomPassword, 10, function(err, hash) {
      //hash contains the encrypted password 
       var users={
        "username":req.body.username,
        "password":hash }
             
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
           
           var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
              user: 'studentenrolmentnsbm@gmail.com',
                pass: 'studentenrolmentnsbm123'
           }
           });
        
           var mailOptions = {
             from: 'studentenrolmentnsbm@gmail.com',
             to: 'nimesha1996@gmail.com',
             subject: 'Login Credentails',
             html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the password given below at the initial login</p> <p>Password : <strong>'+ randomPassword +'</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
           };

           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
               console.log('Email sent: ' + info.response);
             }
           });
        }
   });
});

});



var loginRoutes = require("./routes/login");
app.use("/login", loginRoutes);

var studentRoutes    = require("./routes/student");
app.use("/student", studentRoutes);

var lecturerRoutes    = require("./routes/lecturer");
app.use("/lecturer", lecturerRoutes);

var adminRoutes    = require("./routes/admin");
app.use("/admin", adminRoutes);

var superAdminRoutes    = require("./routes/superadmin");
app.use("/superAdmin", superAdminRoutes);

app.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","You logged out!");
   res.redirect("/landing");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Akura server has started ...");
}); 