
const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')
const middleware = require('../middleware/token')


router.post("/register",userController.createUSer)
router.post("/login",userController.login)
router.get("/user/:userId",userController.getUserProfile)
//router.put("/user/:userId",userController.userUpdateProfile)
router.put("/user/:userId",middleware.auth,userController.updateProfile)

module.exports = router
