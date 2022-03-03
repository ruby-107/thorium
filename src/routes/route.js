const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const bookController= require("../controllers/bookController")
const publishController= require("../controllers/publishController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/NewAuthor", authorController.NewAuthor  )

router.post("/NewPublish", publishController.NewPublish)

router.post("/createBook", bookController.createBook  )

router.get("/getBooksData", bookController.getBooksData  )

router.get("/putBook", bookController.putBook)

router.get("/updatePriceByRating", bookController.updatePriceByRating )
router.put("/createBook2", bookController.createbook2)


module.exports = router;