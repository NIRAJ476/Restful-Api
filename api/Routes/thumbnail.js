const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const jwt = require('jsonwebtoken');
const gm = require('gm');

//route for post request of image thumbnail
router.post('/',verifyToken, (req, res, next)=>{
    //verifying user token
     jwt.verify(req.token, 'secret', (err, authData)=>{
       if(err){
         return res.status(403).json({
           message:'Authorization Failed'
         });
       }else {
            // creating Image model instance for getting image data
           let image = new Image({
             name:req.body.name,
             image:req.body.image
           });
           //saving image data into database
           image.save(err=>{console.log(err);});
           //giving the response to the post request
           res.status(200).json({
             message:'Image thumbnail',
             image:image
           });
       }
    });
}) ;

//creating method to get token from the user data
function verifyToken(req, res, next){
  //getting authorization bearerHeader from headers
   const bearerHeader = req.headers['authorization'];
   //checking if bearerHeader is not null or undefined
   if(typeof bearerHeader !== 'undefined'){
     //spliting token and bearer by using split method
     //it return an array
     let bearer = bearerHeader.split(' ');
     //getting bearerToken from bearer array
     const bearerToken=bearer[1];
     //assigning token to request object
     req.token = bearerToken;
     //this middleware is to go to next step or method or..
      next();
   }else{
     //returning error if bearerHeader is undefined
     return res.status(403).json({
       message:'forbidden'
     });
   }
}
//exporting this module to use in other modules
module.exports = router;
