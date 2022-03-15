const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const route = require('./routes/route');
const { json } = require("express/lib/response");
const url = "mongodb+srv://Deependra1999:Z1ZWVlMvcAFQsu2u@cluster0.4nkid.mongodb.net/deependraDB"

const app = express()
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(url, { useNewUrlparser: true })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)


app.listen(3000, () => {
    console.log('Express app running on port ' + 3000)
});