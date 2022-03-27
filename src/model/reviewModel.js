

const mongoose = require('mongoose');
const bookModel = require('./bookModel');
const ObjectId = mongoose.Schema.Types.ObjectId;


const reviewsSchema = new mongoose.Schema({

    bOOkId : { type : ObjectId, require : true, ref : bookModel, trim : true },
    reviewedBy : {type : String, required : true, default : 'Guest' , trim : true},
             // value: reviewer's name
    reviewedAt  : { type : Date, require : true, trim : true},
    rating : {type : Number, require : true, enum : [1,2,3,4,5]},
    review : { type : String, optional : true},
    isDeleted : {type : Boolean, default : false}

}, { timestamps : true})

module.exports = mongoose.model('review', reviewsSchema)