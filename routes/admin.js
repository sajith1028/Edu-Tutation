//Requiring the npm packages
var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');
var nodemailer      = require('nodemailer'); //for mailing purposes
var randomstring    = require("randomstring"); //to generate random strings as passwords
var bcrypt          =   require("bcrypt"); // for encryption
var dateTime    = require('get-date'); //returns current date
var flash           =   require("connect-flash");
var Swal            =   require('sweetalert2')


//for document generating
var https   = require("https");
var fs      = require("fs");

//If the user is an Admin, redirect to the Admin home. Otherwise redirect to the login
function isLoggedIn(req, res, next){
    if (req.isAuthenticated() && req.user.username.charAt(0)=='A'){
        return next();
    }
    res.redirect("/login");
}

//creates the mysql connection to the database
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

router.get("/",function(req, res) {
    res.render("admin/adminHome");
});

/*****************************************************/
router.get("/register/student", function(req,res){
    res.render("admin/adminRegisterStudent");
});

router.post("/register/student/new",function(req, res) {
    var name=req.body.firstname+" "+req.body.lastname;
    var email=req.body.email;
    var ALyear=req.body.ALYear;
    
    var nos;
    var stID="S-";
    
    var sql="select count(stID) as numberOfStudents from student where ALyear="+ALyear+";";  
    console.log(sql);
    pool.query(sql, (err, res2, cols)=>{
        if(err)
            throw err;
        nos=parseInt(res2[0].numberOfStudents, 10)+1;
        //console.log(nos);
        
        if(nos<10)
            stID = stID+ALyear+"-00"+nos;
        else if(nos<100)
            stID = stID+ALyear+"-0"+nos;
        else if(nos<1000)
            stID = stID+ALyear+"-"+nos;
            
            
        var subjects=req.body.subject;
        
       
        var sql2="INSERT INTO student (stID,name,email,ALyear) values ("+SqlString.escape(stID)+","+SqlString.escape(name)+","+SqlString.escape(email)+","+SqlString.escape(ALyear)+");";
        //console.log(sql2);
        con.query(sql2, function (err, result) {
            if (err) throw err;
        });
        
     
        if(Array.isArray(subjects)){
            subjects.forEach(function(subject){    
                var sql3="INSERT INTO enrolment (subID, stID) values("+SqlString.escape(subject)+","+SqlString.escape(stID)+");";
                console.log(sql3);
                con.query(sql3, function (err, result) {
                    if (err) throw err;
                });
                
                var datetime = new Date();
                var curDate = datetime.toJSON();
            
                var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
                var d = new Date();
                var curMonth = months[d.getMonth()];        
        
                var sql5="INSERT INTO payment (date,month,amount,stID,subID,year) values('"+curDate+"','"+curMonth+"','1000',"+SqlString.escape(stID)+","+SqlString.escape(subject)+",'2018');";
                
                con.query(sql5, function (err, result) {
                    if (err) throw err;
                });
                
                
                
                
                
            });
        }
        else
        {
            var sql4="INSERT INTO enrolment (subID, stID) values("+SqlString.escape(subjects)+","+SqlString.escape(stID)+");";
        }
        
        var randomPassword=randomstring.generate(10); //encrypt the password using bcrypt
        bcrypt.hash(randomPassword, 10, function(err, hash) { //hash contains the encrypted password 
          var users={
            "username":stID,
            "password":hash }
                 
            //insert  details into the db
            con.query("INSERT INTO user SET ?",users,function (error, results, fields){
                if(error){
                    req.flash("error","Please try again!");
                }
                else {
                   
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'studentenrolmentnsbm@gmail.com',
                            pass: 'studentenrolmentnsbm123'
                        }
                    });
                
                    var mailOptions = {
                        from: 'studentenrolmentnsbm@gmail.com',
                        to: email,
                        subject: 'Login Credentails',
                        html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the given credentials to login to Akura</p> <p>Username : <strong>'+ stID +'</strong></p> <p>Password : <strong>'+ randomPassword +'</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
                    };
        
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        }
                        else {
                            req.flash("success","Student registration successful!");
                        }
            
                    });
                }
          });
        });
        
    });
    req.flash("success","Student registration successful!");
    res.redirect("/admin/register/student");
});

router.post("/register/alyear", function(req,res){
    var sql ="SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='"+req.body.alyears.year+"'";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxRegisterTableTemplate",{subjects:res2});
            res.end();
    });
});

router.get("/payments", function(req,res){
    res.render("admin/adminPayment");
});

var studentID;

router.post("/payments/name",function(req, res) {
   studentID=req.body.stID.stID;

   var sql1="SELECT name from student where stID='"+req.body.stID.stID+"'";
  
   pool.query(sql1, (err, res2, cols)=>{
        if(err) throw err;
        var name=res2[0].name;
        res.render("admin/ajaxUpdateName", {name:res2[0].name});
        res.end();
    });
});

router.post("/payments/id",function(req, res) {

   studentID=req.body.stID.stID;

   var sql="SELECT name,subID, subname, month, fee FROM (SELECT st.name, s.subID,s.subname,p.month,s.fee from subject s,payment p, student st where p.stID='"+studentID+"' && p.subID=s.subID && st.stID='"+studentID+"' order by date desc) as t2 group by subname;"
   pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxPaymentTableTemplate",{payments:res2});
            res.end();
    });
});


var items;
var to;
router.post("/payments/new",function(req, res) {
    items = [];
   var subjects=req.body.subject;
    if(Array.isArray(subjects)){
        
        subjects.forEach(function(sub){
            var subsplit=sub.split(',');
            console.log(subsplit);
            var subject =subsplit[0];
            var month=subsplit[1];
            var fee=subsplit[2];
            var curDate=""+dateTime();
            curDate=curDate.split('/').join('-');
            console.log(curDate);
            var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
                
            var newIndex=months.indexOf(month)+1;
            console.log("newIndex"+newIndex);
            if(newIndex>11) 
                newIndex=0;
            
            var newMonth=months[newIndex];
            
            //console.log("Last month:"+month);
            //console.log("newIndex"+newIndex);
            //console.log("NewMonth"+newMonth);
            var datetime = new Date();
            var newDate = datetime.toJSON();
            var sql3="INSERT INTO payment(date,month,amount,stID,subID,year) values('"+newDate+"','"+newMonth+"',"+fee+",'"+studentID+"','"+subject+"','2018');";
            console.log(sql3);
            pool.query(sql3, (err, res3, cols)=>{
                if(err)
                throw err; 
            });
            
            /*for the invoice */
            items.push({
                name: subject,
                unit_cost: fee,
                quantity: 1
            })
            
            to=studentID;
        });
    }
    
    
    var invoice = {
        logo: "https://i.imgur.com/qpEKVBl.png",
        from: "Invoiced\n59/4  Ananda Mawatha,\nColombo 10, Sri Lanka",
        to: to,
        currency: "lkr",
        number: "INV-0001",
        payment_terms: "Class Fees",
        items: items,
        fields: {
            tax: "%"
        },
        
        tax: 0,
        item_header: "Subject",
        unit_cost_header: "Rate",
        quantity_header: "# of months",
        
        notes: "Thanks for being a part of Akura!",
    };
    
    generateInvoice(invoice, 'invoice.pdf', function(){console.log("Saved invoice to invoice.pdf");}, function(error){console.error(error);});
    
    //move file1.htm from 'test/' to 'test/dir_1/'
    moveFile('invoice.pdf', 'public');
    
    req.flash("success","Payment added! Click here to print an invoice.");
    res.redirect("/admin/payments");

});
    
router.get("/register/lecturer", function(req,res){
    res.render("admin/adminRegisterLecturer");
});
    
router.post("/register/lecturer/new", function(req,res){
    var name=req.body.firstname+" "+req.body.lastname;
    var email=req.body.email;
    var nic=req.body.nic;
    
    var nos;
    var lecID="L-AKURA-";
    
    var sql="select count(lecID) as numberOfLecturers from lecturer;";   
    pool.query(sql, (err, res2, cols)=>{
        if(err)
            throw err;
        nos=parseInt(res2[0].numberOfLecturers, 10)+1;
        
        if(nos<10)
            lecID = lecID+"00"+nos;
        else if(nos<100)
            lecID = lecID+"0"+nos;
        else if(nos<1000)
            lecID = lecID+""+nos;
            
            
        var subjects=req.body.subject;
        
       
        var sql="INSERT INTO lecturer (lecID,NIC,name,email) values ("+SqlString.escape(lecID)+","+SqlString.escape(nic)+","+SqlString.escape(name)+","+SqlString.escape(email)+");";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        
        var randomPassword=randomstring.generate(10); //encrypt the password using bcrypt
        bcrypt.hash(randomPassword, 10, function(err, hash) { //hash contains the encrypted password 
            var users={
                "username":lecID,
                "password":hash 
               
            }
                 
            //insert  details into the db
            con.query("INSERT INTO user SET ?",users,function (error, results, fields){
                if(error){
                    req.flash("error","Please try again!");
                }
                else {
                    
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'studentenrolmentnsbm@gmail.com',
                            pass: 'studentenrolmentnsbm123'
                        }
                    });
                
                    var mailOptions = {
                        from: 'studentenrolmentnsbm@gmail.com',
                        to: email,
                        subject: 'Login Credentails',
                        html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the given credentials to login to Akura</p> <p>Username : <strong>'+ lecID +'</strong></p> <p>Password : <strong>'+ randomPassword +'</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
                    };
        
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            req.flash("error","Error occured. Please try again!");
                        }
                        else {
                            req.flash("success","Lecturer added!");
                        }
                  });
                  
                }
          });
        });
    });
    res.redirect("/admin/register/lecturer");
});
    

router.post("/register/alyear", function(req,res){
    var sql ="SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='"+req.body.alyears.year+"'";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxRegisterTableTemplate",{subjects:res2});
            res.end();
    });
});

router.get("/attendance", function(req,res){
    res.render("admin/adminAttendance");
});

router.get("/newsfeeds", function(req,res){
    res.render("admin/adminNews");
});

function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname  : "invoice-generator.com",
        port      : 443,
        path      : "/",
        method    : "POST",
        headers   : {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    var file = fs.createWriteStream(filename);

    var req = https.request(options, function(res) {
        res.on('data', function(chunk) {
            file.write(chunk);
        })
        .on('end', function() {
            file.end();

            if (typeof success === 'function') {
                success();
            }
        });
    });
    
    req.write(postData);
    req.end();
    
    if (typeof error === 'function') {
        req.on('error', error);
    }
}

//moves the $file to $dir2
var moveFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');
  });
};


module.exports = router;