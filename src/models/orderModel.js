const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema( {

    userId:{
        type: ObjectId,
        ref: "newUser"
    } ,
    productId: {
        type: ObjectId,
        ref: "Product"
    },
    
    amount: Number,
    isFreeAppUser:{

        type: Boolean,
        default:true
    }, 
    date: String
    })


    module.exports = mongoose.model('Purchase',orderSchema)