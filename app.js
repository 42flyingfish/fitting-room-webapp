const express = require("express");
const multer  = require('multer');
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const url = require("url");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

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
const upload = multer({ storage: dest });
const upload1 = multer();
const app = express();
const port = 3000;
const router = express.Router();


app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+"/"));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(session({
    cookie: {
    	path: "/",
    	httpOnly: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    },
    secret: "abc123"
}));

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
app.post("/order", (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    con.query("SELECT * FROM dress_info WHERE name=?;", queryObjec.n, (err, result) => {
        const dress = result[0];
        con.query("INSERT INTO order(order_id, name, price, username) VALUES (?, ?, ?, ?);",
        [, dress.name, dress.price, ], (res, req) => {

        });
    });
});
*/
/*
*	renders item view
*/

/*
* creates a user if one does not already exist
*/
app.post("/login", upload1.none(), (req, res, next) => {
	let name 	 = req.body.name,
		username = req.body.username,
		password = req.body.password;
	
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
			res.end("100");
		}
	});
	
});
/*
app.get("/dress", (req, res) => {
	const queryObject = url.parse(req.url, true).query;
	if(Object.entries(queryObject).length !== 0 && queryObject.constructor !== Object){
		con.query("SELECT * FROM dress_info WHERE name = ?", queryObject.n, (err, result) => {
			if(err) throw err;
			res.render("dress", {
				src: result[0].src
			});
		});	
	}
	else{
		res.send("Page not found");
		res.end();
	}
});
*/
/*
* checks if user account exists and the password matches the username continue to app, if not block user from entering
*/
app.get("/dress", (req, res, next) => {
	const queryObject = url.parse(req.url, true).query;
	console.log(req.session.user);
	if(Object.entries(queryObject).length !== 0 && queryObject.constructor !== Object){
		con.query("SELECT * FROM dress_info WHERE name = ?", queryObject.n, (err, result) => {
			if(err) throw err;
			res.render("dress", {
				src: result[0].src
			});
		});	
	}
	else{
		res.send("page not found");
		res.end();
	}
	
})
app.post("/", upload1.none(), function (req, res, next) {
	let username = req.body.username,
		password = req.body.password;
	con.query("SELECT * FROM users WHERE username=? AND password=?",[username,password], (err, row) => {
		if(err) throw err;
		req.session.user = row[0];
		if(!row.length){
			res.status(200);
			res.end("The information entered is incorrect.");
		}
		else{
			res.redirect("/login");
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
app.get("/item", (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    if(Object.entries(queryObject).length !== 0 && queryObject.constructor !== Object){
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
    }
    else{
    	res.send("Page not found");
    	res.end();
    }
});
app.get("/login", (req, res) => {
	res.render("login", {});
});


app.get("/signup", (req, res) => {
	res.render("signup", {});
});



app.listen(process.env.port || 3000);
console.log("Running at port 3000");
