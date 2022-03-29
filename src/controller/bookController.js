
const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const validator = require('../utils/validator')
const reviewModel = require('../model/reviewModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const createBook = async function (req, res) {
    try {
        let requestBody = req.body;
        if (Object.keys(requestBody).length == 0) {
            res.status(400).send({ status: false.valueOf, msg: `Invaild input. please vaild book detail` })
            return
        }
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt, isDeleted } = requestBody;

        if (!validator.isValidString(title)) {
            res.status(400).send({ status: false, msg: `title is required` })
            return
        }
        const isTitleUsed = await bookModel.findOne({ title })
        if (isTitleUsed) {
            res.status(400).send({ status: false, msg: `${title} already used` })
            return
        }

        if (!validator.isValidString(excerpt)) {
            res.status(400).send({ status: false, msg: `excerpt is requried` })
            return
        }
        if (!validator.isValidString(userId)) {
            res.status(400).send({ status: false, msg: `userId is required` })
            return
        }
        if (!validator.isValidString(ISBN)) {
            res.status(400).send({ status: false, message: `ISBN is required` })
            return
        }

        const isISBNUsed = await bookModel.findOne({ ISBN })
        if (isISBNUsed) {
            res.status(400).send({ status: false, msg: ` ${ISBN} already used` })
            return
        }
        if (!validator.isValidString(category)) {
            res.status(400).send({ status: false, msg: `category is requried` })
            return
        }
        if (!validator.isValidString(subcategory)) {
            res.status(400).send({ status: false, msg: `subcategory is required` })
            return
        }
        if(!validator.isValidString(releasedAt)){
            res.status(400).send({ status : false, msg: "released is requried"})
            return
        }
        if(!validator.isValidDate(releasedAt)){
            return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
        }
        
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(400).send({ status: false, msg: `User does not exit` })
            return
        }
        const bookdata = {
            title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt,
            isDeleted: isDeleted ? isDeleted : false,
            deletedAt: isDeleted ? new Date() : null
        }

        const newBook = await bookModel.create(bookdata)
        res.status(201).send({ status: true, msg: `New Book successfully created`, data: newBook })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createBook = createBook

//   /////////////////////////////////////////////////////////////////////////////////////////////////
     const getBook = async function (req,res){
         try{
             let filter = { isDeleted : false}
           let requestBody = req.query
            const{userId,category,subcategory} = requestBody
          if(req.query.userId){

               if(!validator.isValidObjectId(userId)){
                   res.status(400).send({ status : false, msg : "book detail not valid"})
                   return
               }
              filter [ "userId"] = userId
           }
           if(req.query.category){
               if(!validator.isValidString(category)){
               res.status(400).send({ status : false, msg : "book detail not vaild"})
               return
           }
           filter ["category"] = category
     }
       if(req.query.subcategory){
           if(!validator.isValidString(subcategory)){
               res.status(400).send({ status: false, msg : "book detail not vaild"})
               return
           }
           filter [ "subcategory"] = subcategory
       }
     let bookdata = await bookModel.find(filter).select({ _id : 1,title : 1, excerpt :1, userId:1,category:1,releasedAt:1,reviews:1})
     console.log(bookdata)
     if(bookdata.length == 0){
         res.status(400).send({ status: false, msg : "book deatil not vaild"}) 
         return
     }
     const bookDetail = bookdata.sort(function(a,b){
         if(a.title<b.title) {return -1};
         if(a.title>b.title)  {return 1};
          return 0;
         })
        res.status(200).send({ status: true, msg: "successfully book deatail", data: bookDetail})
        return
     }catch(error){
     res.status(500).send({status:false, msg:error.message})
 }
   }

        module.exports.getBook = getBook

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const getBookByReview = async function(req,res){
    try {
    let result = {}
    let review = []
    let BookId = req.params.bookId

    // if (!BookId)
    //     return res.status(400).send({ status: false, msg: "Please Provide BookId" })
console.log(BookId)

    let BookDetail = await bookModel.findOne({ _id: BookId})
    if (!BookDetail)
       return res.status(400).send({ status: false, msg: "BookId not Found" })
       if(BookDetail.isDeleted==true){return res.status(400).send({status:false,msg:"deleted document"})}

    let reviewDetails = await reviewModel.find({ BookId: BookDetail._id })
    if (!reviewDetails) {
         return res.status(400).send({ status: false, msg: "please provide review details" })
    }
    let bookData = {
        _id: BookDetail._id,
        title: BookDetail.title,
        excerpt: BookDetail.excerpt,
        userId: BookDetail.userId,
        category: BookDetail.category,
        subcategory: BookDetail.subcategory,
        reviews: BookDetail.reviews,
        deletedAt: BookDetail.deletedAt,
        releasedAt: BookDetail.releasedAt,
        createdAt: BookDetail.createdAt,
        updatedAt: BookDetail.updatedAt,

    }
    for (let i = 0; i < reviewDetails.length; i++) {
        result = {
            _id: reviewDetails[i]._id,
            reviewedBy: reviewDetails[i].reviewedBy,
            reviewedAt: reviewDetails[i].reviewedAt,
            rating: reviewDetails[i].rating,
            review: reviewDetails[i].review
        }
        review.push(result)
    }
    bookData["reviewsData"] = review
    console.log(bookData)
    res.status(200).send({ status: true, data: bookData })
}
catch (error) {
    console.log(error)
    res.status(500).send({ status: false, msg: error.message })
}
}

module.exports.getBookByReview =getBookByReview

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateBook = async function (req, res) {
    try {
        let Id = req.params.bookId;
        // console.log(Id)
        if(!validator.isValidObjectId(Id)){
        res.status(400).send({status : false, msg : "id is not valid"})
        }
        
        let { title, excerpt, releasedAt, ISBN } = req.body;

        if (!validator.isValidString(title)) {
            res.status(400).send({ status: false, msg: "title is required for updation" })
            return
        }
        const titleAlreadyUsed = await bookModel.findOne({ title });
        if (titleAlreadyUsed) {
            res.status(400).send("tittle alerady exist");
            return
        }
        if (!validator.isValidString(excerpt)) {
            res.status(400).send({ status: false, msg: "exceerpt is required for updation" })
            return
        }

        if (!validator.isValidString(ISBN)) {
            res.status(400).send({ status: false, msg: "ISBN is required for updation" })
            return
        }
        const ISBNAlreadyUsed = await bookModel.findOne({ ISBN });
        if (ISBNAlreadyUsed) {
            return res.status(400).send("ISBN is  alerady exist");
        }
        if (!validator.isValidString(releasedAt)) {
            res.status(400).send({ status: false, msg: "releasedAt is required for updation" })
            return
        }
        // if(!validator.isValidDate(reviewedAt)){
        //     return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
        // }

        let findBook = await bookModel.findById(Id);
        if(!findBook){res.status(400).send({ status : false, msg : "bookId not present in db"})}
        if (!findBook.isDeleted == false) {
            res.status(400).send("This Books Already Deleted")
        }
        let updateBook = await bookModel.findOneAndUpdate({ bookId: Id, isDeleted: false }, req.body, { new: true })
        res.send(updateBook);


    } catch (error) {
        res.status(500).send({ satus: false, msg: error.message });

    }
};

module.exports.updateBook = updateBook

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, msg: "bookId is not valid" })
            return
        }

        const book = await bookModel.findById(bookId);
        if (book.isDeleted == true) {
            res.status(400).send({ status: false, msg: "book is already deleted" })
            return
        }
        let deleteBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (validator.isValidString(deleteBook)) {
            res.status(200).send({ status: true, msg: " successfully delete content", data: "deleteBook"})
            return
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}
module.exports.deleteBookById = deleteBookById
