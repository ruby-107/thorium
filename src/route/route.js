const express = require('express');
const router = express.Router();


const userController =require('../controller/userController')
const bookController = require("../controller/bookController")


router.post("/register" ,userController.createUser )

router.post("/login" ,userController.login)

router.post("/Books",bookController.createBook)

router.get("/Books",bookController.getBook)

module.exports = router;
