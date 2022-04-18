

const cartModel= require('../Model/cartModel')
const productModel = require('../Model/productModel')
const userModel = require('../model/userModel')
const validator = require('../util/validator')




//////////////////////////////////////////////////////////////////////////////////////////////////////////
const createCart = async function(req, res) {
  let userId = req.params.userId
  let items2 
  if(!(validator.isValid(userId))&&(validator.isValidObjectId(userId))){
      return res.status(400).send({status:false, message:"Please provide a valid userId"})
  }
  if (req.userId != req.params.userId)
     return res.status(401).json({ status: false, msg: "Authorised user to create cart" });

   let items = req.body.items
   let userId2 =req.body.userId
   const isCartExist = await cartModel.findOne({userId:userId})
  /// res.send(isCartExist)
   let totalPrice = 0;
   if(!isCartExist){
      for(let i = 0; i < items.length; i++){
        let productId = items[i].productId
        let quantity = items[i].quantity
         let findProduct = await productModel.findById(productId)
         totalPrice = totalPrice + (findProduct.price*quantity)
       }
      // if (req.userId != req.params.userId) { return res.status(400).send({ status: false, msg: "pathparam userId and body userId is diffrent" }) }
       
      let createCart = await cartModel.create({userId:userId2,items:items,totalPrice:totalPrice,totalItems:items.length })
       items2 = createCart.items
      return res.status(200).send({status:true,data:createCart})
   } if(isCartExist){
        items2 = isCartExist.items
   }
      let findProduct = await productModel.findById(items[0].productId)
       console.log(findProduct.price)
     // res.send(findProduct)
      let totalPrice2 = findProduct.price
      let newquantity = items[0].quantity
      let flage = 0
      
         for(let i = 0; i < items2.length; i++){
             let productId = items2[i].productId
          if(productId == items[0].productId){
                 flage = 1
                 items2[i].quantity = items2[i].quantity + newquantity}
             

 }    totalPrice2 = totalPrice2 + isCartExist.totalPrice
      if(flage == 0){
          items2.push(items[0])
      }
     let updateCart = await cartModel.findOneAndUpdate({userId:userId2},{$set:{items:items2,totalPrice:totalPrice2,totalItems:items2.length}},{new:true})
             return res.send(updateCart)
 
 
 }
 module.exports.createCart=createCart



///////////////////////////////////////////////////////////////////////////////////////////////

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


// const createCart = async function (req, res) {
//    try {
//         const userId = req.params.userId
//        const requestBody = req.body; 
//         const productId = requestBody;
//         const quantity= requestBody
//         let userIdFromToken = req.userId;

//         //validating starts.
//         if (!validator.isValidRequestBody(requestBody)) {
//             return res.status(400).send({ status: false, message: "Please provide valid request body" })
//         }

//         if (!validator.isValidObjectId(userId)) {
//             return res.status(400).send({ status: false, message: "Please provide valid User Id" })
//         }
//         // if (!validator.isValidObjectId(productId) || !validator.isValid(productId)) {
//         //     return res.status(400).send({ status: false, message: "Please provide valid Product Id" })
//         // }
//        // console.log(productId)

//         if (!validator.isValid(quantity) || !validator.validQuantity(quantity)) {
//             return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." })
//         }
//         //validation ends.

//         const findUser = await userModel.findById({ _id: userId })
//         if (!findUser) {
//             return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}` })
//         }

//         //Authentication & authorization
//         if (findUser._id.toString() != userIdFromToken) {
//             return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
//         }

//         const findProduct = await productModel.findById({ _id: req.body.productId, isDeleted: false })
//         console.log(findProduct)
//         if (!findProduct) {
//             return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}` })
//         }

//         const findCartOfUser = await cartModel.findOne({ userId: userId }) //finding cart related to user.

//         if (!findCartOfUser) {

//             //destructuring for the response body.
//             var cartData = {
//                 userId: userId,
//                 items: [{
//                     productId:productId ,
//                     quantity: quantity,
//                 }],
//                 totalPrice: findProduct.price * quantity,
//                 totalItems: 1
//             }

//             const createCart = await cartModel.create(cartData)
//             return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
//         }

//         if (findCartOfUser) {

//             //updating price when products get added or removed.
//             let price = findCartOfUser.totalPrice + (req.body.quantity * findProduct.price)
//             let itemsArr = findCartOfUser.items

//             //updating quantity.
//             for (i in itemsArr) {
//                 if (itemsArr[i].productId.toString() === productId) {
//                     itemsArr[i].quantity += quantity


//                     let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }

//                     let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

//                     return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
//                 }
//             }
//             itemsArr.push({ productId: productId, quantity: quantity }) //storing the updated prices and quantity to the newly created array.

//             let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
//             let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

//             return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
//         }
//     } catch (err) {
//         res.status(500).send({ status: false, data: err.message });
//     }
// }
// module.exports.createCart= createCart
// /////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

const updateCart = async function (req, res) {
  try {
      let userId = req.params.userId
      let requestBody = req.body;
      let userIdFromToken = req.userId;

      //validation starts.
      if (!validator.isValidObjectId(userId)) {
          return res.status(400).send({ status: false, message: "Invalid userId in body" })
      }

      let findUser = await userModel.findOne({ _id: userId })
      if (!findUser) {
          return res.status(400).send({ status: false, message: "UserId does not exits" })
      }

      //Authentication & authorization
      if (findUser._id.toString() != userIdFromToken) {
          return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
      }

      //Extract body
      const { cartId, productId, removeProduct } = requestBody
      if (!validator.isValidRequestBody(requestBody)) {
          return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide cart details.' })
      }

      //cart validation
      if (!validator.isValidObjectId(cartId)) {
          return res.status(400).send({ status: false, message: "Invalid cartId in body" })
      }
      let findCart = await cartModel.findById({ _id: cartId })
      if (!findCart) {
          return res.status(400).send({ status: false, message: "cartId does not exists" })
      }

      //product validation
      if (!validator.isValidObjectId(productId)) {
          return res.status(400).send({ status: false, message: "Invalid productId in body" })
      }
      let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!findProduct) {
          return res.status(400).send({ status: false, message: "productId does not exists" })
      }

      //finding if products exits in cart
      let isProductinCart = await cartModel.findOne({ items: { $elemMatch: { productId: productId } } })
      if (!isProductinCart) {
          return res.status(400).send({ status: false, message: `This ${productId} product does not exists in the cart` })
      }

      //removeProduct validation either 0 or 1.
      if (!(!isNaN(Number(removeProduct)))) {
          return res.status(400).send({ status: false, message: `removeProduct should be a valid number either 0 or 1` })
      }

      //removeProduct => 0 for product remove completely, 1 for decreasing its quantity.
      if (!((removeProduct === 0) || (removeProduct === 1))) {
          return res.status(400).send({ status: false, message: 'removeProduct should be 0 (product is to be removed) or 1(quantity has to be decremented by 1) ' })
      }

      let findQuantity = findCart.items.find(x => x.productId.toString() === productId) //returns object

      if (removeProduct === 0) {
          let totalAmount = findCart.totalPrice - (findProduct.price * findQuantity.quantity) // substract the amount of product*quantity

          await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } } }, { new: true })

          let quantity = findCart.totalItems - 1
          let data = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { totalPrice: totalAmount, totalItems: quantity } }, { new: true }) //update the cart with total items and totalprice

          return res.status(200).send({ status: true, message: `${productId} is been removed`, data: data })
      }

      // decrement quantity
      let totalAmount = findCart.totalPrice - findProduct.price
      let itemsArr = findCart.items

      for (i in itemsArr) {
          if (itemsArr[i].productId.toString() == productId) {
              itemsArr[i].quantity = itemsArr[i].quantity - 1

              if (itemsArr[i].quantity < 1) {
                  await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } } }, { new: true })
                  let quantity = findCart.totalItems - 1

                  let data = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { totalPrice: totalAmount, totalItems: quantity } },
                      { new: true }) //update the cart with total items and totalprice

                  return res.status(200).send({ status: true, message: `No such quantity/product exist in cart`, data: data })
              }
          }
      }
      let data = await cartModel.findOneAndUpdate({ _id: cartId }, { items: itemsArr, totalPrice: totalAmount }, { new: true })

      return res.status(200).send({ status: true, message: `${productId} quantity is been reduced By 1`, data: data })

  } catch (err) {
      return res.status(500).send({ status: false, message: "Error is : " + err })
  }
}

module.exports.updateCart=updateCart
/////////////////////////////////////////////////////////////////////////////////////////
// const updateCart = async function (req, res) {
//   try {

//       let userId = req.params.userId
//       console.log(userId)
//       if (req.user.userId != userId) {
//           return res.status(401).send({ status: false, msg: "Invalid userId provided" })

//       }
//       let body = req.body
//       const { cartId, productId, removeProduct } = body
//       if(!validator.isValidRequestBody(body)){
//           return res.status(400).send({ status: false, msg: "provide body" }) 
//       }
//       if (!validator.isValidObjectId(userId)) {
//           res.status(400).send({ status: false, msg: "Provide a valid userId" })
//       }
//       if (!validator.isValidObjectId(cartId)) {
//           res.status(400).send({ status: false, msg: "Provide a valid cartId" })
//       }
//       if (!validator.isValidObjectId(productId)) {
//           res.status(400).send({ status: false, msg: "Provide a valid userId" })
//       }
//       let checkProduct = await productModel.findOne({ _id: productId, isDeleted: false })
//       if (!checkProduct) {
//           res.status(400).send({ status: false, msg: "The product no longer exist" })
//       }
//       let findCart = await cartModel.findOne({ _id: cartId, userId: userId })
//       if (!findCart) {
//           res.status(400).send({ status: false, msg: "The user or cart does not match " })
//       }
//       let itemsarr = findCart.items
//       let updateItems = []
//       for (let r = 0; r < itemsarr.length; r++) {
//           if (itemsarr[r].productId != productId) {
//               updateItems.push(itemsarr[r])

//           }
//       }
//       if (updateItems.length == 0) {
//           if (removeProduct == 1) {

//               let decreaseQty = await cartModel.findOneAndUpdate({ _id: cartId, "items.$.productId": productId },
//                   { $inc: { "items.$.quantity": -1, totalItems: -1 } }, { new: true })
//               return res.status(400).send({ status: true, msg: "qty decreased", data: decreaseQty })
//           }
//           let noProduct = await cartModel.findOneAndUpdate({ _id: cartId },
//               { items: [], totalPrice: 0, totalItems: 0 }, { new: true })

//       } else {
//           let productarr = []
//           for (let r = 0; r < updateItems.length; r++) {
//               let c = updateItems[r].productId
//               let priceFind = await productModel.findOne({ _id: c })
//               productarr.push(priceFind.price)
//           }
//           var totalPriceop = productarr.reduce((pv, cv) => pv + cv)
//           let qtyarr = []
//           for (let r = 0; r < updateItems.length; r++) {
//               let c = updateItems[r].quantity
//               qtyarr.push(c)
//           }
//           var totalqtyp = qtyarr.reduce((pv, cv) => pv + cv)
//       }
//       if (removeProduct == 0) {

//           // let deleteProduct = await cartModel.find({_id: cartId,items:{$elemMatch:{_id : "61cabd1383e21cc2539407d8"}}}).remove()
//           let deleteProduct = await cartModel.findOneAndUpdate({ _id: cartId },
//               { items: updateItems, totalPrice: totalPriceop, totalItems: totalqtyp }, { new: true })
//           // let deleteProduct = cartModel.findOneAndUpdate( { _id:cartId}, { $pull: { items: [{ productId: productId }] } } )
//           return res.status(200).send({ status: true, data: deleteProduct })
//       }
//       // if(removeProduct == 1){
//       //     // let qtyDec = await cartModel
//       //     let decreaseQty = await cartModel.findOneAndUpdate({_id: cartId, "items.$.productId": productId},
//       //         {$inc:{"items.$.quantity": -1, totalItems: -1}}, {new: true})
//       //         return res.status(400).send({status: true, msg: "qty decreased", data: decreaseQty})
//       // }

//   } catch (err) {
//       res.status(500).send({ status: false, msg: err.message })
//   }
// }
// module.exports.updateCart = updateCart