var LocalStrategy   =   require('passport-local').Strategy; //Login using local credentials
var bcrypt          =   require("bcrypt");
const dbPool        =   require("./database").connections;

//Select database
dbPool.query('USE akura');

module.exports = function(passport) { //Passport session setup

    //Determines which data of the user should be stored in session
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    //Fetches user object with the help of the key
    passport.deserializeUser(function(id, done) {
		dbPool.query("select * from user where id = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });
    
    //Local signup
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password
         usernameField : 'username',
         passwordField : 'password',
        passReqToCallback : true // allows to pass back the entire request to the callback
    },
    function(req, username, password, done) {

		// we are checking to see if the user trying to signup already exists
        dbPool.query("select * from user where username = '"+username+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, req.flash('error', 'That username already taken.'));
            } else {

				// if there is no user with that username
                // create the user
                var newUserMysql = new Object();
				
				newUserMysql.username    = username;
                newUserMysql.password = password; 
			
				var insertQuery = "INSERT INTO user ( username, password ) values ('" + username +"','"+ password +"')";
				console.log(insertQuery);
				dbPool.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;
				
				return done(null, newUserMysql);
				});	
            }	
		});
    }));

    //Local Login
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        dbPool.query("SELECT * FROM user WHERE username = '" + username + "';",function(err,rows){
    		if (err)
                return done(err);
    		if (!rows.length) {
                return done(null, false, req.flash('error', 'Incorrect username. Please try again!')); // req.flash is the way to set flashdata using connect-flash
            } 
    		
    		// if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('error', 'Incorrect password. Please try again!')); // create the loginMessage and save it to session as flashdata
    		
            // all is well, return successful user
            return done(null, rows[0]);			
		
		});
    }));
};