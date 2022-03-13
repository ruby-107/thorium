const { count } = require("console")
const productModel= require("../models/productModel")


const createProduct= async function (req, res) {
    let product= req.body

    let savedData= await productModel.create(product)
    res.send({msg: savedData})
}



module.exports.createProduct= createProduct