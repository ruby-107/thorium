const mongoose = require('mongoose');
const publisherModel = require('./publisherModel');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema( {
    name: String,
    author_id: {
        type: ObjectId,
        ref: "author"
    },
    price: Number,
    ratings: Number,


    publisher_id:{
        type : ObjectId,
        ref : "publisher"
    }
   //publisher : mongoose.Schema.Types.ObjectId

}, { timestamps: true });


module.exports = mongoose.model('LibraryBook', bookSchema)
