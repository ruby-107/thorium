const mongoose = require("mongoose")
const validator = require("validator")

const authorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: [true, "Already in use"],
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Invalid emailid")
            }
        }
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model("Author", authorSchema)