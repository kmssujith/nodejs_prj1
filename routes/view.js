const express = require('express');
debugger
var mssql = require("mssql");
var router = express.Router();
var bodyParser = require('body-parser');
//const db = require('./connection');
var connctDB = ({
	user: 'sa',
	password: 'abc123!@#',
	server: '10.10.30.20',
    database: "Sujith",
	options: {
		trustServerCertificate: true, 
		encrypt: false
	}
});
var db = new mssql.ConnectionPool(connctDB);
db.connect(function (err) {
	if (err) {
		throw err;
	} else {
		console.log("Connected Port running 8080");
	 
	}
});

const app = express();

exports.courseview = function(req, res){
    console.log (req.params.id)
    console.log("entered course view")
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }

var sql = "SELECT * FROM course WHERE ID = " + req.params.id ;
console.log(sql)
db.query(sql, function(err, results){
    console.log(results.recordset)
    //res.send(results.recordset)
   res.render('view.ejs',{courseview:results.recordset})
} )
}