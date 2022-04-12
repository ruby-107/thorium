const mongoose = require("mongoose")

const isValid=value=>{
    if(typeof value===undefined || typeof value===null) return false;
    if(typeof value==="string"  && value.trim().length===0) return false;
    return true
  }
  
  
  const isValidRequestBody=RequestBody=>Object.keys(RequestBody).length>0

  const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
 }

 const validString = function (value) {
  if (typeof value === "string" && value.trim().length == 0) return false;
  return true;
};
  
  module.exports={isValid,
    isValidRequestBody,
    isValidObjectId,
    validString
}