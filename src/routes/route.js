const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const tokenChecken = require("../middleware/auth")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


//router.post("/createUser", userController.createUser  )


router.post("/users", userController.createUser  )
 
router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId",tokenChecken.tokenCheck, userController.getUserData)

router.put("/users/:userId",tokenChecken.tokenCheck, userController.updateUser)

router.delete("/users/:userId",tokenChecken.tokenCheck, userController.deleteUser)


module.exports = router;