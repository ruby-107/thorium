
const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')


router.post("/register",userController.createUSer)
router.post("/login",userController.login)
router.get("/user/:userId",userController.getUserProfile)

module.exports = router
