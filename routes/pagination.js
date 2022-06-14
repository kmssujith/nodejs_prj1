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

const resultsPerPage = 5;

exports.pagi = function(req, res){
    var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

    let sql = 'SELECT * FROM course';
    db.query(sql, (err, result) => {
        console.log("ent")
        if(err) throw err;
        const numOfResults = result.recordset.length;
        if(numOfResults > 0)
        {
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if(page > numberOfPages){
            res.redirect('/home/pagination/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/home/pagination/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number          
        const startingLimit = (page - 1) * resultsPerPage;
             
          sql =  `SELECT * FROM course ORDER BY id OFFSET ${startingLimit} ROWS Fetch next ${resultsPerPage} rows only`; 
         
        db.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            console.log(result.recordset)
            res.render('pagination.ejs', {data: result.recordset, endingLink, page, iterator, numberOfPages});
           
        });
    }
    else
    {
        res.render('pagination.ejs', {error:"No Data Found"});
    }
       
})
};

  var key;
 exports.searchp = function(req, res){
    var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
    new Promise((resolve, reject)=>{
    if(req.body.search != null)
    {
     key = req.body.search;
    }
    var sql= `SELECT * from course where coursename like '%${key}%'`;
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log("ent")
        if(err) throw err;
        const numOfResults = result.recordset.length;
        if(numOfResults > 0)
        {      
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if(page > numberOfPages){
            res.redirect('/home/pagination/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/home/pagination/?page='+encodeURIComponent('1'));
        }
        //Determine the SQL LIMIT starting number          
        const startingLimit = (page - 1) * resultsPerPage;
        
       

        //sql =  `SELECT * FROM course ORDER BY id OFFSET ${startingLimit} ROWS Fetch next ${resultsPerPage} rows only`; 
       sql = `select * from course  where coursename like '%${key}%' ORDER BY id OFFSET ${startingLimit} ROWS Fetch next ${resultsPerPage} rows only`
      
         db.query(sql, (err, result)=>{
            if(err) throw err;
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            if(endingLink < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }
            res.render('pagination.ejs', {data: result.recordset, endingLink, page, iterator, numberOfPages});
        });
    }
    else
       res.render('pagination.ejs', {error: "No Data Found"})
       //  res.send("No Data Found");
    });
})
};



  