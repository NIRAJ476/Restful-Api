
const express = require('express');
const router = express.Router();
const User = require('../models/users');
//bcrypt module is used to encrypt data and jwt is requiring to generate token
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//route for signup for the new users
router.post('/signup', (req, res)=>{
  //checking if email is already exist
  User.find({email:req.body.email})
  .exec()
  .then(user=>{
    //ckecking if more then one data is getting in response
    if(user.length>=1){
      res.status(509).json({
        message:'Email exist'
      });
    }else{
      //encrypting password using bcrypt hash function
      bcrypt.hash(req.body.password,10, (err, hash)=>{
          if(err){
            return res.status(500).json({
              error:err
            });
          }else{
           // creating User model instance to take data from client
            let user = new User({
             //parsing data by using bodyParser
              email:req.body.email,
              password:hash
            });
            //saving the data into mongodb database
            user.save(err=>{console.log(err);});
            res.status(200).json({
              message:'User created'
            });
          }
        });
    }
  });
});

//route for getting token by loging using email and password
router.post('/authToken', (req, res)=>{
  //getting user signup data by matching signin email with signup email
  User.findOne({email:req.body.email})
  .exec()
  .then(user=>{
    //ckecking if data is not found
    if(user.length<1){
      return res.status(401).json({
        message:'Auth Failed'
      });
    }else{
      //using compare method to compare signin password with signup password and returning true
      //if it is as a result in callback
       bcrypt.compare(req.body.password, user.password, (err, result)=>{
         if(err){
           return res.status(401).json({
             message:'Auth Failed'
           });
         }
         if(result){
           //generating token if compare method return true by using jwt sign method by passing required data
           const token=jwt.sign(
             {
               email:user.email,
               id:user._id
             },
             'secret',
            {
              expiresIn:'2h'
            }
          );
          //giving the token as a response in json format
          res.status(200).json({
            message:'Congratulations your token is generated',
            token:token
          });
         }
       });
    }
  })
})
//exporting router module to use in othor modules
module.exports = router;
