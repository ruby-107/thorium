const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
 const middleware = require("../middleware/auth")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser)

router.post("/login", userController.loginUser)


router.get("/users/:userId",middleware.tokenCheck,middleware.authorise, userController.getUserData)
router.post("/users/:userId/posts",middleware.tokenCheck,middleware.authorise, userController.postMessage)

router.put("/users/:userId",middleware.tokenCheck,middleware.authorise, userController.updateUser)
router.delete('/users/:userId',middleware.tokenCheck,middleware.authorise, userController.isdeletedUser)

module.exports = router;


