const mongoose = require('mongoose')
//const validator = require('validator')


const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        requried: true
    },
    title: {
        type:String,
        enum: ['Mr', 'Mrs', 'Miss']
    },
    email: {
        type:String,
        unique: true
        // validate(val) {
        //     if (!validator.isEmail(val)) {
        //         throw new Error("Invalid emailid")
        //     }
        
      
    },
    password: {
        type: String,
        requried: true
    }

}, { timestamps: true })
module.exports = mongoose.model('AuthPoject1', authorSchema)
