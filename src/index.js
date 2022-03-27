const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('./route/route')
const bodyParser = require('body-parser');


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', route);




try {
    mongoose.connect("mongodb+srv://rubygupta7505:GDDYMfHDEGehjUj0@cluster0.xf64f.mongodb.net/ruby-Project3-book-management-db",{useNewUrlParser:true});
    console.log(`MongoDB connection successful.`);
} catch (error) {
    console.log(error);
}


const port = process.env.PORT || 3000;

app.listen(port, console.log(`Express App is running on ${port}`));