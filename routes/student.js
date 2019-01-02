var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');

var moment          =   require('moment'); //To parse, validate, manipulate, and display dates and times

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
    var sql="SELECT st.*, s.* from subject s, student st, enrolment e where st.stID=e.stID and e.subID=s.subID and st.stID='"+req.user.username+"';";
    
    var sql2="SELECT * from sch_changes order by created desc limit 4";
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
        
        pool.query(sql2,(err,res3,cols)=>{
            if(err) 
                throw err;
           res.render("student/studentHome",{'myself':res2,posts:res3,moment:moment});
           res.end();
        });
    });
});


router.get("/profile", function(req,res){
    
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
    var sql="Update student s set s.name="+SqlString.escape(req.body.name)+",s.school="+SqlString.escape(req.body.school)+",s.teleres="+SqlString.escape(req.body.teleres)+",s.telemob="+SqlString.escape(req.body.telemob)+",s.email="+SqlString.escape(req.body.email)+",s.gender="+SqlString.escape(req.body.gender)+",s.address="+SqlString.escape(req.body.address)+" where s.stID='"+req.user.username+"';";
    pool.query(sql,(err,res2,cols)=>{
        if(err) throw err;
        
    });
    res.redirect("/student/profile");
});

router.get("/payments", function(req,res){
    //If logged in
    if(req.user){
    var stID=req.user.username;
    
    //var sql="select s.subname, p.date, p.month, p.amount from payment p, subject s where s.subID=p.subID group by s.subname order by date desc ";
    var sql="select s.subname,s.medium,s.day, p.date, p.month, p.amount from payment p, subject s where p.stID='"+ stID+"' and s.subID=p.subID order by date desc ";
    
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
            res.render("student/studentPayment",{payments:res2});
            res.end();
    });
    }
});

router.post("/discussions/:id/comment",function(req, res) {
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
         
    });
    });
    
    res.redirect("student/discussions/"+subID);
});

router.post("/discussions/:id",function(req,res){
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
    
    res.redirect("/student/discussions/"+id);
});

router.get("/discussions/:id", function(req,res){
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
                res.render("student/studentDiscussion", {'section': res2,'posts':res4,moment:moment,'user':user,'comments':res5});
                });
            });
        });
    });
});

router.get("/viewCourseContent/:id", function(req,res){
    var id = req.params.id;
    var sql="SELECT * from content where subID='"+id+"' order by section;";
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         
        res2.id = {"id": id};
        res.render("student/studentCourseContent", {'content': res2});
    });
});

//Delete comment by commentID 
router.post("/discussion/delete/:idSub/comment/:id",function(req, res) {
    var id=req.params.id;
    var idSub=req.params.idSub;
    var sql="DELETE FROM comments where cID="+id+";";
    console.log(sql);
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         res.redirect("/student/discussions/"+idSub);
    });
    
});

//Delete post by postID
router.post("/discussion/delete/:idSub/post/:idPost",function(req, res) {
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
         res.redirect("/student/discussions/"+sub);
    });
    });
    
    
    
    
    
});

router.get("/viewResults/:id", function(req,res){
    var id = req.params.id;
    
    
    
    
    res.render("student/studentViewResults");
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