const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const controlller = require('../controllers/urlController')



// router.get("/test-me", function (req, res) {
//         res.send("My first ever api!")
//     })

router.post("/url/shorten", controlller.createUrl);
router.get("/:urlCode", controlller.getUrl);

    module.exports = router;
    