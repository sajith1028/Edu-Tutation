var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");

function isLoggedIn(req, res, next){
if(req.isAuthenticated() && req.user.username.charAt(0)=='L' ){
        return next();
    }
res.redirect("/login");
}

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
    var sql="SELECT s.*, l.* from subject s, lecturer l where s.lecID=l.lecID and l.lecID='L-AKURA-001';";
    pool.query(sql, (err, res2, cols)=>{
        if(err) 
            throw err;
        res.render("lecturer/lecturerHome", {'myself':res2});
        res.end();
    });
});

router.get("/profile", function(req,res){
    res.render("lecturer/lecturerProfile");
}); 

router.get("/income", function(req,res){
    res.render("lecturer/lecturerIncome");
});

router.get("/addAssignmentResults/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT e.*, s.* from enrolment e, student s where subID='"+id+"'and s.stID=e.stID order by section;";
    pool.query(sql, (err, res2, cols)=>{
        if(err) 
            throw err;
        res.render("lecturer/lecturerAddResults", {'enrolment': res2});
        res.end();
    });
});

router.get("/addCourseContent/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT * from content where subID='"+id+"';";
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         
        res2.id = {"id": id};
        res.render("lecturer/lecturerCourseContent", {'content': res2});
    });
});

router.post("/addNewCourseContent/:id", function(req,res){
    var id = req.params.id;
    if (!req.files)
        return console.log("upload a file");
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let courseFile = req.files.courseFile;
 
    // Use the mv() method to place the file somewhere on your server
    courseFile.mv('public/CourseContent/'+courseFile.name, function(err) {
        if (err)
            return console.log("error");
     
        return console.log("done");
    });
    
    res.render("lecturer/lecturerCourseContent", {'id': id});
});

router.get("/viewResults/:id", function(req,res){
    var id = req.params.id;
    res.render("lecturer/lecturerViewResults");
});

router.get("/newsfeeds", function(req,res){
    res.render("lecturer/lecturerNewsfeed");
});

module.exports = router;