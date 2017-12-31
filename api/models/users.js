
//importing mongoose to create Schema
const mongoose = require('mongoose');
//creaating mongodb Schema for user signup
const signupSchema = mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});
// exporting User model to use in any other module
module.exports = mongoose.model('User', signupSchema);
