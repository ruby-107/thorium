const express = require('express');
const jwt = require("jsonwebtoken")

const controller = require("../controller/auhtorController")
const controller1 = require("../controller/blogController")
const router = express.Router();


router.post("/author", controller.createAuthor)

router.post("/blog", controller1.Blogs)

router.get("/blog", controller1.getBlogs)

router.put("/blog/:blogId", controller1.updating)

router.delete("/blog/:blogId", controller1.deleting)

router.delete("/blog", controller1.specificDeleting)



module.exports = router