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
    res.render("student/studentProfile");
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