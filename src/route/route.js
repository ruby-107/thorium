const express = require('express');
const router = express.Router();


const userController =require('../controller/userController')
const bookController = require("../controller/bookController")
const reviewController = require('../controller/reviewController')



router.post("/register" ,userController.createUser )

router.post("/login" ,userController.login)

router.post("/Books",bookController.createBook)

router.get("/Books",bookController.getBook)

router.put("/books/:bookId",bookController.updateBook)

router.delete("/books/:bookId",bookController.deleteBookById) 

router.get("/books/:bookId",bookController.getBookByReview)

router.post("/books/:bookId/review",reviewController.createReview)

router.get("/review",reviewController.getReview)

router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

module.exports = router;
