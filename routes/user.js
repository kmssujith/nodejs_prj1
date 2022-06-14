
var mssql = require("mssql");
var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');

var connctDB = ({
	user: 'sa',
	password: 'abc123!@#',
	server: '10.10.30.20',
   database: "Sujith",
	options: {
		trustServerCertificate: true, // change to true for local dev / self-signed certs
		encrypt: false // for azure
	}
});

var db = new mssql.ConnectionPool(connctDB);

db.connect(function (err) {
	if (err) {
		throw err;
	} else {
		console.log("Connected port on 8080");
	 
	}
});
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      var password = post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mobile= post.mobile;
	  if(username !='' && password!='') {
		  var sql = "INSERT INTO users ( first_name , last_name , mobile , username , password ) VALUES ('" + fname + "','" + lname + "','" + mobile + "','" + username + "','" + password + "')";
        
		  var query = db.query(sql, function(err, result) {
			 message = "Your account has been created succesfully.";
			 res.render('signup.ejs',{message: message});
		  });
	  } else {
		  message = "Username and password is mandatory field.";
		  res.render('signup.ejs',{message: message});
	  }

   } else {
      res.render('signup');
   }
};
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var username = post.username;
      var password= post.password;
      
      var sql="SELECT id, first_name, last_name, username FROM users WHERE username ='"+username+"' and password = '"+password+"'";                           
      // console.log(sql);
      db.query(sql, function(err, results){ 
         // console.log(results)    
         // console.log(results.recordset)   
         if(results.recordset.length){
            req.session.userId = results.recordset[0].id;
            req.session.user = results.recordset[0].username;
            // console.log(results);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'You have entered invalid username or password.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};

           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log(userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM users WHERE id ='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {data:results});    
   });       
};

exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM users WHERE id='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result.recordset});
   });
};


exports.allcourse = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM course;";          
   db.query(sql, function(err, result){  
    
    //  var data = JSON.stringify(result.recordset)
      res.render('course.ejs',{course:result.recordset});
   });
};

// router.get('/', function (req, res) {
//    sql.connect(dbConfig.dbConnection()).then(() => {
//        return sql.query("SELECT * FROM StudentInfo;");
//    }).then(result => {
//        res.send(result.recordset);
//    }).catch(err => {
//        res.status(500).send("Something Went Wrong !!!");
//    })
// });
// exports.search = function async(req, res){
   
//    console.log("search.......................----")
//    console.log("xsaxs"+req.query.search)
//    var key = req.body.search;   
//     var sql= `SELECT * from course where coursename like '%${key}%'`;
//     console.log(sql);
//    db.query((sql, function(err, result){  
//       if (err) console.log(err);
//       res.render('course.ejs',{course:result.recordset});
//    }));
// };

exports.search = function async(req, res){
   new Promise((resolve, reject)=>{
      var key = req.body.search;   
    var sql= `SELECT * from course where coursename like '%${key}%'`;
    console.log(sql);
    db.query(sql, (err, result) => {
      if (err)
          console.log(err);        

res.render('course.ejs',{course:result.recordset});
     
  });
   })
   
};

// exports.search = function (req, res){
   
//       var key = req.body.search;   
//     var sql= `SELECT * from course where coursename like '%${key}%'`;
//     console.log(sql);
//     db.query(sql, (err, result) => {
//       if (err)
//           console.log(err);        

// res.render('course.ejs',{course:result.recordset});     
//   });
    
// };

// module.exports.searchDoc = function (key, callback) {
//    var query = `SELECT  *from doctor where first_name like '%${key}%' `;
//    console.log(query);
//    con.query(query, callback);
//      };

   //  router.post('/search',(req, res) => {
   //      //console.log("docc...........",result)
   //          var key = req.body.search;
   //          db.searchDoc(key, function (err, result) {
   //             console.log("search data............" , result.recordset);
   //             console.log("search data............" , result);
   //              res.render('doctors.ejs', { list: result.recordset });
   //          });
   //      });


exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};