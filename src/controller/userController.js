const bcrypt = require("bcrypt");

const userModel = require("../model/userModel");
const validator = require("../util/validator");
const jwt = require("jsonwebtoken")
const aws = require('../util/aws')

const createUSer = async (req, res) => {
  try {
    let files = req.files
    let requestBody = req.body

    if (!validator.isValidRequestBody(requestBody))
      return res.status(400).json({status: false, msg: "Invalid request parameters ,please provide the user details",
        });

   let  { fname, lname, email, phone, password,address ,profileImage} = requestBody;

    if (!validator.isValid(fname))
     return res.status(400).json({ status: false, msg: "please provide the first name" });

    if (!validator.isValid(lname))
      return res.status(400).json({ status: false, msg: "please provide the last name" });

    if (!validator.isValid(email))
      return res.status(400).json({ status: false, msg: "please provide the email" });

    let isEmailUsed = await userModel.findOne({ email });

    if (isEmailUsed)
      return res.status(400).json({ status: false, msg: `${email} is already exists` });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ status: false, msg: "please provide a valid email address" });
    
       // if(!aws(profileImage))
       // return res.status1(400).json({status:false,msg: `please requried aws link`})    
       profileImage = await aws.uploadFile(files[0])
       console.log(profileImage)
       // profileImage = await config.uploadFile(req.files[0]);

    if (!validator.isValid(phone))
      return res.status(400).json({ status: false, msg: "please provide the  phone number" });

    if (!/^[6789]\d{9}$/.test(phone))
      return res.status(400).json({ status: true, msg: "please enter a valid 10 digit phone number",
        });
        
    let isPhoneUsed = await userModel.findOne({ phone });

    if (isPhoneUsed)
      return res.status(400).json({ status: false, msg: `${phone} is already exists` });

    //The Phone Numbers will be of 10 digits, and it will start from 6,7,8 and 9 and remaing 9 digits

    if (!validator.isValid(password))
      return res.status(400).json({ status: false, msg: "please provide the password" });

    if (!(password.length > 8 && password.length < 15 ))
      return res.status(400).json({status: false, msg: "please ensure password length is 8-15??",
        });
         let saltRounds = 10;
         const salt = await bcrypt.genSalt(saltRounds)
         console.log(salt)
         let hash = await bcrypt.hash(req.body.password,salt)
         console.log(hash)

  // let hasedPassword = await bcrypt.hash(password, saltRounds);

if (!validator.isValid(address))
return res.status(400).json({ status: false, msg: "address is required" });

if (!validator.isValidRequestBody(req.body.address.shipping))
return res.status(400).json({ status: false, msg: "please provide shipping details" });

if (address.shipping) {
if (!validator.isValid(address.shipping.street))
  return res.status(400).json({ status: false, msg: "please provide street details" });

if (!validator.isValid(address.shipping.city))
  return res.status(400).json({ status: false, msg: "please provide street details" });

if (!validator.isValid(address.shipping.pincode))
  return res.status(400).json({ status: false, msg: "please provide street details" });
}

if (!validator.isValidRequestBody(req.body.address.billing))
return res.status(400).json({ status: false, msg: "please provide billing details" });

if (address.billing) {
if (!validator.isValid(address.billing.street))
  return res.status(400).json({ status: false, msg: "please provide street details" });

if (!validator.isValid(address.billing.city))
  return res.status(400).json({ status: false, msg: "please provide street details" });

if (!validator.isValid(address.billing.pincode))
  return res.status(400).json({ status: false, msg: "please provide street details" });
}

        const updatedBody = { fname, lname, email,phone, password:hash, address ,profileImage}
        let user = await userModel.create(updatedBody)
        res.status(201).send({ status: true, message: 'User created successfully', data: user })

        
    
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports.createUSer =createUSer

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const login = async (req, res) => {
      try {
        if (!validator.isValidRequestBody(req.body))
          return res.status(400).json({ status: false, msg: "invalid paramaters please provide email-password", });
    
        let { email, password } = req.body;
    
        if (!validator.isValid(email))
          return res.status(400).json({ status: false, msg: "email is required" });
    
        const findUser = await userModel.findOne({ email });
    
        if (!findUser) { 
          return res.status(401).send({ status: false, message: `Login failed! email is incorrect.` });
        }
    
        if (!validator.isValid(password))
          return res.status(400).json({ status: false, msg: "password is required" });
    
        let encryptedPassword = findUser.password;
    
        const findUserr = await bcrypt.compare(password, encryptedPassword);
    
        if (!findUserr) {
          return res.status(401).send({status: false, message: `Login failed! password is incorrect.`  });
        }
    
        let userId = findUser._id;
    
        let token = await jwt.sign(
          {
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
          },
          "Group-38"
        );
    
        res.status(200).json({ status: true,msg: "loggedin successfully",data: { userId, token }, });
      } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
      }
    };
    module.exports.login=login



///////////////////////////////////////////////////////////////////////////////////////////////////////
const getUserProfile = async function (req, res) {
  try {
      let userId = req.params.userId

      if (!validator.isValid(userId)) {
          return res.status(400).send({ status: false, msg: "userId required" })

      }
      if (!validator.isValidObjectId(userId)) {
          return res.status(400).send({ status: false, msg: "userId invalid" })
      }
      let userprofile = await userModel.findById(userId)
      if (!userprofile) {
          return res.status(404).send({ status: false, msg: "not found " })
      }
      let result = {
          address: userprofile.address,
          _id: userprofile._id,
          fname: userprofile.fname,
          lname: userprofile.lname,
          email: userprofile.email,
          phone: userprofile.phone,
          password: userprofile.password,
          createdAt: userprofile.createdAt,
          updatedAt: userprofile.updatedAt
      }
      return res.status(200).send({ status:true, data: result })
  }
  catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
  }
};


module.exports.getUserProfile=getUserProfile


////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateProfile = async (req, res) => {
  try {
    let saltRounds=10
    let files = req.files
    let userId = req.params.userId
    let decodedUserId = req.userId
    if (!validator.isValidObjectId(userId)) {
        res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        return
    }

    if (!validator.isValidRequestBody(req.body)) {
        return res.status(400).send({status: false,message: "Invalid request parameters. Please provide user's details to update." })
    }

    const UserProfile = await userModel.findOne({ _id: userId })
    if (!UserProfile) {
        return res.status(400).send({status: false, message: `${userId}  doesn't exists` })
    }

    //authorization
    if (UserProfile._id.toString() != decodedUserId) {
        return  res.status(401).send({ status: false, message: `Unauthorized access! to user` });
    }

    let { fname, lname, email, phone, password, address, profileImage } = req.body;

    //validations for updatation details.
    if (!validator.validString(fname)) {
        return res.status(400).send({ status: false, message: 'fname is Required' })
    }
    
    if (!validator.validString(lname)) {
        return res.status(400).send({ status: false, message: 'lname is Required' })
    }

    //email validation
    if (!validator.validString(email)) {
        return res.status(400).send({ status: false, message: 'email is Required' })
    }
    if (email) {
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide email" })
        }
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }
        let isEmailAlredyPresent = await userModel.findOne({ email: email })
        if (isEmailAlredyPresent) {
            return res.status(400).send({ status: false, message: `${email} is already registered.` });
        }
    }

    //phone validation
    if (!validator.validString(phone)) {
        return res.status(400).send({ status: false, message: 'phone number is Required' })
    }
    if (phone) {
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide Phone number." })
        }
        if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, message: `Please enter a valid Indian phone number.` });
        }
        let isPhoneAlredyPresent = await userModel.findOne({ phone: phone })
        if (isPhoneAlredyPresent) {
            return res.status(400).send({ status: false, message: `${phone} is already registered.` });
        }
    }

    //pasword validation and setting range of password.
    if (!validator.validString(password)) {
        return res.status(400).send({ status: false, message: 'password is Required' })
    }
   
    if (password) {
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide password" })
        }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
        }
        var encryptedPassword = await bcrypt.hash(password, saltRounds)
    }

    //Address validation 
    if (address) {
        //converting shipping address to string then parsing it.
        let shippingAddressToString = JSON.stringify(address)
        let parsedShippingAddress = JSON.parse(shippingAddressToString)

        if (validator.isValidRequestBody(address)) {
            if (parsedShippingAddress.hasOwnProperty('shipping')) {
                if (parsedShippingAddress.shipping.hasOwnProperty('street')) {
                    if (!validator.isValid(address.shipping.street)) {
                        return res.status(400).send({ status: false, message: " Invalid request parameters. Please provide shipping address's Street" });
                    }
                }
                if (parsedShippingAddress.shipping.hasOwnProperty('city')) {
                    if (!validator.isValid(address.shipping.city)) {
                        return res.status(400).send({ status: false, message: " Invalid request parameters. Please provide shipping address's City" });
                    }
                }
                if (parsedShippingAddress.shipping.hasOwnProperty('pincode')) {
                    if (!validator.isValid(address.shipping.pincode)) {
                        return res.status(400).send({ status: false, message: " Invalid request parameters. Please provide shipping address's pincode" });
                    }
                }

                //using var to use these variables outside this If block.
                var shippingStreet = address.shipping.street
                var shippingCity = address.shipping.city
                var shippingPincode = address.shipping.pincode
            }
        } else {
            return res.status(400).send({ status: false, message: " Invalid request parameters. Shipping address cannot be empty" });
        }
    }
    if (address) {

        //converting billing address to string them parsing it.
        let billingAddressToString = JSON.stringify(address)
        let parsedBillingAddress = JSON.parse(billingAddressToString)

        if (validator.isValidRequestBody(address)) {
            if (parsedBillingAddress.hasOwnProperty('billing')) {
                if (parsedBillingAddress.billing.hasOwnProperty('street')) {
                    if (!validator.isValid(address.billing.street)) {
                        return res.status(400).send({ status: false, message: " Invalid request parameters. Please provide billing address's Street" });
                    }
                }
                if (parsedBillingAddress.billing.hasOwnProperty('city')) {
                    if (!validator.isValid(address.billing.city)) {
                        return res.status(400).send({ status: false, message: " Invalid request parameters. Please provide billing address's City" });
                    }
                }
                if (parsedBillingAddress.billing.hasOwnProperty('pincode')) {
                    if (!validator.isValid(address.billing.pincode)) {
                        return res.status(400).send({ status: false, message: " Invalid request parameters. Please provide billing address's pincode" });
                    }
                }

                //using var to use these variables outside this If block.
                var billingStreet = address.billing.street
                var billingCity = address.billing.city
                var billingPincode = address.billing.pincode
            }
        } else {
            return res.status(400).send({ status: false, message: " Invalid request parameters. Billing address cannot be empty" });
        }
    }

    //validating user's profile image.
    if (files) {
        if (validator.isValidRequestBody(files)) {
            if (!(files && files.length > 0)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide profile image" })
            }
            var updatedProfileImage = await aws.uploadFile(files[0])
        }
    }
    //Validation ends

    //object destructuring for response body.
    let changeProfileDetails = await userModel.findOneAndUpdate({ _id: userId }, {
        $set: {
            fname: fname,
            lname: lname,
            email: email,
            profileImage: updatedProfileImage,
            phone: phone,
            password: encryptedPassword,
            'address.shipping.street': shippingStreet,
            'address.shipping.city': shippingCity,
            'address.shipping.pincode': shippingPincode,
            'address.billing.street': billingStreet,
            'address.billing.city': billingCity,
            'address.billing.pincode': billingPincode
        }
    }, { new: true })
    return res.status(200).send({ status: true, data: changeProfileDetails })
  } catch (err) {
    return res.status(500).json({
        status: false,
        msg: err.message
    })
}
}
module.exports.updateProfile=updateProfile