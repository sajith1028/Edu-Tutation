var express         =   require("express");
var router          =   express.Router();

router.get("/",function(req, res) {
    res.render("superadmin/superAdminHome");
});

router.get("/income", function(req,res){
    res.render("superadmin/superAdminIncome");
});

router.get("/payments", function(req,res){
    res.render("superadmin/superAdminResults");
});




module.exports = router;