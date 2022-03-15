let blogModel = require('../model/blogModel');
let authorModel = require('../model/authorModel');
const jwt = require('jsonwebtoken')



//===============================================================================================================================
let Blogs = async function(req, res) {

    try {
        let data = req.body
        let authorId = data.authorId
        let authorReq = await authorModel.findById(authorId)
        if (authorReq) {
            let createBlog = await blogModel.create(data)
            res.status(201).send({ status: true, data: createBlog })
        } else {
            res.status(400).send({ status: false, msg: `${authorId} is not available, please enter valid authorId` })
        }
    }
    //}
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

};
//================================================================================================================================
const getBlogs = async function(req, res) {

        try {

            let array = []
            let authorId = req.query.authorId
            let tags = req.query.tags
            let category = req.query.category
            let subcategory = req.query.subcategory
            let blog = await blogModel.find({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }] })

            if (blog.length > 0) {

                for (let element of blog) {

                    if (element.isDeleted === false && element.isPublished === true) {

                        array.push(element)

                    }

                }
                res.status(200).send({ status: true, data: array })
            } else {
                res.status(404).send({
                    status: false,
                    msg: "no such blog found"
                })
            }

        } catch (err) {
            console.log(err)
            res.status(500).send({ status: "failed", message: err.message })
        }

    }
    //================================================================================================================================
const updating = async function(req, res) {
    const Id = req.params.blogId
    try {
        if (Id) {
            let data = await blogModel.findById(Id)
            if (data.isDeleted == false) {
                let value1 = req.body.bodyupdate
                let value2 = req.body.title
                const arr2 = req.body.subCategory
                const arr1 = req.body.tags
                data.tags = data.tags.concat(arr1)
                const result1 = data.tags.filter(b => b != null)

                data.subCategory = data.subCategory.concat(arr2)

                const result2 = data.subCategory.filter(b => b != null)

                let data2 = await blogModel.findOneAndUpdate({ _id: Id }, { title: value2, body: value1, tags: result1, subCategory: result2 }, { new: true })
                if (data.isPublished == false)
                    data2 = await blogModel.findOneAndUpdate({ _id: Id }, { isPublished: true, publishedAt: Date.now() }, { new: true })
                res.status(200).send({ status: true, msg: data2 })
            } else
                res.status(404).send({ status: "false", msg: "data is already deleted" })

        } else
            res.status(404).send({ status: "false", msg: "id is not exist" })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

//===================================================================================================================================================
const deleting = async function(req, res) {
    try {
        let id = req.params.blogId
        let data = await blogModel.findById(id)
        if (data) {
            if (data.isDeleted == false) {
                data2 = await blogModel.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: new Date() }, { new: true }, { upsert: true })
                res.status(200).send({ status: true, msg: "data deleted", data: data2 })
            } else {
                res.status(400).send({ status: false, msg: "data already deleted" })
            }
        } else {
            res.status(404).send({ status: false, msg: "id does not exist" })
        }

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}






//==========================================================================================================================================================

const specificDeleting = async(req, res) => {
    try {
        const category = req.query.category
        const authorId = req.query.authorId
        const tags = req.query.tags
        const subCategory = req.query.subCategory
        let blogs = await blogModel.find({ $or: [{ category: category }, { authorId: authorId }, { tags: tags }, { subCategory: subCategory }] })
        let result = []
        if (blogs.length > 0) {
            for (let ele of blogs) {
                if (ele.isDeleted == false && ele.isPublished == false) {
                    let data = await blogModel.findOneAndUpdate({ _id: ele._id }, { $set: { isDeleted: true } }, { new: true })
                    result.push(data)
                    res.status(200).send({ status: true, data: result })
                } else {
                    res.status(400).send({ status: false, msg: "data already deleted" })
                }
            }
        } else {
            res.status(400).send({ msg: "data is unavailable" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}





module.exports.getBlogs = getBlogs
module.exports.Blogs = Blogs;
module.exports.deleting = deleting;
module.exports.updating = updating;
module.exports.specificDeleting = specificDeleting