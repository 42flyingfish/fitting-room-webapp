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


var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123"
});
/*
con.connect((err) => {
	if(err) throw err;
	console.log("Connected!");
	con.query("use mydb;", (err, result) => {
		if(err) throw err;
	});
	con.query("INSERT INTO tbl(id, name) VALUES(333,'bob');", (err, result) => {
		if(err) throw err;
	});
	con.query("SELECT * FROM tbl;", (err, result) => {
		if(err) throw err;
		console.log(result);
	});
});
*/ 



app.post("/", upload1.none(), (req, res, next) => {
	console.log("pass");
	res.redirect("/");
});

app.post('/dress',upload1.none(), function (req, res, next) {
	con.connect((err) => {
		if(err) throw err;
		con.query("use mydb;", (err, result) => {
			if(err) throw err;
		});

		con.query("SELECT * FROM users WHERE username='"+req.body.username+"'", (err, result) => {
			if(err) throw err;
			// this is where validation goes

		});
	});
	res.redirect("/dress");
});



app.post('/dress', upload.single('chosenFile'), function (req, res, next) {
	const file = req.file;
	res.redirect('/dress');

});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname+"/index.html"));
	
});

app.get("/dress", (req, res) => {
	res.sendFile(path.join(__dirname+"/dress.html"));
});





app.listen(process.env.port || 3000);
console.log("Running at port 3000");
