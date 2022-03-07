const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {

  name : String,
  balance :  { 
  type: Number,
  default: 100
  }, 
    address : String,
    age : Number,
    gender : {
     type :String,
     enum : ["male","female","OTHER"]
    },
   isFreeAppUser : {
       type : Boolean,
       default : false
   }
   

}, {timestamps: true });

//     firstName: String,
//     lastName: String,
//     mobile: {
//         type: String,

//         required: true
//     },
//     emailId: String,
//     gender: {
//         type: String,
    //     enum: ["male", "female", "LGBTQ"] //"falana" will give an error
    // },
//     age: Number,
// }, { timestamps: true });

module.exports = mongoose.model('User1', userSchema) //users



// String, Number
// Boolean, Object/json, array