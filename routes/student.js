var express         =   require("express");
var router          =   express.Router();

router.get("/",function(req, res) {
    res.render("student/studentHome");
});


router.get("/profile", function(req,res){
    console.log(req.user);
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