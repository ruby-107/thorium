const Userbook= require("../models/userModel")

const createBook= async function (req, res) {
    let data= req.body
    let savedData= await Userbook.create(data)
    res.send({msg: savedData})
}

const getBooks= async function (req, res) {
    let allbooks= await Userbook.find()
    res.send({book: allbooks})
}

module.exports.createBook= createBook
module.exports.getBooks= getBooks