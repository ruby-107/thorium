const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const cart = new mongoose.Schema({
    userId:{
        type:ObjectId,
        refs : "user",
        required:true,
        unique:true,
        trim:true
    },
    items:[{
        productId:{
            type:ObjectId,
            refs :"Product",
            required:true,
        },
        quantity: {
             type: Number,
              required: true,
               minLen: 1 
            }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
    
}, {timestamps:true})

module.exports = mongoose.model('Cart',cart )