const mongoose =  require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({

    userId:{ type:ObjectId, refs : "user", required:true, unique:true, trim:true },
    items:[{
        productId:{ type:ObjectId, refs :"Product",required:true,trim:true },
        quantity: { type: Number, required: true, minLen: 1 }}],
        totalPrice: { type: Number, required: true,trim:true },
        totalItems: {type: Number,required: true,trim:true },
        totalQuantity: {type:Number, require:true},       // comment: "Holds total number of items in the cart"},
        cancellable: {type: Boolean, default: true}, 
        status: {type:[String], default: 'pending', enum : ["pending", "completed", "cancled"]},
        deletedAt: {type: Date, default: null },
        isDeleted: {type: Boolean, default: false}               //when the document is deleted

    },    { timestamps: true });

module.exports = mongoose.model('Order',orderSchema )