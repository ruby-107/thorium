
const { count } = require("console")
const orderModel = require("../models/orderModel")
const OrderModel= require("../models/orderModel")



const orderProduct= async function (req, res) {
    let Order = req.body
    let UserId = Order.User_id
    let ProductId = Order.product_id
    let orderCreated  = await orderModel.create(Order)
      res.send({msg : orderCreated})  
}



module.exports.orderProduct= orderProduct