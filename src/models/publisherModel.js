const mongoose = require('mongoose');


const PublishSchema = new mongoose.Schema( {
    
    name: String,
    head_Quarter:String

}, { timestamps: true });

module.exports = mongoose.model('publish', PublishSchema)