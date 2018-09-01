var express         =   require("express");
var router          =   express.Router();

router.get("/",function(req, res) {
    res.render("student/studentHome");
});

router.get("/profile", function(req,res){
    res.render("student/studentProfile");
});

router.get("/payments", function(req,res){
    res.render("student/studentPayment");
});

router.get("/content", function(req,res){ 
    res.render("student/studentContent");
});

router.get("/newsfeeds", function(req,res){
    res.render("student/studentNewsfeed");
});


module.exports = router;