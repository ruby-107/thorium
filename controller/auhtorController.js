const authorModel = require('../model/authorModel');



const createAuthor = async(req, res) => {
    try {
        let author = req.body
        let creAut = await authorModel.create(author)
        res.status(201).send({ data: creAut })
        console.log(creAut)
    } catch (e) {
        res.status(500).send({ msg: e.msg })
    }
}

module.exports.createAuthor = createAuthor