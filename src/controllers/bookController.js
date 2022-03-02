
const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")


const createBook= async function (req, res) {
    let book = req.body
    // let bookCreated = await bookModel.create(book)
    // res.send({data: bookCreated})
    
    let authId = book.author
    let publisherId = book.publisher
    
    if(!authId) return res.send('The request is not valid as the author details are required.')
    //console.log("authorId")
    
    let author = await authorModel.findById(authId)
    if(!authId) return res.send('The request is not valid as no author is present with the given author id')
    //console.log("authorId")
    if(!publisherId) return res.send('The request is not valid as the publisher details are required.') 
    //console.log("authorId")
    let publisher = await publisherModel.findById(publisherId)
    if(!publisher) return res.send('The request is not valid as no publisher is present with the given publisher id')
    
    let bookCreated = await bookModel.create(book)
    return res.send({data: bookCreated})
    //console.log("authorId") 
}

const getBooksData= async function (req, res) {
    let books = await bookModel.find().populate('author','publisher')
    res.send({data: books})
}

// const getBooksWithAuthorDetails = async function (req, res) {
//     let specificBook = await bookModel.find().populate('author_id')
//     res.send({data: specificBook})

// }

module.exports.createBook= createBook
 module.exports.getBooksData= getBooksData
// module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails


//find().select(author_id)