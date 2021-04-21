// ==== IMPORTS ET CONFIGURATION DU SERVEUR ===== //

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

// ===== ROUTES ET FONCTIONS ===== //

app.route('/create')
  .get(function(req, res) {
    res.render('create')
})
  .post(function(req, res) {
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    // Si l'un des champs n'est pas complété, l'inscription est annulée.
    if (!username || !email || !password) {
      alert('Please fill in all fields.')
    } else {
      // Lit le fichier contenant les utilisateurs
      fs.readFile("users.json", function(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        // Le mot de passe est encrypté pour conserver la sécurité.
        var encryptedPassword = passwordHash.generate(password);
        // Si le fichier contient déjà des utilisateurs, l'identifiant est incrémenté.
        if (obj.users.length > 0) {
          new_id = (obj.users[obj.users.length-1].id)+1;
        //Sinon, il est réglé à 0.
        } else {
          new_id = 0
        }
        // Le nouvel utilisateur est envoyé dans le tableau de données...
        obj.users.push({"id": new_id, "username": username, "email": email, "password": encryptedPassword});
        // ...puis le contenu du fichier est actualisé.
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
  // Si l'un des champs n'est pas complété, la connexion est annulée.
  if (!email || !password) {
    alert('Please fill in all fields.')
  } else {
  // Lit le fichier contenant les utilisateurs
    fs.readFile("users.json", function(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data);
    // Cherche dans les données récupérées si un utilisateur avec l'email renseigné existe.
      var user = obj.users.findIndex(item => item.email === email)
    // Si l'utilisateur n'existe pas, l'index est égal à -1. Dans le cas contraire, la suite de la fonction peut être exécutée.
      if(user > -1) {
    // La version encryptée du mot de passe renseigné avec celle présente dans le fichier
        if (passwordHash.verify(password, obj.users[user].password)) {
          var claims = {
            iss: "http://localhost:3000/",
            sub: obj.users[user].id
          }
    // Le token JWT est créé et sa date d'expiration est réglée à une minute après sa création.
          var jwt = nJwt.create(claims,signingKey);
          jwt.setExpiration(new Date().getTime() + (60*1000));
          token = jwt.compact();
          alert('Logged in')
    // Le token est enregistré dans un cookie.
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
  // Le cookie est lu et stocké dans une variable
  token = req.cookies.jwt
  // S'il n'y a pas de token, l'accès est refusé à l'utilisateur.
  if (!token) {
    alert("You are not logged in.")
    res.end(res.render('connect'))
  // Sinon, la fonction continue...
  } else {
  // ...et vérifie que le token est valide et qu'aucune erreur ne survient.
    nJwt.verify(token,signingKey,function(err,verifiedJwt){
  /* En l'occurence, la seule erreur que j'ai rencontrée est celle de la date d'expiration. Il est donc admis
  ici qu'une erreur indique que le token est expiré. */
      if(err){
        alert("The JWT token has expired. Please log in again.")
        res.end(res.render('connect'))
  // Si le token est présent et qu'il ne comporte pas d'erreur, l'accès à la page est accordé.
      } else {
        res.render('restricted')
      }
    });
  }
})

app.listen(3000, () => {
  console.log('ExpressAccounts is now available at http://localhost:3000')
})