const mongoose = require('mongoose');
const { object } = require('webidl-conversions');

const isValid = (value)=>{
    if(typeof value === 'undefined' || value === null) return false;
    if(typeof value === 'string' || value.trim().length === 0) return false;
    return true;
}

const isValidRequestBody = function(requestBody){
    if (Object.keys(requestBody).length > 0) { return true }
}
//    return Object.keys({requestBody}).length > 0;
// }

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
 }

const isValidString = function(value){
    //if (typeof value === 'string' && value.trim().length === 0) return false;
    if (typeof value === 'string' && value.length == 0) return false;
    return true;
} 

const isValidNumber = function(value){
    if(typeof value === 'number' && value.trim().length === 0) return false;
    return true;
}
const isValidNumber1 = function(value){
    if(typeof value === 'number' ) return true;
    
}
function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }



module.exports = {
    isValid,
    isValidTitle,
    isValidObjectId,
    isValidString,
    isValidNumber,
    isValidRequestBody,
    isValidNumber1,
    isValidDate
    
}