// var express         =   require("express");
// var router          =   express.Router();
// var bcrypt          =   require("bcrypt");
// var mysql           =   require("mysql");
// var con             =   mysql.createConnection({
//                         host: "localhost",
//                         user: "nimesha",
//                         password: "",
//                         database: "akura"
// });

// var sess;

// router.post("/",function(req,res){
//   var username = req.body.username;
//   var password = req.body.password;
  
//   sess=req.session;
//   sess.username=username;
  
  
//   con.query("SELECT * FROM users where username=?",[username],function (error, results, fields){
//       if(error){
//           res.json({
//               status:false,
//               message:"there is some error with the query"
//           })
//       }else{
//           if(results.length>0){
//               //Compare the entered password with the one that is hashed in the DB
//               bcrypt.compare(password, results[0].password, function(err, res2) {
//               if(res2) {
//                     // Passwords match
//                     res.render("admin/adminHome");
//               } else {
//                   // Passwords don't match
//                     res.json({
//                       status:false,
//                       message:"Email & password do not match"
//                   });
//              } 
//             });
            
//           }
//           else{
//               res.json({
//                   status:false,
//                   message:"Email does not exist"
//               });
//           }
//       }
//   });
// });

// router.get("/", function(req,res){
//     res.render("login");
// });

// module.exports = router;