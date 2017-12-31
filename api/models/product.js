
//importing mongoose to create Schema
const mongoose = require('mongoose');
//creaating mongodb Schema for products
const productSchema =mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  }
});
// exporting Product model to use in any other module
module.exports = mongoose.model('Product', productSchema);
