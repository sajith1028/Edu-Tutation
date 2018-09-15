var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt          =   require("bcrypt");
var connection            =   mysql.createConnection({
                        host: "localhost",
                        user: "nimesha",
                        password: "",
                        database: "akura"
});

connection.query('USE akura');

module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		connection.query("select * from user where id = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });
    
    
// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with username
         usernameField : 'username',
         passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

		// find a user whose username is the same as the forms username
		// we are checking to see if the user trying to login already exists
        connection.query("select * from user where username = '"+username+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, req.flash('error', 'That email is already taken.'));
            } else {

				// if there is no user with that username
                // create the user
                var newUserMysql = new Object();
				
				newUserMysql.username    = username;
                newUserMysql.password = password; // use the generateHash function in our user model
			
				var insertQuery = "INSERT INTO user ( username, password ) values ('" + username +"','"+ password +"')";
				console.log(insertQuery);
				connection.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;
				
				return done(null, newUserMysql);
				});	
            }	
		});
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
            
        connection.query("SELECT * FROM user WHERE username = '" + username + "';",function(err,rows){
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