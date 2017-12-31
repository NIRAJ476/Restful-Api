const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const jwt = require('jsonwebtoken');

//route for getting data by get request
router.get('/',verifyToken ,(req, res)=>{
  //verifying the token send by the user by using jwt verify method
  jwt.verify(req.token, 'secret', (err, authData)=>{
    if(err){
      return res.status(403).json({
        message:'Auth failed'
      });
    }else {
  Product.find()
  //filtering data by using select method
  .select('name price _id')
  .exec()
  .then(docs=>{
    //arrenging data in proper way
    const response={
      count:docs.length,
      //maping the data from the response object docs
      products:docs.map(doc=>{
        return{
        name:doc.name,
        price:doc.price,
        _id:doc._id,
        request:{
          type:'GET',
          //proving link to get info about single Product
          url:'http://localhost:3000/products/'+doc._id
        }
      }
      })
    }
    res.status(200).json(response);
  })
  .catch(err=>{
    res.status(500).json({
      error:err
    });
  });
}
});
}) ;

//route for getting single product
router.get('/:productId',verifyToken ,(req, res)=>{
  //verifying user token
  jwt.verify(req.token, 'secret', (err, authData)=>{
    if(err){
      return res.status(403).json({
        message:'Auth failed'
      });
    }else {
      //getting product id from parameter
      let id = req.params.productId;
      //getting product from database by using Product model and findById method by passing id
      Product.findById(id)
      .select('name price _id')
      .exec()
      .then(doc=>{
        res.status(200).json(doc);
      }).
      catch(err=>{
        res.status(500).json({
          error:err
        });
      });
    }
  });
}) ;

//route for posting product info to the api by using post request
router.post('/',verifyToken, (req, res)=>{
  //verifying user token
  jwt.verify(req.token, 'secret', (err, authData)=>{
    if(err){
      return res.status(403).json({
        message:'Auth failed'
      });
    }else {
      //creating Product model instance
      let product=new Product({
        name:req.body.name,
        price:req.body.price
      });
      //saving user product info into database
      product.save(err => {console.log(err);});
      res.status('200').json({
        message:'Created Product',
        product:product
      });
    }
  });
});

//route for making patch request
router.patch('/patch/:productId',verifyToken ,(req, res)=>{
  //verifying user token
  jwt.verify(req.token, 'secret', (err, authData)=>{
    if(err){
      return res.status(403).json({
        message:'Auth failed'
      });
    }else {
      let id = req.params.productId;
      //updating data requested by clients
      Product.findOneAndUpdate({_id:id}, {$set:{name:req.body.name, price:req.body.price}},{new:true})
      .select('name price _id')
      .exec()
      .then(result=>{
        res.status(200).json({
          message:'Updated product',
          product:result
        });
      })
      .catch(err=>{
        res.status(500).json({
          error:err
        });
      });
    }
  });
});

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
