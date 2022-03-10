const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createUser = async function (abcd, xyz) {
 
 try{ let data = abcd.body;
  let savedData = await userModel.create(data);
  console.log(abcd.newAtribute);
  xyz.status( 201 ).send({ msg: savedData });
}catch (error){
  res.status( 500).send(error.message)
}};

const loginUser = async function (req, res) {
 try{ let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.status(400).send({              //////////////////////////////////////////
      status: false,
      msg: "username or the password is not corerct",
    });



  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "thorium",
      organisation: "FUnctionUp",
    },
    "functionup-thorium"
  );
  res.setHeader("x-auth-token", token);
  res.status(200).send({ status: true, data: token });   ////////////////////////////////////////  
}catch(error){
  res.status(500).send(error.message)       //////////////////////////////////////////
}};



const getUserData = async function (req, res) {
  try{
  let token = req.headers["x-Auth-token"];
  if (!token) token = req.headers["x-auth-token"];

  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });    /////////////

  console.log(token);

  let decodedToken = jwt.verify(token, "functionup-thorium");
  if (!decodedToken)
    return res.status(400).send({ status: false, msg: "token is invalid" });     //////////////////////////////////////

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.status(400).send({ status: false, msg: "No such user exists" });        ////////////////////////////

  res.status(200).send({ status: true, data: userDetails });      /////////////////////////////////////
} catch(error){
  res.status(500).send(error.message)
}};



const updateUser = async function (req, res) {
  try{
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
 
  if (!user) {
    return res.status(400).send("No such user exists");         //////////////////////////////////////////
  }

  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData);
  res.status(202).send({ status: updatedUser, data: updatedUser });                      ///////////////////////////////////////
} catch(error){
  res.status(500).send(error.message)
}};

const postMessage = async function (req, res) {
  try{
    let message = req.body.message
  
    let token = req.headers["x-auth-token"]
    
    let user = await userModel.findById(req.params.userId)
    if(!user) return res.status(400).send({status: false, msg: 'No such user exists'})
    
    let updatedPosts = user.posts
   
    updatedPosts.push(message)
    let updatedUser = await userModel.findOneAndUpdate({_id: user._id},{posts: updatedPosts}, {new: true})

       return res.status(201).send({status: true, data: updatedUser})        //////////////////
} catch(error){
  res.status(500).send(error.message)
}};



const isdeletedUser = async function (req, res) {
  try{
  let isDeletedId = req.params.userId;
  let isDeletedProperty = await userModel.findByIdAndUpdate({_id:isDeletedId},{$set: {isDeleted:true}},{new:true});
  res.status(200).send({ status: true, data: isDeletedProperty });        ////////////////////
} catch(error){
  res.status(500).send(error.message)
}};

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.postMessage = postMessage
module.exports.isdeletedUser = isdeletedUser