// this api says that you can save and update your data using mongo database.

const express = require('express');
const router = express.Router();
const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createBook", UserController.createBook  )

router.get("/getBooks", UserController.getBooks)

module.exports = router;