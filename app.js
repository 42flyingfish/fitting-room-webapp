const express = require("express");
const multer  = require('multer');
const mysql = require("mysql");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const expressSession = require("express-session");
const path = require("path");
const cors = require("cors");
const url = require("url");

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
const port = 3000;
const router = express.Router();


app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+"/"));
app.use(expressSession({secret: "max", saveUninitialized: false, resave: false}));
app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
/*
*	mysql connection stuff
*/
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123",
	database: "mydb"
});

con.connect();
/*
* renders webstore
*/
app.get("/", (req, res) => {
    con.query("SELECT * FROM dress_info;",(err,result) => {
        if(err) throw err;

        let arr = [];
        let dress_info = [];
        for(let i = 0; i < result.length; i++) {
            arr.push(result[i]);
            if((i % 3  == 0 && i != 0) || i == result.length - 1) {
                dress_info.push(arr);
                arr = []
            }

        }
        res.render("index", {items: dress_info});

    });
});
/*
*	renders item view
*/
app.get("/item", (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    con.query("SELECT * FROM dress_info WHERE name=?;",queryObject.n, (err, result) => {
        if(err) throw err;
        res.render("item", {
           dress: {
                src: result[0].src,
                name: result[0].name,
                price: result[0].price
            }
        });
    });
    
});
/*
* creates a user if one does not already exist
*/
app.post("/login", upload1.none(), (req, res, next) => {
	let name 	 = req.body.name,
		username = req.body.username,
		password = req.body.password;
	console.log(username,password);
	con.query("SELECT * FROM users WHERE username=?;",username, (err, row) => {
		if(err) throw err;

		if(!row.length){
			con.query("INSERT INTO users(name, username, password) VALUES(?, ?, ?);", [name, username,password], (err, result) =>{
				if(err) throw err;
			});
			res.redirect("/login");
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
/*
app.post('/dress', upload.single('chosenFile'), function (req, res, next) {
	const file = req.file;
	res.redirect('/dress');

});
*/
app.get("/", (req, res) => {
	res.render("index", {});
	
});
app.get("/item", (req, res) => {
	res.render("item", {});
});
app.get("/login", (req, res) => {
	res.render("login", {});
});
app.get("/dress", (req, res) => {
	res.render("dress", {});
});

app.get("/signup", (req, res) => {
	res.render("signup", {});
});



app.listen(process.env.port || 3000);
console.log("Running at port 3000");
