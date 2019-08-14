//Requiring the npm packages
var express = require("express");
var router = express.Router();
const dbPool = require("../config/database").connections;
var SqlString = require('sqlstring'); //To escape user provided data, inorder to avoid SQL injection attacks
var nodemailer = require('nodemailer'); //for mailing purposes
var randomstring = require("randomstring"); //to generate random strings as passwords
var bcrypt = require("bcrypt"); // for encryption
var dateTime = require('get-date'); //returns current date

var moment = require('moment'); //To parse, validate, manipulate, and display dates and times

//for document generating
var https = require("https");
var fs = require("fs");

//If the user is an Admin, redirect to the Admin home. Otherwise redirect to the login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.username.charAt(0) == 'A') {
        return next();
    }
    req.flash("error", "Please login first")
    res.redirect("/login");
}

//home page
router.get("/", isLoggedIn, function (req, res) {
    var day = new Date().getDay(); //get day, number

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var sql = "SELECT * from subject where day ='" + days[day] + "';"; //get today's classes
    dbPool.query(sql, (err, res2, cols) => { //run sql query
        if (err)
            throw err;
        res.render("admin/adminHome", { 'today': res2 }); //send res2 result as today
        res.end();
    });
});

//load register student page
router.get("/register/student", isLoggedIn, function (req, res) {
    res.render("admin/adminRegisterStudent");
});

//enrol existing student in new subject
router.post("/register/student/subject", function (req, res) {
    var subjects = req.body.subject;
    var stID = 'S-2019-042';

    if (Array.isArray(subjects)) {
        subjects.forEach(function (subject) {
            var sql3 = "INSERT INTO enrolment (subID, stID) values(" + SqlString.escape(subject) + "," + SqlString.escape(stID) + ");";
            dbPoolsole.log(sql3);
            dbPool.query(sql3, function (err, result) {
                if (err) throw err;
            });

            var datetime = new Date();
            var curDate = datetime.toJSON();

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var d = new Date();
            var curMonth = months[d.getMonth()];
            var year = (new Date()).getFullYear();

            var sql5 = "INSERT INTO payment (date,month,amount,stID,subID,year) values('" + curDate + "','" + curMonth + "','3000'," + SqlString.escape(stID) + "," + SqlString.escape(subject) + ",'" + year + "');";

            dbPool.query(sql5, function (err, result) {
                if (err) throw err;
            });
        });
    }
    else {
        var sql4 = "INSERT INTO enrolment (subID, stID) values(" + SqlString.escape(subjects) + "," + SqlString.escape(stID) + ");";
    }
})

//register new student
router.post("/register/student/new", function (req, res) {
    //getting details of the student

    var name = req.body.firstname + " " + req.body.lastname;
    var email = req.body.email;
    var ALyear = req.body.ALYear;


    var nos;
    var stID = "S-";

    var sql = "select count(stID) as numberOfStudents from student where ALyear=" + ALyear + ";";


    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;
        nos = parseInt(res2[0].numberOfStudents, 10) + 1;

        //creating the student ID
        if (nos < 10)
            stID = stID + ALyear + "-00" + nos;
        else if (nos < 100)
            stID = stID + ALyear + "-0" + nos;
        else if (nos < 1000)
            stID = stID + ALyear + "-" + nos;


        var subjects = req.body.subject;



        var sql2 = "INSERT INTO student (stID,name,email,ALyear) values (" + SqlString.escape(stID) + "," + SqlString.escape(name) + "," + SqlString.escape(email) + "," + SqlString.escape(ALyear) + ");";

        dbPool.query(sql2, function (err, result) {
            if (err) throw err;
        });


        if (Array.isArray(subjects)) {
            subjects.forEach(function (subject) {
                var sql3 = "INSERT INTO enrolment (subID, stID) values(" + SqlString.escape(subject) + "," + SqlString.escape(stID) + ");";
                dbPoolsole.log(sql3);
                dbPool.query(sql3, function (err, result) {
                    if (err) throw err;
                });

                var datetime = new Date();
                var curDate = datetime.toJSON();

                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var d = new Date();
                var curMonth = months[d.getMonth()];
                var year = (new Date()).getFullYear();

                var sql5 = "INSERT INTO payment (date,month,amount,stID,subID,year) values('" + curDate + "','" + curMonth + "','3000'," + SqlString.escape(stID) + "," + SqlString.escape(subject) + ",'" + year + "');";

                dbPool.query(sql5, function (err, result) {
                    if (err) throw err;
                });
            });
        }
        else {
            var sql4 = "INSERT INTO enrolment (subID, stID) values(" + SqlString.escape(subjects) + "," + SqlString.escape(stID) + ");";
        }

        //creating the ID
        var idCard = {
            pageSize: {
                width: 410,
                height: 170
            },

            pageMargins: [10, 10, 10, 0],
            pageOrientation: 'landscape',

            dbPooltent: [
                {
                    columns: [
                        {
                            qr: stID + " " + name + " " + ALyear,
                            fit: 150,
                            width: 150,
                            height: 150
                        },

                        {
                            width: '*',
                            alignment: 'center',
                            stack: [
                                {
                                    text: [
                                        {
                                            text: 'AKURA INSTITUTE\n\n',
                                            fontSize: 12
                                        },

                                        {
                                            text: '--------------  STUDENT IDENTIFICATION CARD  --------------\n\n\n',
                                            fontSize: 9
                                        }
                                    ]
                                },

                                {
                                    table: {
                                        widths: [70, 20, '*'],
                                        heights: [20, 20, 20, 20],
                                        body: [
                                            [[{ alignment: 'right', text: 'Student #', fontSize: 10 }], '-', [{ alignment: 'left', text: stID, fontSize: 10 }]],
                                            [[{ alignment: 'right', text: 'Name', fontSize: 10 }], '-', [{ alignment: 'left', text: name, fontSize: 10 }]],
                                            [[{ alignment: 'right', text: 'A/L - Year', fontSize: 10 }], '-', [{ alignment: 'left', text: ALyear, fontSize: 10 }]],
                                            [[{ alignment: 'right', text: 'E-Mail', fontSize: 10 }], '-', [{ alignment: 'left', text: email, fontSize: 10 }]]
                                        ]
                                    },
                                    layout: 'noBorders'
                                }]
                        }
                    ],
                    columnGap: 5
                }]
        };
        //end of creating the ID

        var PdfPrinter = require('pdfmake/src/printer');
        var fonts = {
            Roboto: {
                normal: './fonts/Roboto-Regular.ttf',
                bold: './fonts/Roboto-Medium.ttf',
                italics: './fonts/Roboto-Italic.ttf',
                bolditalics: './fonts/Roboto-Italic.ttf'
            }
        };

        var printer = new PdfPrinter(fonts);

        //moving file to the public folder, to share 
        var pdfDoc = printer.createPdfKitDocument(idCard);
        pdfDoc.pipe(fs.createWriteStream('idCard.pdf')).on('finish', function () {
            moveFile('idCard.pdf', 'public');
        });
        pdfDoc.end();

        var randomPassword = randomstring.generate(10); //encrypt the password using bcrypt
        bcrypt.hash(randomPassword, 10, function (err, hash) { //hash dbPooltains the encrypted password 
            var users = {
                "username": stID,
                "password": hash
            }

            //insert  details into the db
            dbPool.query("INSERT INTO user SET ?", users, function (error, results, fields) {
                if (error) {
                    req.flash("error", "Please try again!");
                }
                else {

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
                        html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the given credentials to login to Akura</p> <p>Username : <strong>' + stID + '</strong></p> <p>Password : <strong>' + randomPassword + '</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            req.flash("error", "Error occured. Please try again.");
                        }
                        else {
                            req.flash("success", "Student registration successful!");
                        }

                    });
                }
            });
        });
    });

    req.flash("success", "Student registration successful! Click here to print the student ID.");
    res.redirect("/admin/register/student");
});
//end of student registration

//register parent
router.get("/register/parent", isLoggedIn, function (req, res) {
    res.render("admin/adminRegisterParent")
});

//end of register parent
router.post("/register/alyear", function (req, res) {
    var sql = "SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='" + req.body.alyears.year + "'";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.render("../views/admin/ajaxRegisterTableTemplate", { subjects: res2 });
        res.end();
    });
});

//load payment page
router.get("/payments", isLoggedIn, function (req, res) {
    res.render("admin/adminPayment");
});

var studentID;

//to update the student name using ajax
router.post("/payments/name", function (req, res) {
    studentID = req.body.stID.stID;

    var sql1 = "SELECT name from student where stID='" + req.body.stID.stID + "'";

    dbPool.query(sql1, (err, res2, cols) => {
        if (err) throw err;
        var name = res2[0].name;
        res.render("admin/ajaxUpdateName", { name: res2[0].name });
        res.end();
    });
});

//to update the payment table using ajax
router.post("/payments/id", function (req, res) {

    studentID = req.body.stID.stID;

    var sql = "SELECT name,subID, subname, month, fee FROM (SELECT st.name, s.subID,s.subname,p.month,s.fee from subject s,payment p, student st where p.stID='" + studentID + "' && p.subID=s.subID && st.stID='" + studentID + "' order by date desc) as t2 group by subname;"
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.render("../views/admin/ajaxPaymentTableTemplate", { payments: res2 });
        res.end();
    });
});

//adding a new payment
var items;
var to;
router.post("/payments/new", function (req, res) {
    items = [];
    var subjects = req.body.subject;
    if (Array.isArray(subjects)) {

        subjects.forEach(function (sub) {
            var subsplit = sub.split(',');

            var subject = subsplit[0];
            var month = subsplit[1];
            var fee = subsplit[2];
            var curDate = "" + dateTime();
            curDate = curDate.split('/').join('-');

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var newIndex = months.indexOf(month) + 1;

            if (newIndex > 11)
                newIndex = 0; //if index is greater than 11, make it count from 0

            var newMonth = months[newIndex];

            var datetime = new Date();
            var newDate = datetime.toJSON();
            var year = (new Date()).getFullYear();

            var sql3 = "INSERT INTO payment(date,month,amount,stID,subID,year) values('" + newDate + "','" + newMonth + "'," + fee + ",'" + studentID + "','" + subject + "','" + year + "');";
            dbPoolsole.log(sql3);
            dbPool.query(sql3, (err, res3, cols) => {
                if (err)
                    throw err;
            });

            /*for the invoice */
            items.push({
                name: subject,
                unit_cost: fee,
                quantity: 1
            })

            to = studentID;
        });
    }


    var invoice = {
        logo: "https://i.imgur.com/qpEKVBl.png",
        from: "Invoiced\n59/4  Ananda Mawatha,\nColombo 10, Sri Lanka",
        to: to,
        currency: "lkr",
        number: "INV-0001",
        payment_terms: "Class Fees",
        items: items,
        fields: {
            tax: "%"
        },

        tax: 0,
        item_header: "Subject",
        unit_cost_header: "Rate",
        quantity_header: "# of months",

        notes: "Thanks for being a part of Akura!",
    };

    generateInvoice(invoice, 'invoice.pdf', function () {
        dbPoolsole.log("Saved invoice to invoice.pdf");

    },
        function (error) {
            dbPoolsole.error(error);
        }
    );

    //move file1.htm from 'test/' to 'test/dir_1/'
    moveFile('invoice.pdf', 'public');

    req.flash("success", "Payment successful! Click here to print an invoice.");
    res.redirect("/admin/payments");

});

//get register lecturer page
router.get("/register/lecturer", isLoggedIn, function (req, res) {
    res.render("admin/adminRegisterLecturer", { lecID: 0 });
});

router.get("/manage", isLoggedIn, function (req, res) {
    var sql1 = "SELECT stID, name FROM student";
    dbPool.query(sql1, (err, res1, cols) => {
        if (err) throw err;

        var sql2 = "SELECT lecID, name FROM lecturer";
        dbPool.query(sql2, (err, res2, cols) => {
            if (err) throw err;

            res.render("admin/adminManageUsers", { lecturers: res2, students: res1 });
            res.end();
        })

    })

});

router.post("/manage/student", function (req, res) {
    var stID = req.body.studentID;

    var sql1 = "DELETE FROM assignment WHERE stID='" + stID + "'";
    dbPool.query(sql1, (err, res1, cols) => {

        var sql3 = "DELETE FROM enrolment WHERE stID='" + stID + "'";
        dbPool.query(sql3, (err, res3, cols) => {

            var sql4 = "DELETE FROM attendance WHERE stID='" + stID + "'";
            dbPool.query(sql4, (err, res4, cols) => {

                var sql2 = "DELETE FROM student WHERE stID='" + stID + "'";
                dbPool.query(sql2, (err, res2, cols) => {
                    if (err) throw err;

                    var sql5 = "DELETE FROM user WHERE username='" + stID + "'";
                    dbPool.query(sql5, (err, res5, cols) => {
                        if (err) throw err;

                        var sql6 = "DELETE FROM comments WHERE author='" + stID + "'";
                        dbPool.query(sql6, (err, res6, cols) => {

                            res.redirect("/admin/manage");
                        })

                    })

                })
            })
        })
    })
});

router.post("/manage/lecturer", function (req, res) {
    var lecID = req.body.lecturerID;

    var sql1 = "DELETE FROM user WHERE username='" + lecID + "'";
    dbPoolsole.log(sql1)
    dbPool.query(sql1, (err, res2, cols) => {
        if (err) throw err;

        var sql2 = "DELETE FROM comments WHERE author='" + lecID + "'";
        dbPoolsole.log(sql2)
        dbPool.query(sql2, (err, res3, cols) => {
            if (err) throw err;

            var sql = "DELETE FROM lecturer WHERE lecID='" + lecID + "'";
            dbPoolsole.log(sql)

            dbPool.query(sql, (err, res1, cols) => {
                if (err) throw err;

                res.redirect("/admin/manage");
            })

        })

    })
});

//register a lecturer to a new class
router.post("/register/lecturer/new/class", function (req, res) {

    var sql = "SELECT * FROM subject s where s.lecID='" + req.body.lecID.lecID + "'";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.render("../views/admin/ajaxRegisterLecTableTemplate", { subjects: res2 });
        res.end();
    });
});

//add new subject
router.post("/register/subject/new", function (req, res) {

    //dbPoolfirm whether selected hall is free in the selected time slot
    var sql_validate = "SELECT * FROM subject WHERE day='" + req.body.day + "' AND hall='" + req.body.hall + "' AND ((fromTime>='" + req.body.from + "' AND fromTime<='" + req.body.to + "') OR (toTime<='" + req.body.to + "' AND toTime>='" + req.body.from + "'))";

    dbPool.query(sql_validate, (err, res_validate, cols) => {
        if (err)
            throw err;
        //Hall is FREE
        if (res_validate.length == 0) {           //Form subject ID
            var subID = "S";
            var sql = "select count(subID) as numberOfSubjects from subject";

            dbPool.query(sql, (err, res3, cols) => {
                if (err)
                    throw err;
                nos = parseInt(res3[0].numberOfSubjects, 10) + 1;

                if (nos < 10) //Single digit number
                    subID = subID + "0" + nos;
                else if (nos < 100)
                    subID = subID + nos;

                //Insert subject details into DB        
                var sql2 = "INSERT INTO subject VALUES('" + subID + "','" + req.body.subname + "','" + req.body.medium + "','" + req.body.hall + "','" + req.body.from + "','" + req.body.to + "','" + req.body.year + "','" + req.body.day + "','" + req.body.lecID + "','" + req.body.fee + "')";

                dbPool.query(sql2, (err, res2, cols) => {
                    if (err) throw err;

                    //Retrieve data to reload the table
                    var sql3 = "SELECT * FROM subject s where s.lecID='" + req.body.lecID + "'";
                    dbPool.query(sql3, (err, res4, cols) => {
                        if (err) throw err;
                        res.render("../views/admin/ajaxRegisterLecTableTemplate", { subjects: res4 });
                        res.end();
                    });
                });
            });


        }

    });




});

//delete subject
router.post("/delete/subject/:subID", function (req, res) {

    var subID = req.params.subID;
    var sql = "DELETE FROM subject WHERE subID='" + subID + "'";

    dbPool.query(sql, (err, res1, cols) => {
        if (err) throw err;
        var sql2 = "DELETE FROM assignment WHERE subID='" + subID + "'";

        dbPool.query(sql2, (err, res2, cols) => {
            if (err) throw err;
            var sql3 = "DELETE FROM enrolment WHERE subID='" + subID + "'";

            dbPool.query(sql3, (err, res1, cols) => {
                if (err) throw err;
            })
        })
    })
});

router.post("/register/subject/update", function (req, res) {

    var sql = "UPDATE subject SET subname='" + req.body.subname + "',medium='" + req.body.medium + "',hall='" + req.body.hall + "', fromTime='" + req.body.from + "' ,toTime='" + req.body.to + "',year='" + req.body.year + "',day='" + req.body.day + "',fee='" + req.body.fee + "' WHERE subID='" + req.body.subID + "'";

    dbPool.query(sql, (err, res1, cols) => {
        if (err)
            throw err;

        var sql2 = "SELECT * FROM subject s where s.lecID='" + req.body.lecID + "'";
        dbPool.query(sql2, (err, res2, cols) => {
            if (err) throw err;
            res.render("../views/admin/ajaxRegisterLecTableTemplate", { subjects: res2 });
            res.end();
        });

    });
});

router.post("/register/lecturer/class", function (req, res) {
    dbPoolsole.log(req.body);
});

router.post("/register/lecturer/new", function (req, res) {
    //Get the inserted values from the request body    
    var name = req.body.firstname + " " + req.body.lastname;
    var email = req.body.email;
    var nic = req.body.nic;

    //Form Lecturer ID     
    var nos;
    var lecID = "L-AKURA-";

    var sql = "select count(lecID) as numberOfLecturers from lecturer;";
    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;
        nos = parseInt(res2[0].numberOfLecturers, 10) + 1;
        //dbPoolvert string to decimal
        if (nos < 10) //Single digit num
            lecID = lecID + "00" + nos;
        else if (nos < 100) //Two digit num
            lecID = lecID + "0" + nos;
        else if (nos < 1000)
            lecID = lecID + "" + nos;

        //Insert Lecturer details into DB       
        var sql = "INSERT INTO lecturer (lecID,NIC,name,email) values (" + SqlString.escape(lecID) + "," + SqlString.escape(nic) + "," + SqlString.escape(name) + "," + SqlString.escape(email) + ");";
        dbPool.query(sql, function (err, result) {
            if (err) throw err;
        });

        //Form a random password to be sent to Lecturer by email    
        var randomPassword = randomstring.generate(10);
        //Encrypt the password using bcrypt
        bcrypt.hash(randomPassword, 10, function (err, hash) { //hash returns the encrypted password 
            var users = {             //saltRounds
                "username": lecID,
                "password": hash

            }

            //Insert user details into DB
            dbPool.query("INSERT INTO user SET ?", users, function (error, results, fields) {
                if (error) {
                    req.flash("error", "Please try again!");
                }
                else {
                    //Send login credentials to Lecturer                    
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'studentenrolmentnsbm@gmail.com',
                            pass: 'studentenrolmentnsbm123'
                        }
                    });
                    //Email dbPooltent
                    var mailOptions = {
                        from: 'studentenrolmentnsbm@gmail.com',
                        to: email,
                        subject: 'Login Credentails',
                        html: '<center><div><p>Welcome to Akura Institute.</p><p>Please enter the given credentials to login to Akura</p> <p>Username : <strong>' + lecID + '</strong></p> <p>Password : <strong>' + randomPassword + '</strong></p> <br></br> <a href="https://akura-nimesha.c9users.io/login" style="background-color:#a0e5f8;border:1px solid #0f4b66;border-radius:18px;color:#2f353e;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">Click Here To Proceed</a><p>We wish you all the very best.<br></br>Akura Team.</p></div><center>'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            req.flash("error", "Error occured. Please try again!");
                        }
                        else {
                            req.flash("success", "Lecturer added!");
                        }
                    });

                }
            });
        });

        res.render("admin/adminRegisterLecturer", { lecID: lecID });

    });
});


router.post("/register/alyear", function (req, res) {
    var sql = "SELECT distinct l.name, s.* FROM subject s, lecturer l where s.lecID=l.lecID and year='" + req.body.alyears.year + "'";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.render("../views/admin/ajaxRegisterTableTemplate", { subjects: res2 });
        res.end();
    });
});

//mark attendance page load
router.get("/attendance/:subject", isLoggedIn, function (req, res) {
    var subID = req.params.subject; //get subId by the url parameter

    var sql = "SELECT distinct s.subID, s.subname,s.year,st.name,st.stID FROM subject s,student st,enrolment e where e.subID=s.subID and s.subID='" + subID + "' and e.stID=st.stID;";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        if(!res2.length) {
            const sql = `SELECT subname, year FROM subject WHERE subID='${subID}'`;
            dbPool.query(sql, (err, res3, cols) => {
                res.render("admin/adminMarkAttendance", { subject: res3, moment: moment });
                res.end();
            });
            return;
        }
        res.render("admin/adminMarkAttendance", { subject: res2, moment: moment });
        res.end();
    });
});

//mark attendance via ajax requests
router.post("/markAttendance/:id", function (req, res) {
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var timeNow = dte.toJSON();
    dbPool.query("INSERT INTO attendance (stuID,subID,date) VALUES ('" + req.body.attendance.stID + "','" + req.body.attendance.class + "','" + timeNow + "');", function (error, results, fields) {
        if (error) {
            req.flash("error", "Please try again!");
        }
    });
});

//mremove attendance via ajax requests
router.delete("/markAttendance/:id", function (req, res) {
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var timeNow = dte.toJSON();
    dbPool.query("delete from attendance where stuID='" + req.body.attendance.stID + "' and subID='" + req.body.attendance.class + "' order by aID desc limit 1;", function (error, results, fields) {
        if (error) {
            req.flash("error", "Please try again!");
        }
    });
});


router.get("/newsfeeds", isLoggedIn, function (req, res) {
    //All posts are stored in sch_changes table
    var sql = "SELECT * from sch_changes order by created desc";

    //Get client machine's date & time
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var timeNow = dte.toJSON();

    dbPool.query(sql, (err, res2, cols) => {
        res.render("admin/adminNews", { posts: res2, moment: moment, time: timeNow });
    });
});

router.post("/newsfeed/new", function (req, res) {
    var title = req.body.blog.title;
    var dbPooltent = req.body.blog.body;

    //Getting client's time at which the POST request was sent
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var created = dte.toJSON();

    var sql = "INSERT INTO sch_changes (title,dbPooltent,created) VALUES (" + SqlString.escape(title) + "," + SqlString.escape(dbPooltent) + "," + SqlString.escape(created) + ");"
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.redirect("/admin/newsfeeds");
        res.end();
    });

});

router.post("/newsfeed/delete/:id", function (req, res) {
    var id = req.params.id;

    var sql = "DELETE FROM sch_changes where sch_ID=" + id + ";";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.redirect("/admin/newsfeeds");
    });


});


function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname: "invoice-generator.com",
        port: 443,
        path: "/",
        method: "POST",
        headers: {
            "dbPooltent-Type": "application/json",
            "dbPooltent-Length": Buffer.byteLength(postData)
        }
    };

    var file = fs.createWriteStream(filename);

    var req = https.request(options, function (res) {
        res.on('data', function (chunk) {
            file.write(chunk);
        })
            .on('end', function () {
                file.end();

                if (typeof success === 'function') {
                    success();
                }
            });
    });

    req.write(postData);
    req.end();

    if (typeof error === 'function') {
        req.on('error', error);
    }
}

//moves the $file to $dir2
var moveFile = (file, dir2) => {
    //include the fs, path modules
    var fs = require('fs');
    var path = require('path');

    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);

    fs.rename(file, dest, (err) => {
        if (err) throw err;
        else dbPoolsole.log('Successfully moved');
    });
};

module.exports = router;