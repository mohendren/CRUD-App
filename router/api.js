const express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const appConfig = require('./../config/appConfig');
const errorConstants = require('./../constants/errorConstants');
const apiNameConstants = require('./../constants/apiNameConstants');
const {authorizeParent,getStudAttendance,authorizeTeacher,addAttendance} = require('./../util/userValidation');

router.use(function(req,res,next){
    var user = req.body;
    jwt.verify(user.token, user.email_id+appConfig.jwtKey ,function(err,decoded){
        if(err) { console.log(err); res.send({err : errorConstants.INVALID_REQUEST}) }
        if(decoded) next();
    })
});

router.post(apiNameConstants.GET_ATTENDANCE,function(req,res){
    var user = req.body;
    var result = authorizeParent(user.email_id,user.child_class,user.child_standard,user.child_rollno);
    if(result === true){
         getStudAttendance(user.child_rollno,user.child_class,user.child_standard).then(function (result){
             res.send(result)
         }, function(err){
             console.log('err:',err)
             res.send({err})
         })
        ;
    }else {
       res.send({err: errorConstants.USER_NOT_AUTHORIZED_GET})
    }
})


router.post(apiNameConstants.ADD_ATTENDANCE,function(req,res){
    var user = req.body;
    var result = authorizeTeacher(user.email_id,user.class,user.standard);
    if(result==true){
        addAttendance(user).then(function(response){
            res.send({'message' : 'successfully added '})
        },function(err){
            res.send({'Error ' : err})
        });
    }else {
        res.send({err: errorConstants.USER_NOT_AUTHORIZED_ADD})
    }

})


module.exports= router;
