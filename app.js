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
/*
app.use(session({
    cookie: {
    	path: "/",
    	httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24
    },
    secret: "abc123"
}));
*/
app.use(session({secret: "ssshhhhh",saveUninitialized: true,resave: true}));
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
function sum(arr){
	let total = 0;
	for(item of arr){
		total += item.price;
	}
	return total;
}
app.get("/order", (req, res) => {
	const user = req.session.user;
    let text = "Log In", link = "login";
        
    if(user !== undefined){
        text = "Log Out";
        link = "logout";
        res.render("order", {
			login: text,
			link: link
		});
    }
    else{
    	res.redirect("/login");
    }
        

});
/*
* creates a user if one does not already exist
*/
app.post("/login", upload1.none(), (req, res, next) => {
	let name 	 = req.body.name,
		username = req.body.username,
		password = req.body.password;
	
	con.query("SELECT * FROM users WHERE username=?;",username, (err, row) => {
		if(err) throw err;
		if(name === "" || username === "" || password === ""){
			res.end("200");
		}
		else if(!row.length){
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
* checks if user account exists and the password matches the username continue to app, if not block user from entering
*/

app.get("/dress", (req, res, next) => {
	const queryObject = url.parse(req.url, true).query;
	console.log(req.session.user);
	if(Object.entries(queryObject).length !== 0 && queryObject.constructor !== Object){
		con.query("SELECT * FROM dress_info WHERE name = ?", queryObject.n, (err, result) => {
			if(err) throw err;
			res.render("dress", {
				src: result[0].src,
				name: result[0].name,
				p_id: Math.floor(Math.random() * Math.pow(10, 9))
			});
		});	
	}
	else{
		res.send("page not found");
		res.end();
	}
	
});
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
	//console.log(ssn.cart);
	console.log(req.session.user);
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
        const user = req.session.user;
        let text = "Log In", link = "login";
        
        if(user !== undefined){
        	text = "Log Out";
        	link = "logout";
        }
        

        res.render("index", {items: dress_info, login: text, link: link});

    });
});
app.get("/item", (req, res) => {
	console.log(req.session.user);
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
app.get("/account", (req, res) => {
	const user = req.session.user;
	console.log(user);
	console.log(req.session);
	let text = "Log In", link = "login";
	if(user !== undefined){
		text = "Log Out";
		link = "logout";
        
		res.render("account", {
			name: user.name,
			username: user.username,
			password: user.password,
			dress_choice: user.dress_choice,
			dress_size: user.dress_size,
			login: text,
			link: link

		});	
	}
	else{
		res.redirect("/login");
	}
	
});

app.get("/basket", (req, res) => {
	
	const queryObject = url.parse(req.url, true).query;
	const user = req.session.user;
	console.log(user);
	let text = "Log In", link = "login";
        
	if(user !== undefined){
		text = "Log Out";
		link = "logout";
	
		if(Object.entries(queryObject).length !== 0 && queryObject.constructor !== Object){
			con.query("SELECT * FROM dress_info WHERE name=?", queryObject.n, (err, r1) => { 
				if(err) throw err;
				con.query("SELECT * FROM cart WHERE id=?", queryObject.p_id, (err, r2) => {
					if(r2.length == 0){
						con.query("INSERT INTO cart(id, name, price,src, username) VALUES(?, ?, ?, ?, (\
						SELECT username FROM users WHERE username=?));", 
						[queryObject.p_id, r1[0].name, r1[0].price, r1[0].src, user.username], (err, r3) => {
							if(err) throw err;
						});
						
						con.query("SELECT * FROM cart WHERE username=?", user.username, (err, r4) => {
							
							res.render("basket", {
								login: text,
								link: link,
								cart_items: r4,
								total: sum(r4)
							});
						});

					}
				});
				
			});
		}
		else{
			con.query("SELECT * FROM cart WHERE username=?", user.username, (err, r4) => {
				console.log(r4);
				res.render("basket", {
					login: text,
					link: link,
					cart_items: r4,
					total: sum(r4)
				});
			});
		}
	}
	else{
		res.redirect("/login");
	}
});

app.get("/login", (req, res) => {
	res.render("login", {});
});
app.get("/logout", (req, res) =>{
	req.session.destroy();
	res.redirect("/");
});

app.get("/signup", (req, res) => {
	res.render("signup", {});
});

app.get("/complete", (req, res) => {
	const user = req.session.user;
	console.log(user);
	res.render("complete", {});
});
app.post("/basket", (req, res) => {
	const id = req.body.id;
	con.query("DELETE FROM cart WHERE id=?",id, (err, result) => {
		if(err) throw err;
		res.send();
	});
});
app.listen(process.env.port || 3000);
console.log("Running at port 3000");
