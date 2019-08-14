var express = require("express");
var router = express.Router();
const dbPool = require("../config/database").connections;
var SqlString = require('sqlstring');
var moment = require('moment'); //To parse, validate, manipulate, and display dates and times
var bcrypt = require("bcrypt"); // for encryption

//Ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.username.charAt(0) == 'L') {
        return next();
    }
    req.flash("error", "Please login first")
    res.redirect("/login");
}

//lecturer home
router.get("/", isLoggedIn, function (req, res) {
    var sql = "SELECT s.*, l.* from subject s, lecturer l where s.lecID=l.lecID and l.lecID='" + req.user.username + "';";//subjects related to the logged lec 

    var sql2 = "SELECT * from sch_changes order by created desc limit 2";//sch_changes
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;

        dbPool.query(sql2, (err, res3, cols) => {
            if (err)
                throw err;

            var sql3 = "SELECT login from lecturer where lecID='" + req.user.username + "';"; //first time
            dbPool.query(sql3, (err, res4, cols) => {

                var sql4 = "UPDATE lecturer SET login=1 where lecID='" + req.user.username + "';"; //after first time
                dbPool.query(sql4, (err, res5, cols) => {
                    res.render("lecturer/lecturerHome", { 'myself': res2, posts: res3, moment: moment, firstTime: res4 });
                    res.end();
                })
            })
        });
    });
});

//Display profile
router.get("/profile", isLoggedIn, function (req, res) {
    if (req.user) {
        var sql = "select l.name,l.tele,l.email,l.qualification,l.address from lecturer l where l.lecID='" + req.user.username + "'";

        dbPool.query(sql, (err, res2, cols) => {
            console.log(res2);
            if (err) throw err;
            res.render("lecturer/lecturerProfile", { details: res2 });
            res.end();
        });
    }
});

//Update profile
router.post("/profile", function (req, res) {
    var pwd1 = req.body.pwd1;
    var pwd2 = req.body.pwd2;

    //Update personal details
    var sql = "Update lecturer l set l.name=" + SqlString.escape(req.body.name) + ",l.tele=" + SqlString.escape(req.body.telemob) + ",l.email=" + SqlString.escape(req.body.email) + ",l.qualification=" + SqlString.escape(req.body.qualif) + ",l.address=" + SqlString.escape(req.body.address) + " where l.lecID='" + req.user.username + "';";
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        if (pwd1 != '') {
            //Hash new password 
            bcrypt.hash(pwd1, 10, function (err, newhash) {
                //Update password
                var sql2 = "UPDATE user SET password='" + newhash + "' WHERE username='" + req.user.username + "'";
                dbPool.query(sql2, (err, res4, cols) => {
                    if (err) throw err;
                });

            })

        }
    });
    res.redirect("/lecturer/profile");
});

router.get("/income", isLoggedIn, function (req, res) {
    var sql = "select p.year, count(s.subID) as num,s.subID,s.year as ALyear,s.subname,p.month,s.fee,sum(s.fee) as totalfee from subject s,payment p, lecturer l where l.lecID=s.lecID and s.subID=p.subID and l.lecID='" + req.user.username + "' group by s.subID,p.month order by year,s.subID;";

    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;

        var amts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var amts2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        res2.forEach(function (result) {
            var monthIndex = months.indexOf(result.month);
            if (amts[monthIndex] == 0)
                amts[monthIndex] = result.totalfee;
            else
                amts2[monthIndex] = result.totalfee;
        });

        res.render("lecturer/lecturerIncome", { incomes: res2, fees: { amts, amts2 } });
        res.end();
    });


});

//Add assignment result route
router.get("/addAssignmentResults/:id", isLoggedIn, function (req, res) {
    var id = req.params.id;

    //Select student details from enrolment & student for the subject
    var sql = "SELECT e.*, s.* from enrolment e, student s where subID='" + id + "'and s.stID=e.stID;";
    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;
        //Pass result to frontend

        res.render("lecturer/lecturerAddResults", { 'enrolment': res2 });
        res.end();
    });
});


router.post("/addAssignmentResults/:id", function (req, res) {
    var subID = req.params.id;

    var index = 0;
    req.body.stID.forEach(function (student) {

        var mark = req.body.marks[index];

        //add assignmrnt marks to assignmrnt  table
        var sql = "INSERT INTO assignment VALUES('" + req.body.title + "','" + subID + "','" + student + "','" + mark + "');"
        index++;
        dbPool.query(sql, (err, res1, cols) => {
            if (err) throw err;

            //get assignment details each student
            var sql1 = "SELECT result FROM assignment WHERE stID='" + student + "' AND subID='" + subID + "'";
            dbPool.query(sql1, (err, res2, cols) => {
                if (err) throw err;

                var total = 0;
                var i = 0;

                //calculate total marks for that subject
                res2.forEach(function (resMark) {
                    total += resMark.result
                    i++
                })
                var avg = Math.round(total / i);

                //push avg assignment mark to enrollment table
                var sql2 = "UPDATE enrolment SET average='" + avg + "' WHERE stID='" + student + "' AND subID='" + subID + "'";
                dbPool.query(sql2, (err, res3, cols) => {
                    if (err) throw err;
                })
            })
        })
    })

    res.redirect("/lecturer/viewResults/" + subID);
    res.end();
});

//plagiarism check page
router.get("/plagiarismCheck/", isLoggedIn, function(req,res){
    res.render("lecturer/lecturerPlagiarismCheck");
});

//add course content page
router.get("/addCourseContent/:id", isLoggedIn, function (req, res) {
    var id = req.params.id;
    var sql = "SELECT * from content where subID='" + id + "' order by section;";
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;

        res2.id = { "id": id };
        res.render("lecturer/lecturerCourseContent", { 'content': res2 });
    });
});

//add course content post request
router.post("/addNewCourseContent/:id", function (req, res) {
    var id = req.params.id;
    var sql = "SELECT count(contentID) as noc from content where subID='" + id + "';";

    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var created = dte.toJSON();

    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;

        var noc = res2[0].noc + 1;

        if (!req.files)
            return console.log("upload a file");

        // The name of the input field is used to retrieve the uploaded file
        let courseFile = req.files.courseFile;

        // Get the file format
        var format = courseFile.name.substring(courseFile.name.lastIndexOf('.'));


        //Accept Responses?
        var accResponse = 'y';

        if (!req.body.accResponse)
            accResponse = 'n';

        //Due date and time format
        var dueDate = req.body.dueDate;
        var dueTime = req.body.dueTime;

        var fileName;

        // Increment content id
        if (noc < 10)
            fileName = id + "-0" + noc + format;
        else
            fileName = id + "-" + noc + format;

        // Use the mv() method to place the file somewhere on your server
        courseFile.mv('public/CourseContent/' + fileName, function (err) {
            if (err)
                return console.log("error");

            return console.log("done");
        });

        var sql2 = "INSERT INTO content values ('" + fileName + "','" + req.body.section + "','" + req.body.title + "','" + req.body.desc + "','" + id + "', " + SqlString.escape(created) + ",'" + accResponse + "', '" + dueDate + "', '" + dueTime + "' );";

        con.query(sql2, function (err, result) {
            if (err) throw err;
        });
    });

    res.redirect("/lecturer/addCourseContent/" + id);

});

//delete course content
router.post("/deleteCourseContent/:idSub/:idCont", function (req, res) {
    var contentid = req.params.idCont;
    var subid = req.params.idSub;

    var sql = "DELETE FROM content where contentID='" + contentid + "';";
    dbPool.query(sql, (err, res1, cols) => {
        if (err) throw err;

        res.redirect("/lecturer/addCourseContent/" + subid);
    });
});

//Display discussion forum
router.get("/forums/:id", isLoggedIn, function (req, res) {
    var id = req.params.id;
    var user = req.user.username;

    //Select ID of lecturer teaching the subject
    var sql3 = "select s.lecID,s.subname,s.year from subject s where s.subID='" + id + "';";
    dbPool.query(sql3, (err, res3, cols) => {
        if (err) throw err;
        var lecID = res3[0].lecID;

        //Select the course topics for post sections 
        var sql2 = "select c.title,c.subID from course_topics c where c.lecID='" + lecID + "' and c.subID='" + id + "';";
        dbPool.query(sql2, (err, res2, cols) => {
            if (err) throw err;

            //Select the posts
            var sql4 = "select d.postID,d.title,d.author,d.descr,d.subID,d.sub_sec,d.postedAt,d.authorName from discussion_posts d where d.subID='" + id + "' order by d.sub_sec,d.postedAt desc;"
            dbPool.query(sql4, (err, res4, cols) => {
                if (err) throw err;

                //Select the comments
                var sql5 = "select c.postID,c.cID, c.comment, c.subID, c.postedAt, c.author,c.authorName from comments c where c.subID='" + id + "' order by c.postID,c.postedAt;";
                dbPool.query(sql5, (err, res5, cols) => {
                    if (err) throw err;
                    //Render the page with the selected details
                    res.render("lecturer/lecturerDiscussion", { 'subject': res3, 'section': res2, 'posts': res4, moment: moment, 'user': user, 'comments': res5 });
                });
            });
        });
    });
});

//Add a post to forum
router.post("/forums/:id", function (req, res) {
    var id = req.params.id;
    var username = req.user.username;

    //Getting client's time
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var created = dte.toJSON();

    //Get lecturer name
    var sql1 = "select l.name from lecturer l where l.lecID='" + username + "';";
    dbPool.query(sql1, (err, res1, cols) => {
        if (err) throw err;

        var sql = "insert into discussion_posts(title,descr,subID,sub_sec,postedAt,author,authorName) values ('" + req.body.title + "','" + req.body.desc + "','" + id + "','" + req.body.sub_section + "','" + created + "','" + req.user.username + "','" + res1[0].name + "');";
        dbPool.query(sql, (err, res2, cols) => {
            if (err) throw err;
        });

    });
    res.redirect("/lecturer/forums/" + id);
});


//Delete post by postID
router.post("/forums/delete/:idSub/post/:idPost", function (req, res) {
    var post = req.params.idPost;
    var sub = req.params.idSub;
    //Firstly delete all comments to remove dependencies
    var sql1 = "DELETE FROM comments where postID=" + post + ";";
    dbPool.query(sql1, (err, res1, cols) => {
        if (err) throw err;
        //Secondly delete all posts
        var sql2 = "DELETE FROM discussion_posts where postID=" + post + ";";
        dbPool.query(sql2, (err, res2, cols) => {
            if (err) throw err;
        });
    });

    res.redirect("/lecturer/forums/" + sub);
});

//Delete comment by commentID 
router.post("/forums/delete/:idSub/comment/:id", function (req, res) {
    var id = req.params.id;
    var idSub = req.params.idSub;
    var sql = "DELETE FROM comments where cID=" + id + ";";
    console.log(sql);
    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;
        res.redirect("/lecturer/forums/" + idSub);
    });

});

//Post new comment
router.post("/forums/:id/comment", function (req, res) {
    var subID = req.params.id;
    var username = req.user.username;
    console.log(req.body.comment)

    //Getting client's time
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var created = dte.toJSON();

    var sql1 = "select l.name from lecturer l where l.lecID='" + username + "';";
    dbPool.query(sql1, (err, res1, cols) => {
        if (err) throw err;

        var sql = "insert into comments(comment,postID,postedAt,author,subID,authorName) values(" + SqlString.escape(req.body.comment) + "," + SqlString.escape(req.body.postID) + "," + SqlString.escape(created) + "," + SqlString.escape(req.user.username) + "," + SqlString.escape(subID) + "," + SqlString.escape(res1[0].name) + ");";
        dbPool.query(sql, (err, res2, cols) => {
            if (err) throw err;
        });
    });
    res.redirect("lecturer/forums/" + subID);
});

//Display results page
router.get("/viewResults/:id", isLoggedIn, function (req, res) {
    var id = req.params.id;

    //Get assignment IDs
    var sql = "SELECT DISTINCT assID FROM assignment WHERE subID='" + id + "'";
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;

        //Get assignment details for selected subject
        var sql2 = "SELECT * FROM assignment WHERE subID='" + id + "'";
        dbPool.query(sql2, (err, res3, cols) => {
            if (err) throw err;

            //Get student name,id enrolled in the selected subject
            var sql3 = "SELECT DISTINCT s.stID, s.name FROM student s,assignment a WHERE s.stID=a.stID AND a.subID='" + id + "'";
            dbPool.query(sql3, (err, res4, cols) => {
                if (err) throw err;

                //Get average mark for subject
                var sql4 = "SELECT * FROM enrolment WHERE subID='" + id + "'"
                dbPool.query(sql4, (err, res5, cols) => {
                    if (err) throw err;

                    //Get subject name, year
                    var sql5 = "SELECT subname, year FROM subject WHERE subID='" + id + "'";
                    dbPool.query(sql5, (err, res6, cols) => {
                        if (err) throw err;
                        res.render("lecturer/lecturerViewResults", { aNames: res2, assignments: res3, student: res4, overall: res5, subject: res6 });
                    })

                })
            })

        })

    })

});

router.get("/notifications", isLoggedIn, function (req, res) {
    var notifs = []
    var sql = "SELECT s.title, s.created from sch_changes s, user where username='" + req.user.username + "' limit 10;";

    dbPool.query(sql, (err, schChanges, cols) => {
        schChanges.forEach(function (sc) {
            sc.type = 'sc';
            sc.date = sc.created;
            notifs.push(sc);
        })
        sql = "select d.title, d.author, d.authorName, d.subID, d.postedAt from subject s, discussion_posts d, user u where d.author<>'" + req.user.username + "' and u.username='" + req.user.username + "' and s.subID=d.subID and s.lecID='" + req.user.username + "'  limit 10;"
        dbPool.query(sql, (err, posts, cols) => {
            posts.forEach(function (ps) {
                ps.type = 'ps';
                ps.date = ps.postedAt;
                notifs.push(ps);
            })

            sql = "select c.authorName, c.author, d.title, c.postedAt, c.subID from comments c, discussion_posts d, user u where c.author<>'" + req.user.username + "' and u.username='" + req.user.username + "' and d.author='" + req.user.username + "' and d.postID=c.postID  limit 10;"
            dbPool.query(sql, (err, comment, cols) => {
                comment.forEach(function (cm) {
                    cm.type = 'cm';
                    cm.date = cm.postedAt;
                    notifs.push(cm);
                })

                notifs.sort(function (a, b) { return a.date - b.date });
                notifs.reverse();
                res.render("lecturer/lecturerNotifications", { notifs });
            });
        });
    });
});

router.post("/home/notifications", isLoggedIn, function (req, res) {
    var notifs = []
    var sql = "SELECT s.title, s.created from sch_changes s, user where username='" + req.user.username + "' and lastLogin<created";

    dbPool.query(sql, (err, schChanges, cols) => {
        schChanges.forEach(function (sc) {
            sc.type = 'sc';
            sc.date = sc.created;
            notifs.push(sc);
        })
        sql = "select d.title, d.author, d.authorName, d.subID, d.postedAt from subject s, discussion_posts d, user u where d.author<>'" + req.user.username + "' and u.lastLogin<d.postedAt and u.username='" + req.user.username + "' and s.subID=d.subID and s.lecID='" + req.user.username + "';"
        dbPool.query(sql, (err, posts, cols) => {
            posts.forEach(function (ps) {
                ps.type = 'ps';
                ps.date = ps.postedAt;
                notifs.push(ps);
            })
            sql = "select c.authorName, c.author, d.title, c.postedAt, c.subID from comments c, discussion_posts d, user u where c.author<>'" + req.user.username + "' and u.lastLogin<c.postedAt and u.username='" + req.user.username + "' and d.author='" + req.user.username + "' and d.postID=c.postID;"
            dbPool.query(sql, (err, comment, cols) => {
                comment.forEach(function (cm) {
                    cm.type = 'cm';
                    cm.date = cm.postedAt;
                    notifs.push(cm);
                })

                notifs.sort(function (a, b) { return a.date - b.date });
                res.send(notifs);
            });
        });
    });
});


router.get("/news", isLoggedIn, function (req, res) {
    var sql = "SELECT * from sch_changes order by created desc";

    // var dte = new Date();
    // dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
    // var timeNow = dte.toJSON();

    dbPool.query(sql, (err, res2, cols) => {
        res.render("lecturer/lecturerNews", { posts: res2, moment: moment });//,time:timeNow
    });
});

module.exports = router;