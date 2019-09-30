const express = require('express');
const app = express();
const http = require('http');
const api = require('./router/api');
const serverConstants = require('./constants/serverConstants');
const errorConstants = require('./constants/errorConstants');
const apiNamesConstants = require('./constants/apiNameConstants')
var jwt = require('jsonwebtoken');
const {validateUser} = require('./util/userValidation');
const appConfig = require('./config/appConfig');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/dist'))

app.get(apiNamesConstants.GET_USER_TOKEN,function(req,res){
   var user = req.body;
   var result  = validateUser(user.email_id, user.key)
      if(result) {
         const token =jwt.sign({data: user.email_id }, user.email_id+appConfig.jwtKey ,{ expiresIn: 60 * 60 });
         result.token = token;
         res.send({result});
      }
      else {
         res.send({ err: errorConstants.CHECK_YOUR_CREDENTIALS})
      }
   
});

app.use('/api', api);   

var server = http.createServer(app);

server.listen(serverConstants.PORT, ()=>{
   console.log( serverConstants.SERVER_START_MSG + serverConstants.PORT)
})