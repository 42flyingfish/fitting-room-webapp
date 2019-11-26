const express = require("express");
const multer  = require('multer');


// Setting for how multer will handle the files
const dest = multer.diskStorage({
        // Destination for where the files will be uploaded too
        destination: function(req, res, cb) {
                cb(null, 'public/images')
        },
        // Setting for the name of the newly created file
        // Currently set to save as the field name plus the original upload name
        // There is an issue that files can overwrite eachother
        filename: function(req, file, cb) {
                cb(null, file.fieldname + '-' + file.originalname)
        }
});
const upload = multer({ storage: dest })

const upload1 = multer();
const app = express();
const path = require("path");
const router = express.Router();
const mysql = require("mysql");
// var ejs = require("ejs");
// var bodyParser = require("body-parser");
//var cv = require("opencv4node");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+"/"));

/*
*	mysql connection stuff
*/

var con = mysql.createConnection({
	host: process.env.RDS_HOSTNAME,
	user: process.env.RDS_USERNAME,
	password: process.env.RDS_PASSWORD,
	port : process.env.RDS_PORT,
	database : process.env.RDS_DB_NAME
});

con.connect(function(err) {
	if (err) {
		console.log("Failed to connect to Database" + err.stack);
		return;
	}
		console.log("Successful connection");
});

/*
 * creates a user if one does not already exist
 */
app.post("/", upload1.none(), (req, res, next) => {
	let name 	 = req.body.name,
		username = req.body.username,
		password = req.body.password;
	console.log(username,password);
	con.query("SELECT * FROM users WHERE username=?;",username, (err, row) => {
		if(err) {
			console.log("failed to add a user");
			throw err;
			return;
		}

		if(!row.length){
			con.query("INSERT INTO users(name, username, password) VALUES(?, ?, ?);", [name, username,password], (err, result) =>{
				if(err) throw err;
			});
			res.redirect("/");
		}
		else{
			res.status(200);
			res.end("Username already exists, choose another username.");
		}
	});

});
/*
 * checks if user account exists and the password matches the username continue to app, if not block user from entering
 */
/*
app.post('/dress',upload1.none(), function (req, res, next) {
	let username = req.body.username,
		password = req.body.password;
	con.query("SELECT * FROM users WHERE username=? AND password=?",[username,password], (err, row) => {
		if(err) throw err;
		if(!row.length){
			res.status(200);
			res.end("The information entered is incorrect.");
		}
		else{
			res.redirect("/dress");
		}

	});


});
*/

/*
 * uploads files to server
 */

app.post('/dress', upload.single('chosenFile'), function (req, res, next) {
	const file = req.file;
	res.redirect('/dress');

});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname,"/index.html"));

});

app.get("/dress", (req, res) => {
	res.sendFile(path.join(__dirname,"/dress.html"));
});

app.get("/signup", (req, res) => {
	res.sendFile(path.join(__dirname,"/signup.html"));
});



app.listen(process.env.PORT || 8080);
console.log("Running at port ", process.env.PORT || 8080);
