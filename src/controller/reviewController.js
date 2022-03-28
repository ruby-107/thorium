

const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const validator = require('../utils/validator')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

// const bookReview = async function(req,res){
//     try{
//         if(!validator.isValid(req.params.bookId) && (!validator.isValidObjectId(req.params.bookId))){
//             res.status(400).send({ status: false, msg : "bookId is not valid"})
//             return
//         }
//           if(!validator.isValidRequestBody())
//     }
// }

const addReview = async (req, res) => {
    try {
        if (!(validator.isValid(req.params.bookId) && (validator.isValidObjectId(req.params.bookId))) ){
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        
        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: ' Review body is empty' })

        }
        let { reviewedBy, rating, review } = req.body

        if (!validator.isValid(reviewedBy) && !validator.isValid(review) && !validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: "Please enter the valid data" })
        }
        let book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (book) {

            req.body["bookId"] = req.params.bookId
            req.body["reviewedAt"] = new Date()

            let review = await reviewModel.create(req.body)

            let ReviewCount = await reviewModel.find({ bookId: req.params.bookId }).count()
            console.log(ReviewCount)

            let countUpdate = await bookModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: ReviewCount })

            return res.status(201).send({ status: true, msg: "Thank you for Reviewing the book !!", addedReview: review })

        } else {
            return res.status(404).send({ status: true, msg: "no such book exist to be review" })


        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })

    }
}
module.exports.addReview = addReview    