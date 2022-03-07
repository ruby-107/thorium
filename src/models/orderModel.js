
//const { ObjectId } = require('mongoose');
const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema( {

       User_id: {
           type : ObjectId,
           ref : 'User1'
       },
       productId : {
           type : ObjectId,
           ref : 'Product'
       },
         amount : Number,
       isFreeAppUser : {
              type : Boolean,
              default : false
       },
    
        date : String
    },

 { timestamps: true });


module.exports = mongoose.model('order', orderSchema) //users




    