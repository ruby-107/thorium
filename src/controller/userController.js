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
      return res.status(400).json({status: true, msg: "Invalid request parameters ,please provide the user details",
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

     
    //    profileImage = await aws.uploadFile(files[0])
    //     console.log(profileImage,"gshjghjg")
        const udatedBody = { fname, lname, email,phone, password:hash, address ,profileImage}
        let user = await userModel.create(udatedBody)
        res.status(201).send({ status: true, message: 'User created successfully', data: user })

        
    // userData = { fname, lname, email, phone, address,password :hash};
    // const newUser = await userModel.create(userData);
    // res.status(201).json({ status: true,msg: "New user registered successfully",data: newUser,
    //   });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const login = async (req, res) => {
  try {
      let requestBody = req.body
      if (!validator.isValidRequestBody(requestBody))
      return res.status(400).json({ status: true, msg: "Invalid request parameters ,please provide the user details",
 });

 const { email,password} = requestBody
 if (!validator.isValid(email))
      return res.status(400).json({ status: false, msg: "please provide the email" });

    // let isEmailUsed = await userModel.findOne({ email });

    // if (isEmailUsed)
    // return res.status(400).json({ status: false, msg: `${email} is already exists` });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ status: false, msg: "please provide a valid email address" });
    
      if (!validator.isValid(password))
      return res.status(400).json({ status: false, msg: "please provide the password" });

      if(password.split("").length< 8){
        res.status(400).send({ status:false, msg : `password length between 8 and 15 chrachter`})
    }
    if(password.split("").length> 15){
        res.status(400).send({ status:false, msg : `password length between 8 and 15 chrachter`})
    }

   // let hasedPassword = await bcrypt.hash(password, saltRounds);

   const user = await userModel.findOne({email,password})
   if(!user){
      return  res.status(400).send({ status:false, msg: "invaild login detail"})
   }
   let payload = { _id: user._id }
   let token = await jwt.sign(payload,
       //exp: Math.floor(Date.now() / 1000) + 10*60*60
       'Group-38', { expiresIn: '30000mins' })
   res.header('x-api-key', token);
   res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });

  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
const getUserProfile = async (req, res) => {
  try {
      let userId = req.params.userId

      if(!validator.isValid(userId)){
        return  res.status(400).send({status:false, msg:`userId is required`})
      }
      if(!validator.isValidObjectId(userId)){
        return  res.status(400).send({status:false, msg:`userId is vaild`})
      }

      const userProfile = await userModel.findOne({userId:userId})
      if(!userProfile){
          return res.status(400).send({ status: false, msg:`not found userId`})
       }
       let result = {
           address : userProfile.address,
           _id: userProfile._id,
           fname : userProfile.fname,
           lname : userProfile.lname,
           email: userProfile.email,
           password:userProfile.password,
           phone:userProfile.phone,
           createdAt : userProfile.createdAt,
           updatedAt : userProfile.updatedAt
       }
       return res.status(200).send({status:true, data:result})
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
const userUpdateProfile = async (req, res) => {
  try {
      let newUser = req.params.userId
      if(!validator.isValidObjectId(newUser)){
          return req.res(400).send({ status:false,msg:`userId is not vaild`})
      }
      let {fname, lname, email, phone, address,password} = req.body

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
      
       if (!/^[6789]\d{9}$/.test(phone))
       return res.status(400).json({ status: true, msg: "please enter a valid 10 digit phone number",
         });
         
     let isPhoneUsed = await userModel.findOne({ phone });
 
     if (isPhoneUsed)
       return res.status(400).json({ status: false, msg: `${phone} is already exists` }); 
     
       if (!validator.isValid(password))
       return res.status(400).json({ status: false, msg: "please provide the password" });
 
     if (!(password.length > 8 && password.length < 15 ))
       return res.status(400).json({status: false, msg: "please ensure password length is 8-15??",
         });  

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
         const userUpdate = await userModel.findOneAndUpdate({userData:userId})
      if(!userProfile){
          return res.status(400).send({ status: false, msg:`not found userId`})
       }
       let result = {
           address : userProfile.address,
           _id: userProfile._id,
           fname : userProfile.fname,
           lname : userProfile.lname,
           email: userProfile.email,
           password:userProfile.password,
           phone:userProfile.phone,
           createdAt : userProfile.createdAt,
           updatedAt : userProfile.updatedAt
       }
       return res.status(200).send({status:true, data:result})



  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = { createUSer, login, getUserProfile, userUpdateProfile };


// profileImage = await awsFile.uploadFile(files[0])
// const udatedBody = { fname, lname, email, phone, password, address, profileImage }
// let user = await userModel.create(udatedBody)
// res.status(201).send({ status: true, message: 'User created successfully', data: user })
