const path = require('path')
const express = require('express')
const router = express.Router()
const layout = require('express-layout')
const cookieParser = require("cookie-parser")
const app = express()
const fs = require('fs');
var nJwt = require('njwt');
var secureRandom = require('secure-random');
const alert = require('alert')
const postCreate = require('./js/postCreate')
const bodyParser = require('body-parser')
var signingKey = secureRandom(256, {type: 'Buffer'});
var passwordHash = require('password-hash');
var token
var obj

app.set('view engine', 'pug')
const middlewares = [
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded({extended: false})
]
app.use(middlewares)

app.get('/', (req, res) => {
    res.render('index')
})

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.route('/create')
  .get(function(req, res) {
    res.render('create')
})
  .post(function(req, res) {
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    if (!username || !email || !password) {
      alert('Please fill in all fields.')
    } else {
      fs.readFile("users.json", function(err, data){
        if (err){
            console.log(err);
        } else {
        var obj = JSON.parse(data);
        var encryptedPassword = passwordHash.generate(password);
        if (obj.users.length > 0) {
          new_id = (obj.users[obj.users.length-1].id)+1;
        } else {
          new_id = 0
        }
        obj.users.push({"id": new_id, "username": username, "email": email, "password": encryptedPassword});
        fs.writeFile("users.json", JSON.stringify(obj), function(err){
          if(err) throw err;
        });
    }})
      alert("Registered successfully.")
    }
    res.end(res.render('index'))
})

app.route('/connect')
  .get(function(req, res) {
    res.render('connect')
})
  .post(function(req, res) {
    res.redirect('/login', 'post')
  })

app.post('/login', (req, res) => {
  var email = req.body.email
  var password = req.body.password
  if (!email || !password) {
    alert('Please fill in all fields.')
  } else {
    fs.readFile("users.json", function(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data);
      var user = obj.users.findIndex(item => item.email === email)
      if(user > -1) {
        if (passwordHash.verify(password, obj.users[user].password)) {
          var claims = {
            iss: "http://localhost:3000/",
            sub: obj.users[user].id
          }
          var jwt = nJwt.create(claims,signingKey);
          jwt.setExpiration(new Date().getTime() + (60*1000));
          token = jwt.compact();
          alert('Logged in')
          res.cookie('jwt', token);
          res.end(res.render('index'))
        } else {
          alert ('Wrong password')
          res.end(res.render('connect'))
        }
      } else {
        alert ('This user does not exist.')
        res.end(res.render('connect'))
      }
    }
  })
  }
})

app.get('/restricted', (req, res) => {
  var token = req.cookies.jwt
  if (!token) {
    alert("You are not logged in.")
    res.end(res.render('connect'))
  } else {
    nJwt.verify(token,signingKey,function(err,verifiedJwt){
      if(err){
        alert("The JWT token has expired. Please log in again.")
        res.end(res.render('connect'))
      } else {
        res.render('restricted')
      }
    });
  }
})

app.listen(3000, () => {
  console.log('ExpressAccounts is now available at http://localhost:3000')
})