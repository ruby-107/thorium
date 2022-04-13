
const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const middleware = require('../middleware/token')


router.post("/register",userController.createUSer)
router.post("/login",userController.login)
router.get("/user/:userId",userController.getUserProfile)
//router.put("/user/:userId",userController.userUpdateProfile)
router.put("/user/:userId",middleware.auth,userController.updateProfile)



router.post("/products",productController.createProduct)

router.get("/products/:productId",productController.getProductProfile)
router.put("/products/:productId",productController.updateProduct)
router.delete("/products/:productId",productController.productDel)

module.exports = router
