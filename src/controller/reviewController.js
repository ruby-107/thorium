

const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const validator = require('../utils/validator')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

const createReview = async function(req,res){
    try{
        let requestBody = req.body

        if(!validator.isValid(req.params.bookId) && (!validator.isValidObjectId(req.params.bookId))){
            res.status(400).send({ status: false, msg : "bookId is not valid"})
            return
        }
        if (Object.keys(requestBody).length === 0) {
            res.status(400).send({ status: false, msg: `Invalid request parameter. please fill detail.` })
            return
        }
        const { reviewedBy,rating, reviewedAt} = requestBody
        if(!validator.isValidString(reviewedBy)){
            res.status(400).send({ status: false, msg: "reviewdBy is required"})
            return
        }
        if(!validator.isValidString(reviewedAt)){
            res.status(400).send({ status: false, msg : "reviewed is required"})
            return
        }
        if(!validator.isValidDate(reviewedAt)){
            return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
        }
        
        if(!validator.isValidNumber1(rating)){
            res.status(400).send({ status: false, msg: "rating is required"})
            return
        }
        if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
            return res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })

        }

        const savedData = await reviewModel.create(requestBody)
        if(savedData){
        res.status(201).send({status: "review created" , savedData})
        return
        }else{
            res.status(400).send({status:false, msg: "plz enter data"})
        }
      }  catch(err){
        res.status(500).send({ status: false, msg: err.message})
    }
}
module.exports.createReview=createReview

///////////////////////////////////////////////////////////////////////////////////////////////////////////


const getReview=async function(req,res){
    try{
        let reviewcount=0

let getdata=await reviewModel.find().select({review:1,rating:1,reviewedBy:1})
console.log(getdata)
for(let i=0; i<getdata.length; i++){
 reviewcount++
}
console.log(reviewcount)
 getdata.push({reviewcount:reviewcount})
res.status(200).send({status:true,msg:"Sucess",data:getdata})}
catch(err){res.status(500).send({status:false,error:err.message})}
}

module.exports.getReview=getReview

////////////////////////////////////////////////////////////////////////////////////////////////

const updateReview = async function(req,res){
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let requestBody = req.body

        let book = await bookModel.findOne({ _id : bookId, isDeleted : false})
       if (!book){
            res.status(400).send({status : false,msg : "book is not available and book can't update"})
            return
        }
        let review1 = await reviewModel.findOne({ _id : reviewId,isDeleted: false})
        if(!review1){
            res.status(400).send({ status: false,msg : "review is not available and review can't update"})
            return
        }
        if(!validator.isValidRequestBody(requestBody)){
            res.status(400).send({status:false, msg: "please fill vaild detail"})
            return
        }
        let {reviewedBy,rating,review } = req.body

        if(!validator.isValidString(reviewedBy)){
            res.status(400).send({ status: false, msg: "reviewdBy is not vaild"})
            return
        }
        if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
         res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })
         return
        }
        if(!validator.isValidString(review)){
            res.status(400).send({ status: false, msg: "reviewd is not vaild"})
            return
         }
         let findReview = await reviewModel.findById(reviewId)
        if(!findReview){ res.satus(400).send({ status:false, msg: "reviewId is not present in db"})}
        if(findReview.isDeleted == true){
            res.satus(400).send({ status: false, msg: "This review is Already delete"})
        }
        let updatedReview = await reviewModel.findByIdAndUpdate({ _id : reviewId, isDeleted : false}, req.body,{new : true} )
        res.send(updatedReview)
} catch(err){
    res.status(500).send({ status: false, msg : err.message});
}
}
module.exports.updateReview=updateReview

