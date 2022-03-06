const express = require('express');
const moment = require("moment")
const requestIp = require("request-ip")
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://functionup-cohort:G0Loxqc9wFEGyEeJ@cluster0.rzotr.mongodb.net/Pritesh8769811-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

const globalmiddleware = function(req,res,next){
   let date = moment().format('MMMM DD YYYY, h:mm:ss ')
  // const type = req.originalurl
  let ip = req.ip;
  
   console.log(date,ip);
 // console.log(req.socket.remoteAddress);
  next()
}
 
app.use(globalmiddleware);

app.use("/",route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
