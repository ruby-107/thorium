

const mongoose = require('mongoose')

const isVaild = (value)=>{
    if(typeof value === 'undefined' || typeof value === null) return false
    if(typeof value === 'String' ||  value.trim().length === 0)return false
    return true;
}
const isValidRequestBody = RequestBody => {
    return Object.keys(RequestBody).length > 0 ; };

   // const isVaildUrl =  /http(s?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/


module.exports = {
    isVaild,
    isValidRequestBody,
   // isVaildUrl
}