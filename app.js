var express = require('express')
var routes = require('./routes')
var user = require('./routes/user')
var naverouts = require('./routes/naverouts')
var pagination = require('./routes/pagination')
var ajaxsearch = require('./routes/ajaxsearch')
var view = require('./routes/view')
var http = require('http')
var path = require('path');
var session = require('express-session');
var app = express();
var mssql = require('mssql');
var bodyParser=require("body-parser");
// var connection = mssql.createConnection({
//               host     : 'localhost',
//               user     : 'root',
//               password : '',
//               database : 'coderszine_demo'
//             });

debugger
  var dbConfig = {
      user: "sa",
      password:"abc123!@#",
      server: "10.10.30.20",
      database: "Sujith",
      options: {
          encrypt: false,
          trustServerCertificate: true 
         }            
        }

var con = new mssql.ConnectionPool(dbConfig);

global.db = con;
 
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
app.get('/', routes.index);
app.get('/home/contact', naverouts);
app.get('/home/course', user.allcourse);
app.get('/home', user.dashboard);
app.get('/signup', user.signup);
app.post('/signup', user.signup);
app.get('/login', routes.index);
app.post('/login', user.login);
app.get('/home/dashboard', user.dashboard);
app.get('/home/logout', user.logout);
app.get('/home/profile',user.profile);
app.post('/home/search',user.search);
app.get('/home/pagination',pagination.pagi);
//app.get('/home/searchpag', pagination.searchpag);
app.post('/home/searchp', pagination.searchp);
app.get('/home/searchp',pagination.searchp);

app.get('/home/ajax',ajaxsearch.ajaxpag);
app.get('/home/ajaxsearch',ajaxsearch.ajaxs);

app.get('/home/view/:id',view.courseview);
           
app.listen(8080)
