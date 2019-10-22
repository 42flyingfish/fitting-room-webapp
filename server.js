const express = require("express");
const multer  = require('multer')
const upload = multer({ dest: 'public/images' })
const app = express();
const path = require("path");
const port = 3000;
const router = express.Router();
var mysql = require("mysql");
var ejs = require("ejs");
/*
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: ""
});
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

app.post('/', upload.single('chosenFile'), function (req, res, next) {

})


router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname+"/index.html"));
});

app.use(express.static(__dirname+"/public"));


app.use("/", router);
app.listen(process.env.port || 3000);
console.log("Running at port 3000");
