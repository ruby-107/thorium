
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

        let userId = req.query.userId;
        let { category, subcategory } = req.query

        if (!userId && !category && !subcategory) {
            let book = await bookModel.find({ isDeleted: false }).select({ book_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            if (!book) res.status(404).send({ status: false, msg: "Book not found" })

            return res.status(200).send({ status: true, message: book })
        }


        if (userId || category || subcategory) {

            let sortedBooks = await bookModel.find({
                $and: [{ isDeleted: false }, {
                    $or: [{ userId: userId, isDeleted: false },
                    { category: category }, { subcategory: subcategory }]
                }]
            })
                .sort({ "title": 1 })


            return res.status(200).send({ status: true, msg: sortedBooks })
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

// const getBook = async (req, res) => {
//     try {
//         let filter = {
//             isDeleted: false
//         }
//         if (req.query.userId) {

//             if (!(validator.isValid(req.query.userId) && validator.isValidObjectId(req.query.userId))) {
//                 return res.status(400).send({ status: false, msg: "userId is not valid" })
//             }
//             filter["userId"] = req.query.userId
        
//         }
//         if (req.query.category) {

//             if (!validator.isValidString(req.query.category)) {
//                 return res.status(400).send({ status: false, message: 'Book category is not valid ' })
//             }
//             filter["category"] = req.query.category
//         }
//         if (req.query.subcategory) {

//             if (!validator.isValidString(req.query.subcategory)) {
//                 return res.status(400).send({ status: false, message: 'Book subcategory is not valid' })

//             }
//             filter["subcategory"] = req.query.subcategory
//         }
//         let book = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

//         if (book.length > 0) {
//             return res.status(200).send({ status: true, message: "book  list", data: book })

//         } else {
//             return res.status(404).send({ status: false, message: "no such book found !!" })

//         }
//     } catch (err) {
//         console.log(err)
//         res.status(500).send({ status: false, error: err.message })
//     }
// }

module.exports.getBook = getBook


// const getBook = async function (req, res) {
//     try {
//    let queryParams = req.query;
//          const { userId, category, subcategory } = queryParams;

//          let filterQuery = { isDeleted: false, ...queryParams }

//          if(userId.length == 0 ){

//             if (!validator.isValidString(userId )) {
//                 res.status(400).send({ status: false, msg: "user Id is required" })
//                 return
//             }}
//             if (!validator.isValidObjectId(userId)) {
//                 res.status(400).send({ status: false, msg: " userId is vaild!" })
//                 return
//             }


//   if(category.length = 0 ){

//         if (!validator.isValidString(category)) {
//             res.status(400).send({ status: false, msg: "category can not empty" })
//             return
//         }
//     }
//     
//            if(subcategory.length == 0 ){ 
//                console.log(subcategory)
//         if (!validator.isValidString(subcategory)) {
//             res.status(400).send({ status: 400, msg: "subcategory ca not empty" })
//             return
//         }
//     }




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


//             let Book = await bookModel.find(filterQuery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

//             if (Book.length === 0) {
//                 return res.status(404).send({ status: false, message: "No book found" });
//             }
//             res.status(200).send({ status: true, message: "Book list", data: Book });

//     } catch (error) {
//         res.status(500).send({ status: false, Error: error.message });
//     }

// }



//module.exports.getBook = getBook
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




const updateBook = async function (req, res) {
    try {
        let Id = req.params.bookId;
        console.log(Id)
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

        let findBook = await bookModel.findById(Id);
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

// const deleteBookById = async function (req, res) {
//     try {
//      let Id = req.params.bookId
//      if(!validator.isValidString(Id) && !validator.isValidObjectId(Id)){
//      res.status(400).send({ status : false, msg : "bookId is not valid"})
//      return
//     }

//     const book = await bookModel.findOne({ Id : req.params.bookId, isDeleted : false})
//     if(!book){
//         res.status(400).send({ status : false, msg : "book not found"})
//         return
//     }
// }
