var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var pool = mysql.createPool({
  host: "localhost",
  user: "nimesha",
  password: "",
  database: "akura",
  charset: "utf8"
});

function isLoggedIn(req, res, next){
if(req.isAuthenticated() && req.user.username.charAt(0)=='S' ){
        return next();
    }
res.redirect("/login");
}

router.get("/",function(req, res) {
    res.render("student/studentHome");
});


router.get("/profile", function(req,res){
    
    //get student details & pass it to the ejs file to be displayed
    if(req.user){
    var sql="select s.name,s.school,s.teleres,s.telemob,s.email,s.gender,s.address,s.ALyear from student s where s.stID='"+req.user.username+"'";
    pool.query(sql,(err,res2,cols)=>{
       if (err) throw err;
       res.render("student/studentProfile",{details:res2});
       res.end();
    });
    
    
    }
    
    
    
    
});

router.post("/profile",function(req,res){
    if(req.body.gender)
    console.log("yes");
//   name: 'Tharushi Jayasekara',
//      school: 'Musaeus College',
//      gender: '',
//      teleres: '',
//      telemob: '',
//      email: '',
//      address: '',
//      curpwd: '',
//      newpwd: ''
});



router.get("/payments", function(req,res){
    //If logged in
    if(req.user){
    var stID=req.user.username;
    
    //var sql="select s.subname, p.date, p.month, p.amount from payment p, subject s where s.subID=p.subID group by s.subname order by date desc ";
    var sql="select s.subname, p.date, p.month, p.amount from payment p, subject s where s.subID=p.subID order by date desc ";
    
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("student/studentPayment",{payments:res2});
            res.end();
    });
    }
});

router.get("/content", function(req,res){ 
    res.render("student/studentContent");
});

router.get("/newsfeeds", function(req,res){
    res.render("student/studentNewsfeed");
});


module.exports = router;

/* code to upload images

HTML
    <form ref='uploadForm' id='uploadForm' action='/abc' method='post' encType="multipart/form-data">
        <input type="file" name="sampleFile" />
        <input type='submit' value='Upload!' />
    </form>  

In POST request
    if (!req.files)
        return console.log("upload a file");
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
 
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('public/images/users/'+sampleFile.name, function(err) {
        if (err)
            return console.log("error");
     
        return console.log("done");
    });

************************/