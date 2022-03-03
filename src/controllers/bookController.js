
const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")

const createbook2 = async (req,res)=>{
  let book = req.body
  let allBook = await bookModel.create(book)
  res.send({msg:allBook})
}

const createBook= async function (req, res) {
    let book = req.body
    let authorId = book.author_id
    let publisherId = book.publisher_id

 
  if(!authorId){
       return res.send('The request is not valid as the author details are required.')
  }
    let author1 = await authorModel.findById(authorId)
    if(!author1) {
        return res.send('The request is not valid as no author is present with the given author id')
    }
    if(!publisherId) {
        return res.send('The request is not valid as the publisher details are required.') 
    }
   let publisher1 = await publisherModel.findById(publisherId)
     if(!publisher1){
     return res.send('The request is not valid as no publisher is present with the given publisher id')
     }
   let bookCreated = await bookModel.create(book)
   return res.send({data: bookCreated})
 }
 const getBooksData= async function (req, res) {
         let books = await bookModel.find().populate("author_id").populate("publisher_id")
          res.send({data: books})
      }


 const putBook= async function (req,res){
     const update = await bookModel.updateMany({$or: [{"publisher":"6220883e9def1d7b549321e4" },{"publisher": "62206a75214ed3541edebafd"}]},{"isHardCover" : false},{new:true});
      res.send({msg: "update done check for the database for new updates"})
    }
   const updatePriceByRating = async function(req,res){
       const updatePrice = await bookModel.updateMany({rating:{$gt:3.5}},{$inc:{price:+10}},{new:true})
       res.send(updatePrice)
   }
    
        
  

    module.exports.putBook= putBook
  module.exports.updatePriceByRating = updatePriceByRating 
  module.exports.createBook= createBook
  module.exports.getBooksData= getBooksData
  module.exports.createbook2=createbook2


