const express = require('express');
const router = express.Router();
const Userbook= require("../models/bookModel.js")
const bookController= require("../controllers/bookController")




router.post("/createBook", bookController.createBook )
router.get("/getBooksData", bookController.getBooksData)
router.get("/getParticularBooks", bookController.getParticularBooks)
router.get("/getByRupees", bookController.getXINRBooks)
router.get("/getByYear", bookController.getByYear)
router.get("/getRandomBooks", bookController.getRandomBooks)



module.exports = router;