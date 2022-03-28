const express = require('express');
const router = express.Router();


const userController =require('../controller/userController')
const bookController = require("../controller/bookController")
//const reviewController = require('../controller/reviewController')

router.post("/register" ,userController.createUser )

router.post("/login" ,userController.login)

router.post("/Books",bookController.createBook)

router.get("/Books",bookController.getBook)

router.put("/books/:bookId",bookController.updateBook)

  
//router.post("/books/:bookId",reviewController.addReview)

module.exports = router;
