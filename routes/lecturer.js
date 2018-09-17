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
    var sql="select p.year, count(s.subID) as num,s.subID,s.year as ALyear,s.subname,p.month,s.fee,sum(s.fee) as totalfee from subject s,payment p, lecturer l where l.lecID=s.lecID and s.subID=p.subID and l.lecID='"+req.user.username+"' group by s.subID,p.month order by s.subID;";
    
    pool.query(sql, (err, res2, cols)=>{
        if(err) 
            throw err;
            
        var amts=[0,0,0,0,0,0,0,0,0,0,0,0];
        var amts2=[0,0,0,0,0,0,0,0,0,0,0,0];
        var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
         
        res2.forEach(function(result){
            var monthIndex=months.indexOf(result.month);
            if(amts[monthIndex]==0)
            amts[monthIndex]=result.totalfee;
            else
            amts2[monthIndex]=result.totalfee;
        });    
        console.log(amts);
        console.log(amts2);
         res.render("lecturer/lecturerIncome",{incomes:res2,fees:{amts,amts2}});
        res.end();
    });
    
   
});

router.get("/addAssignmentResults/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT e.*, s.* from enrolment e, student s where subID='"+id+"'and s.stID=e.stID;";
    pool.query(sql, (err, res2, cols)=>{
        if(err) 
            throw err;
        res.render("lecturer/lecturerAddResults", {'enrolment': res2});
        res.end();
    });
});

router.get("/addCourseContent/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT * from content where subID='"+id+"' order by section;";
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         
        res2.id = {"id": id};
        res.render("lecturer/lecturerCourseContent", {'content': res2});
    });
});

router.post("/addNewCourseContent/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT count(contentID) as noc from content where subID='"+id+"';";
    pool.query(sql, (err, res2, cols)=>{
        if(err) 
            throw err;
        
        var noc = res2[0].noc+1;
        
        if (!req.files)
            return console.log("upload a file");
     
        // The name of the input field is used to retrieve the uploaded file
        let courseFile = req.files.courseFile;
        
        // Get the file format
        var format = courseFile.name.substring(courseFile.name.lastIndexOf('.'));
        
        var fileName;
        
        // Increment content id
        if(noc<10)
            fileName = id+"-0"+noc+format;
        else
            fileName = id+"-"+noc+format;
            
        // Use the mv() method to place the file somewhere on your server
        courseFile.mv('public/CourseContent/'+fileName, function(err) {
            if (err)
                return console.log("error");
         
            return console.log("done");
        });
        
        var sql2="INSERT INTO content values ('"+fileName+"','"+req.body.section+"','"+req.body.title+"','"+req.body.desc+"','"+id+"');";
        
        con.query(sql2, function (err, result) {
            if (err) throw err;
        });
    });
    
    res.redirect("/lecturer/addCourseContent/"+id);
    
});

router.get("/viewResults/:id", function(req,res){
    var id = req.params.id;
    res.render("lecturer/lecturerViewResults");
});

router.get("/newsfeeds", function(req,res){
    res.render("lecturer/lecturerNewsfeed");
});

module.exports = router;