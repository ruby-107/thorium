
const orderModel =require('../Model/orderModel')
//const productModel = require('../Model/productModel')
const cartModel = require('../Model/cartModel')
const userModel = require('../model/userModel')
const validator = require('../util/validator')



//////////////////////////////////////////////////////////////////////////////////////////////
const createOrder = async (req, res) => {
  try {
   // validation for request body
    if (!validator.isValidRequestBody(req.body))
      return res.status(400).json({status: false, message: "Invalid request paramaters. Please provide order details", });

    //Extract parameters
    const { cartId, cancellable, status } = req.body;

    //validating userId
    if (!validator.isValidObjectId(req.params.userId))
      return res.status(400).json({ status: false, message: "Invalid userId " });

    const findUser = await userModel.findOne({ _id: req.params.userId });

    if (!findUser)
      return res.status(400).json({status: false, message: `user doesn't exists for ${req.params.userId}`,  });


    if (req.userId != req.params.userId)
     return res.status(401).json({ status: false, msg: "Authorised user to create cart" });

    if (!validator.isValidObjectId(cartId))
      return res.status(400).json({ status: false, message: `Invalid cartId in request body.`,});

    //searching cart to match the cart by userId whose is to be ordered.
    const findCartDetails = await cartModel.findOne({
      _id: cartId,
      userId: req.params.userId,
    });

    if (!findCartDetails)
      return res.status(400).json({ status: false, message: `Cart doesn't exits to ${req.params.userId}`, });

    //must be a boolean value.
    if (cancellable) {
      if (typeof cancellable !== "boolean") {
        return res.status(400).json({ status: false, message: `Cancellable must be  'true' or 'false'.`, });
      }
    }

    // must be either - pending , completed or cancelled.
    if (status) {
      if (!validator.isValidStatus(status))
        return res.status(400).json({status: false, message: `Status must be among ['pending','completed','cancelled'].`,});
    }

    //verifying whether the cart is having any products or not.
    if (!findCartDetails.items.length)
      return res.status(202).json({
        status: false,
        message: `Order already placed for this cart. Please add some products in cart to make an order.`,
      });

    //adding quantity of every products

    let totalQuantity = findCartDetails.items
      .map((x) => x.quantity)
      .reduce((pv, cv) => pv + cv);

    //object destructuring for response body.
    const orderDetails = {
      userId: req.params.userId,
      items: findCartDetails.items,
      totalPrice: findCartDetails.totalPrice,
      totalItems: findCartDetails.totalItems,
      totalQuantity: totalQuantity,
      cancellable,
      status,
    };
    const savedOrder = await orderModel.create(orderDetails);

    //Empty the cart after the successfull order
    await cartModel.findOneAndUpdate(
      { _id: cartId, userId: req.params.userId },
      {
        $set: {
          items: [],
          totalPrice: 0,
          totalItems: 0,
        },
      }
    );
    return res.status(200).json({ status: true, message: "Order placed.", data: savedOrder });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

module.exports.createOrder=createOrder
////////////////////////////////////////////////////////////////////////////////////
const updateOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    //validating request body.
    if (!validator.isValidRequestBody(req.body))
      return res.status(400).json({
        status: false,
        message: "Invalid parameters. Please provide order details",
      });

    //extract params
    const { orderId, status } = req.body;

    if (!validator.isValid(orderId) && !validator.isValid(status))
      return res
        .status(400)
        .json({ status: false, msg: "orderId or status is missing" });

    if (!validator.isValidObjectId(userId))
      return res
        .status(400)
        .json({ status: false, message: "Invalid userId " });

    const findUser = await userModel.findOne({ _id: userId });

    if (!findUser)
      return res.status(400).json({
        status: false,
        message: `user doesn't exists with ${userId}`,
      });


    if (req.userId != req.params.userId)
    return res.status(401).json({ status: false, msg: "Authorised user to create cart" });

    const findOrder = await orderModel.findOne({ _id: orderId });

    if (!findOrder) {
      return res.status(400).send({
        status: false,
        message: ` ${orderId} does mot exists`,
      });
    }

    //verifying does the order belongs to user or not.
    let isOrderBelongsToUser = await orderModel.findOne({ userId: userId });
    if (!isOrderBelongsToUser)
      return res.status(400).json({
        status: false,
        message: `Order doesn't belongs to ${userId}`,
      });

    if (!status) {
      return res.status(400).send({
        status: true,
        message: " Please enter current status of the order.",
      });
    }
    if (!validator.isValidStatus(status)) {
      return res.status(400).send({
        status: true,
        message:
          "Invalid status in request body. Choose either 'pending','completed', or 'cancelled'.",
      });
    }

    //if cancellable is true then status can be updated to any of te choices.
    if (isOrderBelongsToUser["cancellable"] == true) {
      if (validator.isValidStatus(status)) {
        if (isOrderBelongsToUser["status"] == "pending") {
          const updateStatus = await orderModel.findOneAndUpdate(
            { _id: orderId },
            {
              $set: { status: status },
            },
            { new: true }
          );
          return res.status(200).json({
            status: true,
            message: `Successfully updated the order details.`,
            data: updateStatus,
          });
        }

        //if order is in completed status then nothing can be changed/updated.
        if (isOrderBelongsToUser["status"] == "completed") {
          return res.status(400).json({
            status: false,
            message: `Unable to update or change the status, because it's already in completed status.`,
          });
        }

        //if order is already in cancelled status then nothing can be changed/updated.
        if (isOrderBelongsToUser["status"] == "cancelled") {
          return res.status(400).json({
            status: false,
            message: `Unable to update or change the status, because it's already in cancelled status.`,
          });
        }
      }
    }
    //for cancellable : false
    if (isOrderBelongsToUser["status"] == "completed") {
      if (status) {
        return res.status(400).json({
          status: true,
          message: `Cannot update or change the status, because it's already in completed status.`,
        });
      }
    }

    if (isOrderBelongsToUser["status"] == "cancelled") {
      if (status) {
        return res.status(400).json({
          status: true,
          message: `Cannot update or change the status, because it's already in cancelled status.`,
        });
      }
    }

    if (isOrderBelongsToUser["status"] == "pending") {
      if (status) {
        if (["completed", "pending"].indexOf(status) === -1) {
          return res.status(400).json({
            status: false,
            message: `Unable to update status due to Non-cancellation policy.`,
          });
        }

        const updatedOrderDetails = await orderModel.findOneAndUpdate(
          { _id: orderId },
          { $set: { status: status } },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          message: `Successfully updated the order details.`,
          data: updatedOrderDetails,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
module.exports.updateOrder=updateOrder
//////////////////////////////////////////////////////////////////////////////


// const orderCreation = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const requestBody = req.body;
//         const userIdFromToken = req.userId;

//         //validation for request body
//         if (!validator.isValidRequestBody(requestBody)) {
//             return res.status(400).send({status: false, message: "Invalid request body. Please provide the the input to proceed."});
//         }
//         //Extract parameters
//         const { cartId, cancellable, status } = requestBody;

//         //validating userId
//         if (!validator.isValidObjectId(userId)) {
//             return res.status(400).send({ status: false, message: "Invalid userId in params." });
//         }

//         const searchUser = await userModel.findOne({ _id: userId });
//         if (!searchUser) {
//             return res.status(400).send({status: false, message: `user doesn't exists for ${userId}`});
//         }
//         //Authentication & authorization
//         // if (searchUser._id.toString() != userIdFromToken) {
//         //    return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });   
//         // }
        
//     if (req.userId != req.params.userId)
//     return res.status(401).json({ status: false, msg: "Authorised user to create cart" });

//         if (!cartId) {
//             return res.status(400).send({status: false, message: `Cart doesn't exists for ${userId}`});
//         }
//         if (!validator.isValidObjectId(cartId)) {
//             return res.status(400).send({status: false, message: `Invalid cartId in request body.`});
//         }

//         //searching cart to match the cart by userId whose is to be ordered.
//         const searchCartDetails = await cartModel.findOne({_id: cartId, userId: userId});
//         if (!searchCartDetails) {
//             return res.status(400).send({status: false,message: `Cart doesn't belongs to ${userId}`});
//         }

//         //must be a boolean value.
//         if (cancellable) {
//             if (typeof cancellable != "boolean") {
//                 return res.status(400).send({status: false,message: `Cancellable must be either 'true' or 'false'.`})}
//         }

//         // must be either - pending , completed or cancelled.
//         if (status) {
//             if (!validator.isValidStatus(status)) {
//                 return res.status(400).send({status: false,message: `Status must be among ['pending','completed','cancelled'].`})}
//         }

//         //verifying whether the cart is having any products or not.
//         if (!searchCartDetails.items.length) {
//             return res.status(202).send({status: false, message: `Order already placed for this cart. Please add some products in cart to make an order.`});
//         }

//         //adding quantity of every products
//         const reducer = (previousValue, currentValue) => previousValue + currentValue;

//         let totalQuantity = searchCartDetails.items.map((x) => x.quantity).reduce(reducer);

//         //object destructuring for response body.
//         const orderDetails = {
//             userId: userId,
//             items: searchCartDetails.items,
//             totalPrice: searchCartDetails.totalPrice,
//             totalItems: searchCartDetails.totalItems,
//             totalQuantity: totalQuantity,
//             cancellable,
//             status,
//         };
//         const savedOrder = await orderModel.create(orderDetails);

//         //Empty the cart after the successfull order
//         await cartModel.findOneAndUpdate({ _id: cartId, userId: userId }, {
//             $set: {
//                 items: [],
//                 totalPrice: 0,
//                 totalItems: 0,
//             }});
//         return res.status(200).send({ status: true, message: "Order placed.", data: savedOrder });
//     } catch (err) {
//         return res.status(500).send({ status: false, message: err.message });
//     }
// };

// module.exports.orderCreation=orderCreation