var express = require("express");
var router = express.Router();
const dbPool = require("../config/database").connections;

//Ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.username.substring(0, 2) == "SA")) {
        return next();
    }
    req.flash("error", "Please login first")
    res.redirect("/login");
}

router.get("/", function (req, res) {
    var sql = "SELECT count(stID) as numOfStudents from student;";

    var sql2 = "SELECT count(lecID) as numOfLecturers from lecturer";

    var sql3 = "select subID, month ,sum(amount) as amount from payment where YEAR(date) = YEAR(CURDATE()) group by subID,month";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;

        dbPool.query(sql2, (err, res3, cols) => {
            if (err) throw err;

            dbPool.query(sql3, (err, res4, cols) => {
                if (err) throw err;

                res.render("superadmin/superAdminHome", { nos: res2, nol: res3, incomes: res4 });
            });
        });
    });
});

//Display income analysis
router.get("/income", isLoggedIn, function (req, res) {
    //Get income details sorted by year
    var sql = "select p.year,s.subname,s.year as ALyear,p.subID,p.month,sum(amount) as totalfee from payment p,subject s where s.subID=p.subID group by subID,month order by year;"
    dbPool.query(sql, (err, res2, cols) => {
        if (err)
            throw err;
        res.render("superadmin/superAdminIncome", { incomes: res2 });
        res.end();
    });
});

//Display results analysis
router.get("/results", isLoggedIn, function (req, res) {

    //Get all lecturers registered
    var sql = "SELECT lecID,name FROM lecturer";
    dbPool.query(sql, (err, res1, cols) => {
        if (err) throw err;

        //Get all subjects
        var sql1 = "SELECT subID,subname,year,lecID FROM subject";
        dbPool.query(sql1, (err, res2, cols) => {
            if (err) throw err;

            //Get the enrolments
            var sql2 = "SELECT * FROM enrolment";
            dbPool.query(sql2, (err, res3, cols) => {
                if (err) throw err;

                //Get student name & ID
                var sql3 = "SELECT stID, name FROM student";
                dbPool.query(sql3, (err, res4, cols) => {
                    if (err) throw err;

                    //Render the page
                    res.render("superadmin/superAdminResults", { lecturers: res1, subjects: res2, averages: res3, students: res4 });
                })
            })
        })
    })
});

module.exports = router;