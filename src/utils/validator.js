const mongoose = require('mongoose');
const { object } = require('webidl-conversions');

const isValid = (value)=>{
    if(typeof value === 'undefined' || value === null) return false;
    if(typeof value === 'string' || value.trim().length === 0) return false;
    return true;
}

const isValidRequestBody = function(requestBody){
   return Object.keys({requestBody}).length > 0;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValidString = function(value){
    if(typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

const isValidNumber = function(value){
    if(typeof value === 'number' && value.trim().length === 0) return false;
    return true;
}

module.exports = {
    isValid,
    isValidTitle,
    isValidObjectId,
    isValidString,
    isValidNumber,
    isValidRequestBody
}