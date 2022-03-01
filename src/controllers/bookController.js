
    const BookModel= require("../models/bookModel")

    const createBook= async function (req, res) {
        let data= req.body
        let savedBook= await BookModel.create(data)
        res.send({book: savedBook})
    }
    const getBooksData= async function (req, res) {
        let allBooks= await BookModel.find().select({authorName:1,bookName:1,_id:0})  
        res.send({msg: allBooks})
    }
    
    const getByYear= async function (req, res) {
        let yearFilter= await BookModel.find({year:2020} )
        res.send({year: yearFilter})
    }
    
    const getXINRBooks= async function (req, res) {
        let inrRupee= await BookModel.find( { "prices.indianPrice":{$in:[100,200]} })
        res.send({inrBook: inrRupee})
    }
    
    const getRandomBooks = async function (req, res) {
        let random= await BookModel.find( { $or:[{stockAvailable:true},{totalPage:{$gt:500}}] })
        res.send({randomBook: random})
    }
    
    const getParticularBooks= async function (req, res) {
        let getParticular= await BookModel.findOne().select( {bookName: 1,year:1, _id:0} )
        res.send({year: getParticular})
    }
    
    
    
    
     module.exports.getRandomBooks=getRandomBooks
    module.exports.getXINRBooks=getXINRBooks
    module.exports.getByYear= getByYear
    module.exports.getParticularBooks=getParticularBooks
    module.exports.createBook= createBook
    module.exports.getBooksData=getBooksData