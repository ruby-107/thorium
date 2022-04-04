const { Router } = require('express')
const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/route')


const app = express()

app.use(express.json())
app.set('view engine', 'ejs')
app.use('/', router);

// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })





try {
    mongoose.connect("mongodb+srv://rubygupta7505:GDDYMfHDEGehjUj0@cluster0.xf64f.mongodb.net/ruby-Project4-shortUrl-db",{useNewUrlParser:true});
    console.log(`MongoDB connection successful.`);
} catch (error) {
    console.log(error);
}

const port = process.env.PORT || 3000;

app.listen(port, console.log(`Express App is running on ${port}`));