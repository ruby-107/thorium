const express = require('express');
const router = express.Router();


const userController =require('../controller/userController')
const bookController = require("../controller/bookController")
const reviewController = require('../controller/reviewController')
const mid = require("../middleware/tokenMiddleware")


// post for user
router.post("/register" ,userController.createUser )

// post for login
router.post("/login" ,userController.login)

//post for book
router.post("/Books",mid.authentication, bookController.createBook)

//get for getBook
router.get("/Books", mid.authentication, bookController.getBook)

//put for updatebook
router.put("/books/:bookId", mid.authentication, mid.authorise, bookController.updateBook)

//delete for book
router.delete("/books/:bookId",mid.authorise,  bookController.deleteBookById) 

//get for getbookbyreview
router.get("/books/:bookId", mid.authentication, bookController.getBookByReview)

// post for create review
router.post("/books/:bookId/review",reviewController.createReview)

// put for updateReview
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

// delete for review
router.delete("/books/:bookId/review/:reviewId",reviewController.deletereview)

module.exports = router;
