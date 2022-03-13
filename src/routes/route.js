const express = require('express');
const router = express.Router();
const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const ProductController= require("../controllers/productController")
const orderController = require("../controllers/orderController")


let headCheck = function(req,res,next){
    let isFreeAppUser = req.headers["isfreeappuser"]
     
    if(isFreeAppUser != undefined){
      console.log("control goes to middleware")
    
        next();
    
}else{
    res.status(426).send("reqUEST MISSING")
}

}
router.post("/createProduct", ProductController.createProduct)

router.post("/createUser",headCheck, UserController.createUser)

router.post("/createOrder", orderController.createOrder)

module.exports = router;