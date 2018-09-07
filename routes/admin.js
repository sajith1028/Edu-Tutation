var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');
var nodemailer      = require('nodemailer'); //for mailing purposes
var randomstring    = require("randomstring"); //to generate random strings as passwords
var bcrypt          =   require("bcrypt");

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
    pool.query(sql, (err, res2, cols)=>{
        if(err)
            throw err;
        nos=parseInt(res2[0].numberOfStudents, 10)+1;
        
        if(nos<10)
            stID = stID+ALyear+"-00"+nos;
        else if(nos<100)
            stID = stID+ALyear+"-0"+nos;
        else if(nos<1000)
            stID = stID+ALyear+"-"+nos;
            
            
        var subjects=req.body.subject;
        
       
        var sql="INSERT INTO student (stID,name,email,ALyear) values ("+SqlString.escape(stID)+","+SqlString.escape(name)+","+SqlString.escape(email)+","+SqlString.escape(ALyear)+");";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        
     
        if(Array.isArray(subjects)){
            subjects.forEach(function(subject){    
                var sql2="INSERT INTO enrolment values("+SqlString.escape(subject)+","+SqlString.escape(stID)+");";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                });
            });
        }
        else
        {
            var sql3="INSERT INTO enrolment values("+SqlString.escape(subjects)+","+SqlString.escape(stID)+");";
        }
        
        var randomPassword=randomstring.generate(10); //encrypt the password using bcrypt
        bcrypt.hash(randomPassword, 10, function(err, hash) { //hash contains the encrypted password 
           var users={
            "username":stID,
            "password":hash }
                 
                //insert  details into the db
            con.query("INSERT INTO user SET ?",users,function (error, results, fields){
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
                            console.log('Email sent: ' + info.response);
                        }
                   });
                }
           });
        });
    });
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

router.post("/payments/id",function(req, res) {
//   var sql1="SELECT name from student where stID='"+req.body.stID.stID+"'";

//   pool.query(sql1, (err, res2, cols)=>{
//         if(err) throw err;
//             res.render("../views/admin/ajaxPaymentStudentName",{name:res2});
//             res.end();
//   });
    
   studentID=req.body.stID.stID;

   var sql="SELECT s.subID,s.subname,p.month,s.fee from subject s,payment p where p.stID='"+req.body.stID.stID+"' && p.subID=s.subID group by s.subID order by date desc" ;
  
   pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxPaymentTableTemplate",{payments:res2});
            res.end();
    });
});

router.post("/payments/new",function(req, res) {
   
   var subjects=req.body.subject;
    if(Array.isArray(subjects)){
   subjects.forEach(function(sub){
       var subsplit=sub.split(',');
       var subject =subsplit[0];
       var month=subsplit[1];
       var fee=subsplit[2];
       
       var nos;
    var paymentID="P";
    
    var sql="select count(pID) as numberOfPayments from payment;";   
    pool.query(sql, (err, res2, cols)=>{
        if(err)
            throw err;
        nos=parseInt(res2[0].numberOfPayments, 10)+1;
        
        if(nos<10)
            paymentID = paymentID+"00"+nos;
        else if(nos<100)
            paymentID = paymentID+"0"+nos;
        else if(nos<1000)
            paymentID = paymentID+""+nos;
         
       var sql2="SELECT curdate() as current;";
       
       pool.query(sql2, (err, res2, cols)=>{
        if(err)
            throw err;
            var curDate=res2[0].current;
            var months=['January','February','March','April','May','June','July','September','October','November','December'];
            
            var newIndex=months.indexOf(month)+1;
            if(newIndex>11) newIndex=0;
            
            var newMonth=months[newIndex];
            
            var sql3="INSERT INTO payment values('"+paymentID+"','2018-08-22','"+newMonth+"',"+fee+",'"+studentID+"','"+subject+"');";
            console.log(sql3);
            pool.query(sql3, (err, res3, cols)=>{
                if(err)
                throw err;
                res.redirect("/admin/payments");
      });
       });
   });
   });   
    }
    

});


router.get("/register/lecturer", function(req,res){
    res.render("admin/adminRegisterLecturer");
    
});
    

router.post("/register/alyear", function(req,res){
    var sql ="SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='"+req.body.alyears.year+"'";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxRegisterTableTemplate",{subjects:res2});
            res.end();
    });
});
/*****************************************************/

router.get("/attendance", function(req,res){
    res.render("admin/adminAttendance");
});

router.get("/newsfeeds", function(req,res){
    res.render("admin/adminNews");
});

module.exports = router;