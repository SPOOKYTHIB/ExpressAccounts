const fs = require('fs');
var nJwt = require('njwt');
var secureRandom = require('secure-random');
var signingKey = secureRandom(256, {type: 'Buffer'});
var passwordHash = require('password-hash');
var json = `{"users":[]}`
var username = "TestUsername"
var email = "testmail@gmail.com"
var password = "TestPassword"
var obj = JSON.parse(json)
var encryptedPassword = passwordHash.generate(password)

function test() {
  // ====== PARTIE CREATE ===== //
  if (obj.users.length > 0) {
    var new_id = (obj.users[obj.users.length-1].id)+1
  } else {
    var new_id = 0
  }
  obj.users.push({"id": new_id, "username": username, "email": email, "password": encryptedPassword})
  json = JSON.stringify(obj)

  // ===== PARTIE LOGIN ===== //
  obj = JSON.parse(json)
  var user = obj.users.findIndex(item => item.email === email)
  if(user > -1) {
    if (passwordHash.verify(password, obj.users[user].password)) {
      var claims = {
    iss: "http://localhost:3000/",
    sub: obj.users[user].id
  }
  var jwt = nJwt.create(claims,signingKey)
  jwt.setExpiration(new Date('2021-10-01'))
  var token = jwt.compact()
  return token
}
  }
}

  module.exports = test;