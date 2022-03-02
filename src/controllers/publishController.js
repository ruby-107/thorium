const publisherModel = require("../models/publisherModel")



const NewPublish= async function (req, res) {
    let publish = req.body
    let publishCreated = await publisherModel.create(publish)
    res.send({data: publishCreated})
}


module.exports.NewPublish= NewPublish