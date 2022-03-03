const mongoose = require('mongoose');
const publisherModel = require('./publisherModel');
const ObjectId = mongoose.Schema.Types.ObjectId


       
const bookSchema = new mongoose.Schema( {
    name: String,
    author_id: {
        type: ObjectId,
        ref: "AuthorNew"
    },
    price: Number,
    ratings: Number,


    publisher_id:{
        type : ObjectId,
        ref : "publish"
    },
     isHardCover:{
         type:Boolean,
         default:false

    }
   //publisher : mongoose.Schema.Types.ObjectId

}, { timestamps: true });



module.exports = mongoose.model('LibraryBook', bookSchema)
