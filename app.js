var express         =   require("express");
var app             =   express(),
    bodyParser  = require("body-parser");
var mysql           =   require("mysql");
var flash           =   require("connect-flash");
var bcrypt          =   require("bcrypt");
var session         =   require('express-session');
var CookieParser    =   require('cookie-parser');
var passport        =   require('passport');
var passportConfig  =   require('./config/passport');
var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

var fileUpload      = require('express-fileupload'); //for images

//ok
con.connect(function(err){
    if(err) 
        throw err;
    console.log("Connected to mysql!");
});


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


app.post("/register",function(req,res){
    
    var randomPassword=req.body.password;
    
    //encrypt the password using bcrypt
  bcrypt.hash(randomPassword, 10, function(err, hash) {
      //hash contains the encrypted password 
      var users={
        "username":req.body.username,
        "password":hash }
             
            //insert  details into the db
  con.query("INSERT INTO user SET ?",users,function (error, results, fields){
      if(error){
          throw error;
      } else {
          res.json({
              status:true,
              data:results,
              message:"user registered successfully"
          });
           
        //   var transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   auth: {
        //       user: 'studentenrolmentnsbm@gmail.com',
        //         pass: 'studentenrolmentnsbm123'
        //   }
        //   });
        
        //   var mailOptions = {
        //      from: 'studentenrolmentnsbm@gmail.com',
        //      to: 'nimesha1996@gmail.com',
        //      subject: 'Login Credentails',
        //      html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the password given below at the initial login</p> <p>Password : <strong>'+ randomPassword +'</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
        //   };

        //   transporter.sendMail(mailOptions, function(error, info){
        //      if (error) {
        //       console.log(error);
        //      } else {
        //       console.log('Email sent: ' + info.response);
        //      }
        //   });
        }
  });
});

});

var indexRoutes = require("./routes/index");
app.use("/",indexRoutes);

var studentRoutes    = require("./routes/student");
app.use("/student", studentRoutes);

var lecturerRoutes    = require("./routes/lecturer");
app.use("/lecturer", lecturerRoutes);

var adminRoutes    = require("./routes/admin");
app.use("/admin", adminRoutes);

var superAdminRoutes    = require("./routes/superadmin");
app.use("/superAdmin", superAdminRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Akura server has started ...");
}); 