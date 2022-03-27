const userModel = require("../model/userModel")
const validator = require("../utils/validator");
const jwt = require('jsonwebtoken')






const createUser = async function (req, res) {
    let requestBody = req.body
    try {

        if (Object.keys(requestBody).length === 0) {
            res.status(400).send({ status: false, msg: `Invalid Input. Please enter user details!` })
            return
        }

        const { title, name, phone, email, password } = requestBody

        if (!validator.isValidString(title)) {
            res.status(400).send({ status: false, msg: "title is required" })
            return
        }
        if (!validator.isValidTitle(title)) {
            res.status(400).send({ status: false, msg: `title should be like Mr,Mrs,Miss` })
            return
        }
        if (!validator.isValidString(name)) {
            res.status(400).send({ status: false, msg: "name is required" })
            return
        }
        if (!validator.isValidString(phone)) {
            res.status(400).send({ status: false, msg: `phone is requried` })
            return
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {
            res.status(400).send({ status: false, msg: `Invalid phone Number!` });
            return
        }
        const isPhoneAlreadyUsed = await userModel.findOne({ phone });
        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, msg: `${phone} is already used` })
            return
        }
        if (!validator.isValidString(email)) {
            res.status(400).send({ status: false, msg: `email is required` })
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).send({ status: false, msg: `Invalid email address!` })
            return
        }
        const isEmailAlreadyUsed = await userModel.findOne({ email })

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, msg: `${email} is already used` })
            return
        }
        if (!validator.isValidString(password)) {
            res.status(400).send({ status: false, msg: `password is required` })
            return
        }
        // if(!(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/.test(password)))
        // return res.status(400).send({ status : false, msg :`password length should be betwwen 8-15` })


        let user = await userModel.create(req.body)
        res.status(201).send({ status: true, data: user })
        return
    }
    catch (error) {
        res.status(500).send({ status: "failed", message: error.message })
    }

}

const login = async function (req, res) {
   
    try {
           let requestBody = req.body
        if (Object.keys(requestBody).length === 0) {
            res.status(400).send({ status: false, msg: `Invalid request parameter. please fill detail.` })
            return
        }


        //   if(validator.isValidRequestBody(requestBody)){
        //       res.status(400).send({ status: false, msg : `Invaild request parameter. please fill detail`})
        //       return
        //   }

        const { email, password } = requestBody

        if (!validator.isValidString(email)) {
            res.status(400).send({ status: false, msg: `email is required` })
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).send({ status: false, msg: `Invalid email address!` })
            return
        }
        if (!validator.isValidString(password)) {
            res.status(400).send({ status: false, msg: `password is required` })
            return
        }
        const user = await userModel.findOne({ email, password });
        if (!user) {
            res.status(400).send({ status: false, msg: `Invaild login detail` })
            return
        }
        let payload = { _id: user._id }
        let token = await jwt.sign(payload,
            //exp: Math.floor(Date.now() / 1000) + 10*60*60
            'Project-Books', { expiresIn: '30000mins' })
        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}





module.exports = {
    createUser,
    login
}


