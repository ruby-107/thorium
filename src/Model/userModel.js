const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   
    fname: {type:String, require:true,trim:true },
    lname : { type:String,require:true ,trim:true},
    email : {type:String,require:true,trim:true,unique:true},   //vaild email
    profileImage:{type:String,require:true,trim:true},     // s3 link
    phone: { type:String,require:true,unique:true, trim:true},     // vaild phone
    password : { type:String, unique:true,trim:true,required:true}, // encrypted password
    address: {
        shipping: {
          street: {type:String,require:true,trim:true},
          city: {type:String,require:true,trim:true},
          pincode: {type:Number,require:true,trim:true,maxLen: [6, "Password length should not be greater than 6"] }
        },
   billing: {
            street:{ type:String, require:true},
            city: {type:String,require:true},
            pincode: {type:Number,require:true, maxLen: [6, "Password length should not be greater than 6"]}
           
          }
    }, 
   },   {timestamps:true})   

      module.exports = mongoose.model('user', userSchema)   