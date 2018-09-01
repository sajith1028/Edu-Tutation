var express         =   require("express");
var router          =   express.Router();

router.get("/",function(req, res) {
    res.render("lecturer/lecturerHome");
});

router.get("/profile", function(req,res){
    res.render("lecturer/lecturerProfile");
}); 

router.get("/income", function(req,res){
    res.render("lecturer/lecturerIncome");
});

router.get("/classes", function(req,res){
    res.render("lecturer/lecturerClasses");
});

router.get("/newsfeeds", function(req,res){
    res.render("lecturer/lecturerNewsfeed");
});

module.exports = router;