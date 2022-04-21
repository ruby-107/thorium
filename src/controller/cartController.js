

const cartModel= require('../Model/cartModel')
const productModel = require('../Model/productModel')
const userModel = require('../model/userModel')
const validator = require('../util/validator')




//////////////////////////////////////////////////////////////////////////////////////////////////////////
const createCart = async function(req, res) {
  try{
  let userId = req.params.userId;
  let userIdFromToken = req.userId;
  let data = req.body
  let items2 

  const findUser = await userModel.findById({ _id: userId })
  if (!findUser) {
      return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}` })
  }
  //Authentication & authorization
  if (findUser._id.toString() != userIdFromToken) {
      return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
  }
  
  if(!(validator.isValid(userId))&&(validator.isValidObjectId(userId))){
      return res.status(400).send({status:false, message:"Please provide a valid userId"})
  }
  if (!validator.isValidObject(data)) {
    return res.status(400).send({status: false, message: "Plaese Provide all required field" })
}
   let items = data.items
   if (typeof(items) == "string"){
      items = JSON.parse(items)
  }
   const isCartExist = await cartModel.findOne({userId:userId})
   let totalPrice = 0;
   if(!isCartExist){
      for(let i = 0; i < items.length; i++){
        let productId = items[i].productId
        let quantity = items[i].quantity
         let findProduct = await productModel.findOne({_id:productId,isDeleted:false});
         if(!findProduct){
          return res.status(400).send({status:false, message:"product is not valid or product is deleted"})
         }
         totalPrice = totalPrice + (findProduct.price*quantity)
       }
      let createCart = await cartModel.create({userId:userId,items:items,totalPrice:totalPrice,totalItems:items.length })
      
      return res.status(200).send({status:true,data:createCart})
   } if(isCartExist){
        items2 = isCartExist.items
   }
      let findProduct = await productModel.findOne({_id:items[0].productId,isDeleted:false})
      if(!findProduct){
        return res.status(400).send({status:false, message:"product is not valid"})
       }
     // res.send(findProduct)
      let totalPrice2 = findProduct.price
      let newquantity = items[0].quantity
      let flag = 0
      
         for(let i = 0; i < items2.length; i++){
             let productId = items2[i].productId
          if(productId == items[0].productId){
                 flag = 1
                 items2[i].quantity = items2[i].quantity + newquantity}
             
 }    totalPrice2 = Math.round(totalPrice2 * newquantity + isCartExist.totalPrice) 
      if(flag == 0){
          items2.push(items[0])
      }
     let updateCart = await cartModel.findOneAndUpdate({userId:userId},{$set:{items:items2,totalPrice:totalPrice2,totalItems:items2.length}},{new:true})
             return res.send(updateCart)
 }catch (error) {
  return res.status(500).send({ status: false, ERROR: error.message })
}
}
module.exports.createCart=createCart


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 const getCart = async (req, res) => {
    try {
      let userId = req.params.userId;
      let userIdfromToken = req.userId;
  
      if (!validator.isValidObjectId(userId))
        return res.status(400).json({ status: false, msg: "invalid userId in params" });
  
      let user = await userModel.findOne({ _id: userId });
      if (!user)
        return res.status(400).json({ status: false, msg: "no user found" });
  
      if (user._id.toString() !== userIdfromToken)
        return res
          .status(400).json({ status: false, msg: "user is not authorized" });
  
      let cart = await cartModel.findOne({ userId: userId });
  
      if (!cart)
        return res.status(400).json({ status: false, msg: "no cart found" });
  
      return res.status(200).send({ status: true, message: "successfully found cart.", data: cart });
    } catch (error) {
      return res.status(500).json({ status: false, msg: error.message });
    }
  };
  module.exports.getCart = getCart
// //////////////////////////////////////////////////////////////////////////////////////////////

const updateCart = async (req, res) => {
  try {
const userId = req.params.userId
     const { cartId, productId, removeProduct } = req.body
     const key = Object.keys(req.body)
     if (key == 0) {
         return res.status(400).send({ status: false, msg: "please enter some data" })
     }
     if (!validator.isValid(userId)) {
         return res.status(400).send({ status: false, msg: "userId is invalid" })
     }
     if (!validator.isValid(cartId)) {
         return res.status(400).send({ status: false, msg: "cartId is required" })
     }
     if (!validator.isValidObjectId(cartId)) {
         return res.status(400).send({ status: false, msg: "cartId is invalid" })
     }
     if (!validator.isValid(productId)) {
         return res.status(400).send({ status: false, msg: "productId is required" })
     }
     if (!validator.isValidObjectId(productId)) {
         return res.status(400).send({ status: false, msg: "productId is invalid" })
     }
     if (!validator.isValid(removeProduct)) {
         return res.status(400).send({ status: false, msg: "removeProduct is required" })
     }
     let cartData = await cartModel.findOne({ _id: cartId })
     if (!cartData) { return res.status(404).send({ status: false, msg: "cartData not found !" }) }

     // if (typeof removeProduct != 'number') {
     //     return res.status(400).send({ status: false, msg: "only number are allowed!" })
     // }

     if (removeProduct == 0) {
         let items = []
         let dataObj = {}
         let removePrice = 0
         for (let i = 0; i < cartData.items.length; i++) {
             if (cartData.items[i].productId != productId) {
                 return res.status(400).send({ status: false, msg: "product not found in the cart" })
             }
             if (cartData.items[i].productId == productId) {
                 const productRes = await productModel.findOne({ _id: productId, isDeleted: false }).select({_id:0,price:1})
                 console.log(productRes)
                 if (!productRes) { return res.status(400).send({ status: false, msg: "product not found !" }) }
                 removePrice = productRes.price * cartData.items[i].quantity
             }
             else{
             items.push(cartData.items[i])
             productPrice = cartData.totalPrice;
             }

         }
         productPrice = cartData.totalPrice - removePrice;
         
         dataObj['totalPrice'] = productPrice
         dataObj['totalItems'] = items.length
         dataObj['items'] = items
         const removeRes = await cartModel.findOneAndUpdate({ productId: productId }, dataObj, { new: true })
         return res.status(200).send({ status: true, message: "remove success", data: removeRes })

     }
     if (removeProduct == 1) {
         let dataObj = {}
         let item = []
         let itemPrice = 0
         for (let i = 0; i < cartData.items.length; i++) {
             if (cartData.items[i].productId != productId) {
                 return res.status(400).send({ status: false, msg: "product not found in the cart" })
             }
             if (cartData.items[i].productId == productId) {
                 const productRes = await productModel.findOne({ _id: productId, isDeleted: false }).select({ _id: 0, price: 1 })
                 if (!productRes) { return res.status(404).send({ status: false, msg: "product not found !" }) }
                 if(cartData.items[i].quantity == 1){
                     itemPrice = cartData.totalPrice - productRes.price
                 }
                 else{
                     item.push({productId:productId,quantity:cartData.items[i].quantity - 1})
                     itemPrice = cartData.totalPrice - productRes.price
                 }
                 console.log(productRes.price,itemPrice)
                 
             }
             else{
                 item.push(cartData.items[i])
             }


             let reduceData = await cartModel.findOneAndUpdate({ productId: productId },{totalPrice:itemPrice,totalItems:item.length,items:item}, { new: true })
             return res.status(200).send({ status: true, message: "success", data: reduceData })

         }

     }

     else {
         return res.status(400).send({ status: false, msg: "removeProduct field should be allowed only 0 and 1 " })
     }

 }catch (error) {
   return res.status(500).json({ status: false, msg: error.message });
 }
};
module.exports.updateCart=updateCart

//////////////////////////////////////////////////////////////////////////////////////////////
const deleteCart = async (req, res) => {
  try {
    let userId = req.params.userId;
    let userIdfromToken = req.userId;


    if (!validator.isValidObjectId(userId))
      return res.status(400).json({ status: false, msg: "invalid userId in params" });

    let user = await userModel.findOne({ _id: userId });
    if (!user)
      return res.status(400).json({ status: false, msg: "no user found" });

    if (user._id.toString() !== userIdfromToken)
      return res.status(400).json({ status: false, msg: "user is not authorized" });

    const findCart = await cartModel.findOne({ userId: userId });
    if (!findCart) {
      return res.status(400).send({status: false,message: `${userId} has no cart`});
    }
    let deleteChanges = await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 }, new: true }
    );

    return res.status(200).send({
      status: true, message: "successfully deleted cart.", data: deleteChanges, });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

module.exports.deleteCart =deleteCart
/////////////////////////////////////////////////////////////////////////////////////////////////
