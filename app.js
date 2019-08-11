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
var moment   = require('moment');
var schedule = require('node-schedule');
var con             =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

var fileUpload      =   require('express-fileupload'); //for images

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

app.listen(process.env.PORT, process.env.IP, function(){
    var backUp = schedule.scheduleJob({hour: 00, minute: 00, dayOfWeek: 0}, function(){
        var exec = require('child_process').exec;
        var name = 'mysql-backup-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.sql'
        var child = exec(' mysqldump -u nimesha akura > ' + name);
        
        //configuring the AWS environment
        AWS.config.update({
            accessKeyId: "",
            secretAccessKey: ""
          });
        
        var s3 = new AWS.S3();
        var filePath = name;
        
        //configuring parameters
        var params = {
          Bucket: 'akura',
          Body : fs.createReadStream(filePath),
          Key :filePath
        };
        
        s3.upload(params, function (err, data) {
          //handle error
          if (err) {
            console.log("Error", err);
          }
        
          //success
          if (data) {
            console.log("Uploaded in:", data.Location);
          }
        });  
    });
    
    //uncomment this to prove its happening
    
    // var exec = require('child_process').exec;
    // var name = 'mysql-backup-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.sql'
    // var child = exec(' mysqldump -u nimesha akura > ' + name);
    
    // //configuring the AWS environment
    // AWS.config.update({
    //     accessKeyId: "",
    //     secretAccessKey: ""
    //   });
    
    // var s3 = new AWS.S3();
    // var filePath = name;
    
    // //configuring parameters
    // var params = {
    //   Bucket: 'akura',
    //   Body : fs.createReadStream(filePath),
    //   Key :filePath
    // };
    
    // s3.upload(params, function (err, data) {
    //   //handle error
    //   if (err) {
    //     console.log("Error", err);
    //   }
    
    //   //success
    //   if (data) {
    //     console.log("Uploaded in:", data.Location);
    //   }
    // });
    
    
    console.log("Akura server has started at ...");
    console.log(process.env.IP+":"+process.env.PORT);
}); 
