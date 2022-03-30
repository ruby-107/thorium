

const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const validator = require('../utils/validator')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

const createReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookid = req.params.bookId

        if (!validator.isValid(bookid) && (!validator.isValidObjectId(bookid))) {
            res.status(400).send({ status: false, msg: "bookId is not valid" })
            return
        }
        let checkBookID = await bookModel.findById(bookid)
        console.log(checkBookID)
        if (!checkBookID) {
            res.status(404).send({ status: false, msg: "book not found" })
            return
        }
        if (checkBookID.isDeleted == true) { return res.status(404).send({ status: false, msg: "this book is already delete" }) }

        if (Object.keys(requestBody).length === 0) {
            res.status(400).send({ status: false, msg: `Invalid request parameter. please fill detail.` })
            return
        }
        const { reviewedBy, rating, reviewedAt, bookId } = requestBody
        if (!validator.isValidString(reviewedBy)) {
            res.status(400).send({ status: false, msg: "reviewdBy is required" })
            return
        }
        if (!validator.isValidString(reviewedAt)) {
            res.status(400).send({ status: false, msg: "reviewed is required" })
            return
        }
        if (!validator.isValidDate(reviewedAt)) {
            return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
        }

        if (!validator.isValidNumber1(rating)) {
            res.status(400).send({ status: false, msg: "rating is required" })
            return
        }
        if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
            return res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })

        }
        if (bookid != requestBody.bookId) { return res.status(400).send({ status: false, msg: "pathparam bookid and body bookid is diffrent" }) }


        const savedData = await reviewModel.create(requestBody)
        let reviewcount = 0

        let getdata = await reviewModel.find().select({ review: 1, rating: 1, reviewedBy: 1, isDeleted: 1 })
        console.log(getdata)
        for (let i = 0; i < getdata.length; i++) {
            if (getdata[i].isDeleted != true) {
                reviewcount++
            }

        }
        getdata.unshift({ reviewcount: reviewcount })

        res.status(201).send({ status: true, data: getdata })
    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports.createReview = createReview

///////////////////////////////////////////////////////////////////////////////////////////////////////////




const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let requestBody = req.body

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            res.status(400).send({ status: false, msg: "book is not available and book can't update" })
            return
        }
        let review1 = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review1) {
            res.status(400).send({ status: false, msg: "review is not available and review can't update" })
            return
        }
        console.log(review1)
        if (!(review1._id == reviewId && review1.bookId == bookId)) { return res.status(400).send({ status: false, msg: "bookid and reviewid are of diffrent review document" }) }
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, msg: "please fill vaild detail" })
            return
        }
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, msg: "please fill vaild detail" })
            return
        }
        let { reviewedBy, rating, review } = req.body

        if (!validator.isValidString(reviewedBy)) {
            res.status(400).send({ status: false, msg: "reviewdBy is required" })
            return
        }
        if (!validator.isValidString(review)) {
            res.status(400).send({ status: false, msg: "review required" })
            return
        }
        if (rating)
            if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
                res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })
                return
            }


        let updatedReview = await reviewModel.findByIdAndUpdate({ _id: reviewId, isDeleted: false }, req.body, { new: true })
        res.send(updatedReview)
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports.updateReview = updateReview


////////////////////////////////////////////////////////////////////////////////////////////////////////////////



let deletereview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, msg: "bookId is not valid" });
            return;
        }

        if (!validator.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, msg: "reviewId is not valid" });
            return;
        }

        //const review = await reviewModel.findById(reviewId);
        let checkbookId = await bookModel.findById(bookId);
        if (!checkbookId) {
            return res
                .status(404)
                .send({ status: false, msg: "Book with this Id not found" });
        }
        let checkreviewId = await reviewModel.findById(reviewId);
        if (!checkreviewId) {
            return res
                .status(404)
                .send({ status: false, msg: "review with this Id not found" });
        }
        console.log(checkreviewId);
        if (checkreviewId.isDeleted == true) {
            res.status(400).send({ status: false, msg: "review is already deleted" });
            return;
        }
        console.log(checkreviewId);
        if (!(checkreviewId._id == reviewId && checkreviewId.bookId == bookId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "bookid and reviewid are of diffrent object",
                });
        }
        let deleteReview = await reviewModel.findByIdAndUpdate(
            { _id: reviewId },
            { isDeleted: true },
            { new: true }
        );
        // if (!validator.isValidString(deleteReview)) {
        res
            .status(200)
            .send({
                status: true,
                msg: " successfully delete content",
                data: deleteReview,
            });

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: "server error" });
    }
};

module.exports.deletereview = deletereview