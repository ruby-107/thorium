

const cartModel= require('../Model/cartModel')
const productModel = require('../Model/productModel')
const userModel = require('../model/userModel')
const validator = require('../util/validator')




//////////////////////////////////////////////////////////////////////////////////////////////////////////
const createCart = async function (req, res) {
  try {
      const userId = req.params.userId
      const requestBody = req.body;
      const { quantity, productId } = requestBody
      let userIdFromToken = req.userId;

      //validating starts.
      if (!validator.isValidRequestBody(requestBody)) {
          return res.status(400).send({ status: false, message: "Please provide valid request body" })
      }

      if (!validator.isValidObjectId(userId)) {
          return res.status(400).send({ status: false, msg: "userId invalid" })
      }
      if (!validator.isValidObjectId(productId)) {
          return res.status(400).send({ status: false, message: `plz provide valid productId` })
      }

      if (!validator.isValid(quantity) || !validator.validQuantity(quantity)) {
          return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." })
      }
      //validation ends.

      const findUser = await userModel.findById({ _id: userId })
      if (!findUser) {
          return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}` })
      }

      //Authentication & authorization
      if (findUser._id.toString() != userIdFromToken) {
          return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
      }

      const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!findProduct) {
          return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}` })
      }

      const findCartOfUser = await cartModel.findOne({ userId: userId }) //finding cart related to user.

      if (!findCartOfUser) {

          //destructuring for the response body.
          var cartData = {
              userId: userId,
              productId: productId,
              quantity: quantity,
              totalPrice: findProduct.price * quantity,
              totalItems: 1
          }

          const createCart = await cartModel.create(cartData)
          return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
      }

      if (findCartOfUser) {

          //updating price when products get added or removed.
          let price = findCartOfUser.totalPrice + (req.body.quantity * findProduct.price)
          let itemsArr = findCartOfUser.items

          //updating quantity.
          for (i in itemsArr) {
              if (itemsArr[i].productId=== productId) {
                  itemsArr[i].quantity += quantity

                  let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }

                  let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

                  return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
              }
          }
          itemsArr.push({ productId: productId, quantity: quantity }) //storing the updated prices and quantity to the newly created array.

          let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
          let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

          return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
      }
  } catch (err) {
      res.status(500).send({ status: false, data: err.message });
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
    //validation starts.
    if (!validator.isValidObjectId(req.params.userId))
      return res.status(400).json({ status: false, message: "Invalid userId in body" });

    let findUser = await userModel.findOne({ _id: req.params.userId });
    
    if (!findUser)
      return res.status(400).json({ status: false, message: "UserId does not exits" });

    if (req.userId != req.params.userId)
    return res.status(401).json({ status: false, msg: "Authorised user to create cart" });

    //Extract body
    const { cartId, productId, removeProduct } = req.body;
    if (!validator.isValidRequestBody(req.body))
      return res.status(400).json({status: false,message: "Invalid request parameters. Please provide cart details.", });

    //cart validation
    if (!validator.isValidObjectId(cartId)) {
      return res.status(400).json({ status: false, message: "Invalid cartId in body" });
    }
    let findCart = await cartModel.findById({ _id: cartId });

    if (!findCart)
      return res.status(400)
        .json({ status: false, message: "cartId does not exists" });

    //product validation
    if (!validator.isValidObjectId(productId))
      return res.status(400).json({ status: false, message: "Invalid productId in body" });

    let findProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!findProduct)
      return res.status(400).json({ status: false, message: "productId does not exists" });

    //finding if products exits in cart
    let isProductinCart = await cartModel.findOne({
      items: { $elemMatch: { productId: productId } },
    });
    if (!isProductinCart)
      return res.status(400).json({ status: false, message: `This ${productId} product does not exists in the cart`,});

    //removeProduct validation either 0 or 1.
    if (!!isNaN(Number(removeProduct)))
      return res.status(400).json({status: false, message: `removeProduct should be a valid number either 0 or 1`, });

    //removeProduct => 0 for product remove completely, 1 for decreasing its quantity.
    if (!(removeProduct === 0 || 1))
      return res.status(400).json({ status: false, message: "removeProduct should be 0 (product is to be removed) or 1(quantity has to be decremented by 1) ",
      });

    let findQuantity = findCart.items.find(
      (x) => x.productId.toString() === productId
    );
    //console.log(findQuantity)

    if (removeProduct === 0) {
      let totalAmount =
        findCart.totalPrice - findProduct.price * findQuantity.quantity; // substract the amount of product*quantity

      await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { items: { productId: productId } } },
        { new: true }
      );

      let quantity = findCart.totalItems - 1;
      let data = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $set: { totalPrice: totalAmount, totalItems: quantity } },
        { new: true }
      ); //update the cart with total items and totalprice

      return res.status(200).json({
        status: true, message: `${productId} is been removed`, data: data,});
    }

    // decrement quantity
    let totalAmount = findCart.totalPrice - findProduct.price;
    let itemsArr = findCart.items;

    for (i in itemsArr) {
      if (itemsArr[i].productId.toString() == productId) {
        itemsArr[i].quantity = itemsArr[i].quantity - 1;

        if (itemsArr[i].quantity < 1) {
          await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $pull: { items: { productId: productId } } },
            { new: true }
          );
          let quantity = cart.totalItems - 1;

          let data = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $set: { totalPrice: totalAmount, totalItems: quantity } },
            { new: true }
          ); //update the cart with total items and totalprice

          return res.status(200).json({
            status: true, message: `No such quantity/product exist in cart`,data: data, });
        }
      }
    }
    let data = await cartModel.findOneAndUpdate(
      { _id: cartId },
      { items: itemsArr, totalPrice: totalAmount },
      { new: true }
    );

    return res.status(200).json({
      status: true, message: `${productId} quantity is been reduced By 1`, data: data,});
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message, });
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