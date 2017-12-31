
//importing mongoose to create Schema
const mongoose = require('mongoose');
//creaating mongodb Schema for image thumbnail
const imageSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  }
});
// exporting Image model to use in any other module
module.exports = mongoose.model('Image', imageSchema);
