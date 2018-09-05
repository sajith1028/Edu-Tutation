var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');

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
    // var sql ="SELECT distinct s.subname,l.name,s.year FROM subject s, lecturer l where s.lecID=l.lecID";

    // pool.query(sql, (err, res2, cols)=>{
    //     if(err) throw err;
    // });
    res.render("admin/adminRegisterStudent");
});

router.post("/register/student/new",function(req, res) {
    console.log(req.body);
    var name=req.body.firstname+" "+req.body.lastname;
    var email=req.body.email;
    var ALyear=req.body.ALYear;
   
    var stID="s006"; //HARD CODED STID
    var subjects=req.body.subject;
   
    var sql="INSERT INTO student (stID,name,email,ALyear) values ("+SqlString.escape(stID)+","+SqlString.escape(name)+","+SqlString.escape(email)+","+SqlString.escape(ALyear)+");";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted into student");
    });
    console.log(sql);
 
    if(Array.isArray(subjects)){
        subjects.forEach(function(subject){    
            var sql2="INSERT INTO enrolment values("+SqlString.escape(subject)+","+SqlString.escape(stID)+");";
            con.query(sql2, function (err, result) {
                if (err) throw err;
                console.log("Inserted into enrolment");
            });
            console.log(sql2);
        });
    }
    else
    {
        var sql3="INSERT INTO enrolment values("+SqlString.escape(subjects)+","+SqlString.escape(stID)+");";
        console.log(sql3);
    }
    
    var randomPassword=randomstring.generate(10); //encrypt the password using bcrypt
    bcrypt.hash(randomPassword, 10, function(err, hash) { //hash contains the encrypted password 
       var users={
        "username":req.body.email,
        "password":hash }
             
            //insert  details into the db
        con.query("INSERT INTO users SET ?",users,function (error, results, fields){
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
                    html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the password given below at the initial login</p> <p>Password : <strong>'+ randomPassword +'</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
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

router.post("/register/alyear", function(req,res){
    var sql ="SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='"+req.body.alyears.year+"'";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxRegisterTableTemplate",{subjects:res2});
            res.end();
    });
});
/*****************************************************/

/*****************************************************/
router.get("/register/lecturer", function(req,res){
    res.render("admin/adminRegisterLecturer");});
    /*
    var sql ="SELECT distinct s.subname,l.name,s.year FROM subject s, lecturer l where s.lecID=l.lecID";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
    });    
});

router.post("/register/lecturer/new",function(req, res) {
    console.log(req.body);
    var name=req.body.firstname+" "+req.body.lastname;
    var email=req.body.email;
    var ALyear=req.body.ALYear;
   
    var stID="s006"; //HARD CODED STID
    var subjects=req.body.subject;
   
    var sql="INSERT INTO student (stID,name,email,ALyear) values ("+SqlString.escape(stID)+","+SqlString.escape(name)+","+SqlString.escape(email)+","+SqlString.escape(ALyear)+");";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted into student");
    });
    console.log(sql);
 
    if(Array.isArray(subjects)){
        subjects.forEach(function(subject){    
            var sql2="INSERT INTO enrolment values("+SqlString.escape(subject)+","+SqlString.escape(stID)+");";
            con.query(sql2, function (err, result) {
                if (err) throw err;
                console.log("Inserted into enrolment");
            });
            console.log(sql2);
        });
    }
    else
    {
        var sql3="INSERT INTO enrolment values("+SqlString.escape(subjects)+","+SqlString.escape(stID)+");";
        console.log(sql3);
    }
    
    var randomPassword=randomstring.generate(10); //encrypt the password using bcrypt
    bcrypt.hash(randomPassword, 10, function(err, hash) { //hash contains the encrypted password 
       var users={
        "username":req.body.email,
        "password":hash }
             
            //insert  details into the db
        con.query("INSERT INTO users SET ?",users,function (error, results, fields){
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
                    html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the password given below at the initial login</p> <p>Password : <strong>'+ randomPassword +'</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
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

router.post("/register/alyear", function(req,res){
    var sql ="SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='"+req.body.alyears.year+"'";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("../views/admin/ajaxRegisterTableTemplate",{subjects:res2});
            res.end();
    });
});*/
/*****************************************************/

router.get("/payments", function(req,res){
    
    var sql ="SELECT s.subname,p.month,s.fee from subject s,payment p where p.stID='s001' && p.subID=s.subID group by s.subID order by date desc";

    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("admin/adminPayment",{payments:res2});
    });
});

router.get("/attendance", function(req,res){
    res.render("admin/adminAttendance");
});

router.get("/newsfeeds", function(req,res){
    res.render("admin/adminNewsfeed");
});

module.exports = router;