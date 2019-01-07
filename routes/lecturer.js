var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');
var moment          =   require('moment'); //To parse, validate, manipulate, and display dates and times

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
    var sql="SELECT s.*, l.* from subject s, lecturer l where s.lecID=l.lecID and l.lecID='"+req.user.username+"';";
    
    var sql2="SELECT * from sch_changes order by created desc limit 4";
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
        
        pool.query(sql2,(err,res3,cols)=>{
            if(err) 
                throw err;
           res.render("lecturer/lecturerHome",{'myself':res2,posts:res3,moment:moment});
           res.end();
        });
    });
});

router.get("/profile", function(req,res){
     if(req.user){
    var sql="select l.name,l.tele,l.email,l.qualification from lecturer l where l.lecID='"+req.user.username+"'";

        pool.query(sql,(err,res2,cols)=>{
           if (err) throw err;
           res.render("lecturer/lecturerProfile",{details:res2});
           res.end();
        });
    }
}); 

router.post("/profile",function(req,res){
    var sql="Update lecturer l set l.name="+SqlString.escape(req.body.name)+",l.tele="+SqlString.escape(req.body.telemob)+",l.email="+SqlString.escape(req.body.email)+",l.qualification="+SqlString.escape(req.body.qualif)+" where l.lecID='"+req.user.username+"';";
    pool.query(sql,(err,res2,cols)=>{
        if(err) throw err;
        
    });
    res.redirect("/lecturer/profile");
});

router.get("/income", function(req,res){
    var sql="select p.year, count(s.subID) as num,s.subID,s.year as ALyear,s.subname,p.month,s.fee,sum(s.fee) as totalfee from subject s,payment p, lecturer l where l.lecID=s.lecID and s.subID=p.subID and l.lecID='"+req.user.username+"' group by s.subID,p.month order by s.subID,pID;";
    
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

router.post("/addAssignmentResults/:id", function(req,res){
    var subID = req.params.id;
    
    var index=0;
    req.body.stID.forEach(function(student){
        
        var mark=req.body.marks[index];
        var sql="INSERT INTO assignment VALUES('"+req.body.title+"','"+subID+"','"+student+"','"+mark+"');"
        index++;
        pool.query(sql, (err, res1, cols)=>{
        if(err) throw err;
           
            var sql1="SELECT result FROM assignment WHERE stID='"+student+"' AND subID='"+subID+"'";
            pool.query(sql1,(err,res2,cols)=>{
                if(err) throw err;
                
                var total=0;
                var i=0;
                res2.forEach(function(resMark){
                    total+=resMark.result
                    i++
                    })
                var avg=Math.round(total/i); 
                
                var sql2="UPDATE enrolment SET average='"+avg+"' WHERE stID='"+student+"' AND subID='"+subID+"'";
                pool.query(sql2,(err,res3,cols)=>{
                    if (err) throw err;
                })
            })
        })
    })
    res.redirect("/lecturer/addAssignmentResults/"+subID);
    res.end();
});

router.get("/addCourseContent/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT * from content where subID='"+id+"' order by section;";
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         
        res2.id = {"id": id};
        console.log(res2);
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

router.get("/forums/:id", function(req,res){
    var id = req.params.id;
    
    //select ID of lecturer teaching the subject
    var sql3 = "select s.lecID from subject s where s.subID='"+id+"';";
    pool.query(sql3, (err, res3, cols)=>{
         if(err) throw err;
         var lecID=res3[0].lecID;
         
         //select the course topics
         var sql2="select c.title,c.subID from course_topics c where c.lecID='"+lecID+"' and c.subID='"+id+"';";
         pool.query(sql2, (err, res2, cols)=>{
         if(err) throw err;
         
            //select 
            var sql4="select d.postID,d.title,d.author,d.descr,d.subID,d.sub_sec,d.postedAt,d.authorName from discussion_posts d where d.subID='"+id+"' order by d.sub_sec,d.postedAt desc;"
            pool.query(sql4, (err, res4, cols)=>{
            if(err) throw err;
            var user=req.user.username;
            
                var sql5="select c.postID,c.cID, c.comment, c.subID, c.postedAt, c.author,c.authorName from comments c where c.subID='"+id+"' order by c.postID,c.postedAt;";
                pool.query(sql5, (err, res5, cols)=>{
                if(err) throw err;
                res.render("lecturer/lecturerDiscussion", {'section': res2,'posts':res4,moment:moment,'user':user,'comments':res5});
                });
            });
        });
    });
});

//Delete post by postID
router.post("/forums/delete/:idSub/post/:idPost",function(req, res) {
    var post=req.params.idPost;
    var sub=req.params.idSub;
    //Firstly delete all comments to remove dependencies
    var sql1="DELETE FROM comments where postID="+post+";";
    pool.query(sql1, (err, res1, cols)=>{
         if(err) throw err;
         //Secondly delete all posts
         var sql2="DELETE FROM discussion_posts where postID="+post+";";
         pool.query(sql2, (err, res2, cols)=>{
         if(err) throw err;
         res.redirect("/lecturer/forums/"+sub);  
    });
    });
    
});

//Delete comment by commentID 
router.post("/forums/delete/:idSub/comment/:id",function(req, res) {
    var id=req.params.id;
    var idSub=req.params.idSub;
    var sql="DELETE FROM comments where cID="+id+";";
    console.log(sql);
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         res.redirect("/lecturer/forums/"+idSub);
    });
    
});

router.post("/forums/:id/comment",function(req, res) {
    var subID = req.params.id;
    var username = req.user.username;
    
    //Getting client's time
    var dte = new Date();
    dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    var created = dte.toJSON();
    
    var sql1="select s.name,l.name from student s, lecturer l where s.stID='"+username+"' or l.lecID='"+username+"';";
    pool.query(sql1,(err,res1,cols)=>{
       if (err) throw err;
       
        var sql="insert into comments(comment,postID,postedAt,author,subID,authorName) values('"+req.body.comment+"','"+req.body.postID+"','"+created+"','"+req.user.username+"','"+subID+"','"+res1[0].name+"');";
        pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
        
        res.redirect("lecturer/forums/"+subID);
         
    });
    });
});

router.post("/forums/:id",function(req,res){
    var id = req.params.id;
    var username = req.user.username;
    
    //Getting client's time
    var dte = new Date();
    dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    var created = dte.toJSON();
    
    var sql1="select s.name,l.name from student s, lecturer l where s.stID='"+username+"' or l.lecID='"+username+"';";
    pool.query(sql1,(err,res1,cols)=>{
       if (err) throw err;
       
       var sql="insert into discussion_posts(title,descr,subID,sub_sec,postedAt,author,authorName) values ('"+req.body.title+"','"+req.body.desc+"','"+ id +"','"+req.body.sub_section+"','"+created+"','"+req.user.username+"','"+res1[0].name+"');";
   
        pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
    });
       
    });
    
    
    
    res.redirect("/lecturer/forums/"+id);
});


router.get("/viewResults/:id", function(req,res){
    var id = req.params.id;
    
    var sql="SELECT DISTINCT assID FROM assignment WHERE subID='"+id+"'";
    pool.query(sql,(err,res2,cols)=>{
        if(err) throw err;
        
        var sql2="SELECT * FROM assignment WHERE subID='"+id+"'";
        pool.query(sql2,(err,res3,cols)=>{
            if(err) throw err;
            
            var sql3="SELECT DISTINCT s.stID, s.name FROM student s,assignment a WHERE s.stID=a.stID AND a.subID='"+id+"'";
            pool.query(sql3,(err,res4,cols)=>{
                if(err) throw err;
                
                var sql4="SELECT * FROM enrolment WHERE subID='"+id+"'"
                pool.query(sql4,(err,res5,cols)=>{
                    if(err) throw err;
                    
                    var sql5="SELECT subname, year FROM subject WHERE subID='"+id+"'";
                    pool.query(sql5,(err,res6,cols)=>{
                        if(err) throw err;
                        res.render("lecturer/lecturerViewResults",{aNames:res2,assignments:res3,student:res4,overall:res5,subject:res6});
                    })
                    
                })
            })
            
        })
        
    })
    
});

router.get("/news", function(req,res){
    var sql="SELECT * from sch_changes order by created desc";
    
    var dte = new Date();
    dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    var timeNow = dte.toJSON();
    
    pool.query(sql,(err,res2,cols)=>{
       res.render("lecturer/lecturerNews",{posts:res2,moment:moment,time:timeNow});
    });
});

module.exports = router;