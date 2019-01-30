var express         =   require("express");
var router          =   express.Router();
var mysql           =   require("mysql");
var SqlString       =   require('sqlstring');
var bcrypt          =   require("bcrypt"); // for encryption
var moment          =   require('moment'); //To parse, validate, manipulate, and display dates and times

var pool = mysql.createPool({
  host: "localhost",
  user: "nimesha",
  password: "",
  database: "akura",
  charset: "utf8"
});

//Ensure user is logged in
function isLoggedIn(req, res, next){
if(req.isAuthenticated() && req.user.username.charAt(0)=='S' && (req.user.username.substring(0,2)!="SA")){
        return next();
    }
req.flash("error","Please login first")
res.redirect("/login");
}


router.get("/",isLoggedIn,function(req, res) {
    var sql="SELECT st.*, s.* from subject s, student st, enrolment e where st.stID=e.stID and e.subID=s.subID and st.stID='"+req.user.username+"';";//enrolled classes
    
    var sql2="SELECT * from sch_changes order by created desc limit 2";//sch_changes
    
    var sql3="SELECT login from student where stID='"+req.user.username+"';"; //first time
    
    pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
        
        pool.query(sql2,(err,res3,cols)=>{
            if(err) 
                throw err;
                
                pool.query(sql3,(err,res4,cols)=>{
                    
                    var sql4="UPDATE student SET login=1 where stID='"+req.user.username+"';"; //after first time
                    pool.query(sql4,(err,res5,cols)=>{
                        res.render("student/studentHome",{'myself':res2,posts:res3,moment:moment,firstTime:res4});
                        res.end();
                    })
                })
        });
    });
});


router.get("/profile",isLoggedIn, function(req,res){
    
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
    var pwd1=req.body.pwd1;
    var pwd2=req.body.pwd2;
    
    var sql="Update student s set s.name="+SqlString.escape(req.body.name)+",s.school="+SqlString.escape(req.body.school)+",s.teleres="+SqlString.escape(req.body.teleres)+",s.telemob="+SqlString.escape(req.body.telemob)+",s.email="+SqlString.escape(req.body.email)+",s.gender="+SqlString.escape(req.body.gender)+",s.address="+SqlString.escape(req.body.address)+" where s.stID='"+req.user.username+"';";
    pool.query(sql,(err,res2,cols)=>{
        if(err) throw err;
        if(pwd1!=''){
           //Hash new password 
            bcrypt.hash(pwd1, 10, function(err, newhash) {
                        //Update password
                        var sql2="UPDATE user SET password='"+newhash+"' WHERE username='"+req.user.username+"'";
                        pool.query(sql2,(err,res4,cols)=>{
                            if(err) throw err;
                        });
                
            })
            
        }
        
    });
    res.redirect("/student/profile");
});

// payments page
router.get("/payments",isLoggedIn, function(req,res){
    //If logged in
    if(req.user){
        
         var stID=req.user.username; //gets student id by req.user.username
        
        var sql="select s.subname,s.medium,s.day, p.date, p.month, p.amount from payment p, subject s where p.stID='"+ stID+"' and s.subID=p.subID order by p.subID, p.pID ";
        //var sql2="select p.month,sum(amount) as total,s.subID,s.subname from payment p,subject s where s.subID=p.subID and  p.stID='"+stID+"' group by month;";
        
        pool.query(sql, (err, res2, cols)=>{
            if(err) throw err;
            
                //pool.query(sql2,(err,res3,cols)=>{
                    res.render("student/studentPayment",{payments:res2});
                    res.end();
                //});
            
                
        });
    }
});

//Post comment to discussion forum
router.post("/discussions/:id/comment",function(req, res) {
    var subID = req.params.id;
    var username = req.user.username;
    
    //Getting client's time
    var dte = new Date();
    dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    var created = dte.toJSON();
    
     var sql1="select s.name from student s where s.stID='"+username+"';";
     pool.query(sql1,(err,res1,cols)=>{
       if (err) throw err;
        //Insert comment to DB
        var sql="insert into comments(comment,postID,postedAt,author,subID,authorName) values("+SqlString.escape(req.body.comment)+","+SqlString.escape(req.body.postID)+","+SqlString.escape(created)+","+SqlString.escape(req.user.username)+","+SqlString.escape(subID)+","+SqlString.escape(res1[0].name)+");";
        pool.query(sql, (err, res2, cols)=>{
        if(err) throw err;
    });
    });
    //Redirect to forum
    res.redirect("student/discussions/"+subID);
});

//Add a post to forum
router.post("/discussions/:id",function(req,res){
    var id = req.params.id;
    var username = req.user.username;
    
    //Getting client's time
    var dte = new Date();
    dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    var created = dte.toJSON();
    
   var sql1="select s.name from student s where s.stID='"+username+"';";
    pool.query(sql1,(err,res1,cols)=>{
       if (err) throw err;
       //Insert comment to DB
       var sql="insert into discussion_posts(title,descr,subID,sub_sec,postedAt,author,authorName) values ("+SqlString.escape(req.body.title)+","+SqlString.escape(req.body.desc)+","+SqlString.escape(id)+","+SqlString.escape(req.body.sub_section)+","+SqlString.escape(created)+","+SqlString.escape(req.user.username)+","+SqlString.escape(res1[0].name)+");";
   
        pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
    });
       
    });
    //Redirect to forum
    res.redirect("/student/discussions/"+id);
});

//Display forum
router.get("/discussions/:id",isLoggedIn, function(req,res){
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
         
            //select discussion posts
            var sql4="select d.postID,d.title,d.author,d.descr,d.subID,d.sub_sec,d.postedAt,d.authorName from discussion_posts d where d.subID='"+id+"' order by d.sub_sec,d.postedAt desc;"
            pool.query(sql4, (err, res4, cols)=>{
            if(err) throw err;
            var user=req.user.username;
            
                //Select comments
                var sql5="select c.postID,c.cID, c.comment, c.subID, c.postedAt, c.author,c.authorName from comments c where c.subID='"+id+"' order by c.postID,c.postedAt;";
                pool.query(sql5, (err, res5, cols)=>{
                if(err) throw err;
                res.render("student/studentDiscussion", {'section': res2,'posts':res4,moment:moment,'user':user,'comments':res5});
                });
            });
        });
    });
});

//Display course content
router.get("/viewCourseContent/:id",isLoggedIn, function(req,res){
    var id = req.params.id;
    
    //each subject content order by section field
    var sql="SELECT * from content where subID='"+id+"' order by section;";
    pool.query(sql, (err, res2, cols)=>{
         if(err) throw err;
         
        res2.id = {"id": id};
        
        //check student enrole that subject
        var sql1="SELECT * from enrolment where subID='"+id+"' and stID='"+req.user.username+"'";
        pool.query(sql1, (err, res3, cols)=>{
            if(err) throw err;
            
            //if response length not equal to 0 thats mean thats student enrole that subject
            if(res3.length!=0)
                res.render("student/studentCourseContent", {'content': res2});
            else
                res.render("student/restricted");
        });
    });
});

//Delete comment by commentID 
router.post("/discussion/delete/:idSub/comment/:id",function(req, res) {
    var id=req.params.id;
    var idSub=req.params.idSub;
    var sql="DELETE FROM comments where cID="+id+";";
    
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

//Display his/her results
router.get("/viewResults/:id",isLoggedIn, function(req,res){
    var id = req.params.id;
    
        //Get subject name, year
        var sql="SELECT subname,year FROM subject where subID='"+id+"'";
        pool.query(sql,(err,res1,cols)=>{
            if (err) throw err;
                
                //Get assignment marks of logged in student
                var sql1="SELECT * FROM assignment WHERE subID='"+id+"' AND stID='"+req.user.username+"'";
                pool.query(sql1,(err,res2,cols)=>{
                    if (err) throw err;
                    
                    //Get attendance details
                    var sql2="SELECT * FROM attendance WHERE subID='"+id+"' AND stuID='"+req.user.username+"'";
                    pool.query(sql2,(err,res3,cols)=>{
                        if (err) throw err;
                        
                        res.render("student/studentViewResults",{subID:id,subject:res1,assignments:res2,attendance:res3});
                    })
                })
            })
});

router.get("/news",isLoggedIn, function(req,res){
    var sql="SELECT * from sch_changes order by created desc";
    
    var dte = new Date();
    dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    var timeNow = dte.toJSON();
    
    pool.query(sql,(err,res2,cols)=>{
       res.render("student/studentNews",{posts:res2,moment:moment,time:timeNow});
    });
});

router.get("/notifications",isLoggedIn, function(req,res){
    var notifs=[]
    var sql="SELECT s.title, s.created from sch_changes s, user where username='"+req.user.username+"' limit 10;";
    
    pool.query(sql,(err,schChanges,cols)=>{
        schChanges.forEach(function(sc){
            sc.type='sc';
            sc.date=sc.created;
            notifs.push(sc);
        })
        sql="select d.title, d.author, d.authorName, d.subID, d.postedAt from enrolment e, discussion_posts d, user u where d.author<>'"+req.user.username+"' and u.username='"+req.user.username+"' and e.stID='"+req.user.username+"' and e.subID=d.subID  limit 10;"        
        pool.query(sql,(err,posts,cols)=>{
            posts.forEach(function(ps){
                ps.type='ps';
                ps.date=ps.postedAt;
                notifs.push(ps);
            })
            sql="select c.created, c.subID, c.title, c.section from content c, enrolment e, user u where u.username='"+req.user.username+"' and e.stID='"+req.user.username+"' and e.subID=c.subID  limit 10;"        
            pool.query(sql,(err,content,cols)=>{
                content.forEach(function(cn){
                    cn.type='cn';
                    cn.date=cn.created;
                    notifs.push(cn);
                })
                sql="select c.authorName, c.author, d.title, c.postedAt, c.subID from comments c, discussion_posts d, user u where c.author<>'"+req.user.username+"' and u.username='"+req.user.username+"' and d.author='"+req.user.username+"' and d.postID=c.postID  limit 10;"        
                pool.query(sql,(err,comment,cols)=>{
                    comment.forEach(function(cm){
                        cm.type='cm';
                        cm.date=cm.postedAt;
                        notifs.push(cm);
                    })
                    
                    notifs.sort(function(a, b){return a.date - b.date});
                    notifs.reverse();
                    res.render("student/studentNotifications",{notifs});
                });
            });
        });
    });
});

router.post("/home/notifications",isLoggedIn, function(req,res){
    var notifs=[]
    var sql="SELECT s.title, s.created from sch_changes s, user where username='"+req.user.username+"' and lastLogin<created";
    
    pool.query(sql,(err,schChanges,cols)=>{
        schChanges.forEach(function(sc){
            sc.type='sc';
            sc.date=sc.created;
            notifs.push(sc);
        })
        sql="select d.title, d.author, d.authorName, d.subID, d.postedAt from enrolment e, discussion_posts d, user u where d.author<>'"+req.user.username+"' and u.lastLogin<d.postedAt and u.username='"+req.user.username+"' and e.stID='"+req.user.username+"' and e.subID=d.subID;"        
        pool.query(sql,(err,posts,cols)=>{
            posts.forEach(function(ps){
                ps.type='ps';
                ps.date=ps.postedAt;
                notifs.push(ps);
            })
            sql="select c.created, c.subID, c.title, c.section from content c, enrolment e, user u where u.lastLogin<c.created and u.username='"+req.user.username+"' and e.stID='"+req.user.username+"' and e.subID=c.subID;"        
            pool.query(sql,(err,content,cols)=>{
                content.forEach(function(cn){
                    cn.type='cn';
                    cn.date=cn.created;
                    notifs.push(cn);
                })
                sql="select c.authorName, c.author, d.title, c.postedAt, c.subID from comments c, discussion_posts d, user u where c.author<>'"+req.user.username+"' and u.lastLogin<c.postedAt and u.username='"+req.user.username+"' and d.author='"+req.user.username+"' and d.postID=c.postID;"        
                pool.query(sql,(err,comment,cols)=>{
                    comment.forEach(function(cm){
                        cm.type='cm';
                        cm.date=cm.postedAt;
                        notifs.push(cm);
                    })
                    
                    notifs.sort(function(a, b){return a.date - b.date});
                    res.send(notifs);
                });
            });
        });
    });
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