const mongoose = require('mongoose');
//admin voterSchema
const CustomerSchema = mongoose.Schema({
name:{
  type: String,
  required: true
},
email:{
    type: String,
    required: true
},    
username:{
  type: String,
  required: true
},
password:{
  type: String,
  required: true
}});
//exporting
const Customer = module.exports = mongoose.model('Customer', CustomerSchema);
