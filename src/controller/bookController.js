
const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const validator = require('../utils/validator')
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

const getBook = async function (req, res) {
    try {
       
        let queryParams = req.query;
       const { userId, category, subcategory } = queryParams;
        let filterQuery = { isDeleted: false, ...queryParams }
    

   
     if(userId.length == 0 || userId){
    console.log(userId.length)
        if (!validator.isValidString(userId )) {
            res.status(400).send({ status: false, msg: "user Id is required" })
            return
        }}
        if (!validator.isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: " userId is vaild!" })
            return
        }
    
    
  //  if(category.length >= 0 ){
    
        if(category.length == 0 || category){
            console.log(category)
        if (!validator.isValidString(category)) {
            res.status(400).send({ status: false, msg: "category can not empty" })
            return
        }
    }
       // if(subcategory.length >= 0){
           if(subcategory.length == 0 || subcategory){ 
               console.log(subcategory)
        if (!validator.isValidString(subcategory)) {
            res.status(400).send({ status: 400, msg: "subcategory ca not empty" })
            return
        }
    }




        // if (validator.isValidRequestBody(queryParams)) {
        //     const { userId, category, subcategory } = queryParams;

        //     if (validator.isValid(userId) && validator.isValidObjectId(userId)) {
        //         filterQuery["userId"] = req.query.userId
        //     }
        //     if (validator.isValid(queryParams)) {
        //         filterQuery["category"] = req.query.category
        //     }
        //     if (validator.isValid(queryParams)) {
        //         filterQuery["subcategory"] = req.query.subcategory
        //     }
            let Book = await bookModel.find(filterQuery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

            if (Book.length === 0) {
                return res.status(404).send({ status: false, message: "No book found" });
            }
            res.status(200).send({ status: true, message: "Book list", data: Book });
        
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }

}

module.exports.getBook = getBook
