const express = require("express");
const multer  = require('multer');
const upload = multer({ dest: 'public/images' });
const upload1 = multer();
const app = express();
const path = require("path");
const port = 3000;
const router = express.Router();
var mysql = require("mysql");
var ejs = require("ejs");
var bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+"/"));

/*
*	mysql connection stuff
*/
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123"
});

con.connect();


/*
* set the default database to mydb
*/
con.query("use mydb;", (err, result) => {if(err) throw err;});

/*
* creates a user if one does not already exist
*/
app.post("/", upload1.none(), (req, res, next) => {
	let username = req.body.username,
		password = req.body.password;
	console.log(username,password);
	con.query("SELECT * FROM users WHERE username=?;",username, (err, row) => {
		if(err) throw err;

		if(!row.length){
			con.query("INSERT INTO users(username, password) VALUES(?, ?);", [username,password], (err, result) =>{
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
	res.sendFile(path.join(__dirname+"/signup.html"));
	res.sendFile(path.join(__dirname,"/signup.html"));
});



app.listen(process.env.port || 3000);
console.log("Running at port 3000");
