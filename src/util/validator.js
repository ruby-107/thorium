const mongoose = require("mongoose")

const isValid=value=>{
    if(typeof value==="undefined" || typeof value===null) return false;
    if(typeof value==="string"  && value.trim().length===0) return false;
    if(typeof(value) == "number" && value === null) return false
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
  
const validInstallment = function isInteger(value) {
  if (value < 0) return false
  if (value % 1 == 0) return true;
}

const validQuantity = function isInteger(value) {
  if (value < 1) return false
  if (isNaN(Number(value))) return false
  if (value % 1 == 0) return true
}

const isValidStatus = function(status) {
  return ['pending', 'completed', 'cancelled'].indexOf(status) !== -1
}
const isValidObject = (data) => {
  if (Object.keys(data).length === 0){
      return false
  }
  return true
}




  module.exports={isValid,
    isValidRequestBody,
    isValidObjectId,
    validString,
    validInstallment,
    validQuantity,
    isValidStatus,
    isValidObject
}

