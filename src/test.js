const testfunction = require('./testFile');
var nJwt = require('njwt');
var secureRandom = require('secure-random');
var signingKey = secureRandom(256, {type: 'Buffer'});
var passwordHash = require('password-hash');
var encryptedPassword = passwordHash.generate("TestPassword")
var obj = JSON.parse(`{"users":[{"id":0,"username":"TestUser","email":"testmail@gmail.com","password":"${encryptedPassword}"}]}`)

test('Log as an user whose email is mail@mail.com and password is password', () => {
  var claims = {
    iss: "http://localhost:3000/",
    sub: obj.users[0].id
  }
  var jwt = nJwt.create(claims,signingKey)
  jwt.setExpiration(new Date('2021-10-01'))
  var token = jwt.compact()
  expect(testfunction()).toBe(nJwt.verify(token,signingKey,function(err,verifiedJwt){
        if(err){
          throw err
        } else {
          return verifiedJwt
        }
      }));
});