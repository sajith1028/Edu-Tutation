var express = require("express");
var router = express.Router();
var passport = require('passport');
const dbPool = require("../config/database").connections;
var SqlString = require('sqlstring');
var bcrypt = require("bcrypt");

router.post("/login", passport.authenticate("local-login", { failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "You logged in!");
    if (req.user.username.charAt(0) == 'A')
        res.redirect("/admin");
    else if (req.user.username.substring(0, 2) == "SA")
        res.redirect("/superadmin");
    else if (req.user.username.charAt(0) == 'S')
        res.redirect("/student");
    else if (req.user.username.charAt(0) == 'L')
        res.redirect("/lecturer");

});

router.get("/login", function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.username.charAt(0) == 'A')
            res.redirect("/admin");
        else if (req.user.username.substring(0, 2) == "SA")
            res.redirect("/superadmin");
        else if (req.user.username.charAt(0) == 'S')
            res.redirect("/student");
        else if (req.user.username.charAt(0) == 'L')
            res.redirect("/lecturer");

        return;
    }
    res.render("login");
});

router.get("/", function (req, res) {
    // Select all the classes
    var sql = "SELECT s.*, l.* from subject s, lecturer l where s.lecID=l.lecID order by l.name;";
    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
        res.render("landing", { 'classes': res2 });
        res.end();
    });
});

router.get("/register", function (req, res) {
    res.render("register");
});

//Setting up admin accounts
router.post("/register", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    //dbPoolvert the password to a hash
    bcrypt.hash(password, 10, function (err, hash) { //hash dbPooltains the encrypted password 
        var users = {
            "username": username,
            "password": hash
        }

        //insert  details into the db
        dbPool.query("INSERT INTO user SET ?", users, function (error, results, fields) {
            if (error) {
                res.json({
                    status: false,
                    message: "there is some error with the query"
                })
            }
            else {
                res.json({
                    status: true,
                    data: results,
                    message: "user registered successfully"
                })
            }
        });

    });
});

router.get('/logout', (req, res) => {
    if(!req.user) {
        res.redirect("/");
        return;
    }
    var dte = new Date();
    dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
    var created = SqlString.escape(dte.toJSON());
    var createdDate = created.substr(0, created.length - 6) + "'";

    var sql = "update user set lastLogin=" + createdDate + " where username='" + req.user.username + "';";

    dbPool.query(sql, (err, res2, cols) => {
        if (err) throw err;
    })

    req.logout();
    req.flash("success", "You logged out!");
    res.redirect("/");
});

module.exports = router;