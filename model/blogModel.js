const mongoose = require("mongoose")
const validator = require("validator")
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author"
    },
    tags: [String],

    category: {
        type: [String],
        required: true,
    },

    subCategory: [String],

    deletedAt: { type: Date },

    isDeleted: {
        type: Boolean,
        default: false
    },

    isPublished: {
        type: Boolean,
        default: false
    },


}, { timestamps: true })
module.exports = mongoose.model("Blog", blogSchema)