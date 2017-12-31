const express = require('express');
const products = require('./api/routes/products');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const image = require('./api/routes/thumbnail');
const userRoute = require('./api/routes/user');
const path = require('path');

//creating express object
const app = express();
//connecting mongodb by using connect method which takes path to the database
mongoose.connect('mongodb://localhost/products');
//creating connection object
const db = mongoose.connection;
//checking if database is connected successfully or not by using connection object
db.once('open', ()=>{
  console.log('connected to database');
});
//checking if there is any error in database connection
db.on('error', (error)=>{
  console.log(error);
});
//home route to the api
app.get('/', (req, res)=>{
  res.send('Welcome in to this api you can test your front end by using this api.');
});

//bodyParser middleware is used to parse json and urlencoded clients data
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//express static middleware is used to provide static folder in use
//path.join is used to provide directory path which is to be used
app.use('/uploads/',express.static(path.join(__dirname,'uploads')));

//this middleware is for allowing browsers to use this api
//it also specifying the different type of functionality of the api like get, post, put, patch etc.
app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  if(req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
})
//these middlewares are used to routes different modules used in this api
app.use('/products', products);
app.use('/uploads', image);
app.use('/user', userRoute);

//this middleware is to handle errors
app.use((req, res, next)=>{
  const error=new Error('Not found');
  error.status=404;
  next(error);
});
//this middleware is also used for handling errors
app.use((error, req, res, next)=>{
  res.status=(error.status || 500);
  res.json({
    message:{
      message:error.message
    }
  });
})
//exporting app module to use in other modules
module.exports = app;
