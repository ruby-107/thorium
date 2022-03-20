const mongoose = require('mongoose')
const validator = require('validator')


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
        unique:true,
         type: String,
         required: true,
         match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
     },

    password: {
        type: String,
        requried: true,
        match:[/^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[0-9a-zA-Z]).{8,}$/,"Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"]

    
}

}, { timestamps: true })
module.exports = mongoose.model('AuthPoject1', authorSchema)
