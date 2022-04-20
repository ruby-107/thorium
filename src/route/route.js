
const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const middleware = require('../middleware/token')

///user///
router.post("/register",userController.createUSer)
router.post("/login",userController.login)
router.get("/user/:userId",middleware.auth,userController.getUserProfile)

router.put("/user/:userId",middleware.auth,userController.updateProfile)


////product///
router.post("/products",productController.createProduct)
router.get("/products/:productId",productController.getProductProfile)
router.put("/products/:productId",productController.updateProduct)
router.delete("/products/:productId",productController.productDel)
router.get("/products",productController.GetProducts)

/////cart

router.post("/users/:userId/cart",middleware.auth,cartController.createCart)
router.get("/users/:userId/cart",middleware.auth,cartController.getCart)

router.put("/users/:userId/cart",middleware.auth,cartController.updateCart)
router.delete("/users/:userId/cart",middleware.auth,cartController.deleteCart)


////order

router.put("/users/:userId/orders",middleware.auth,orderController.updateOrder)
router.post("/users/:userId/orders",middleware.auth,orderController.orderCreation)

module.exports = router
