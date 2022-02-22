const express = require('express');

const router = express.Router();

const logger = require('../logger/logger');
const util = require('../util/helper');
const formatter = require('../validator/formatter');
const loder = require("../lodash/lodash")
//const obj = require('./logger')
router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
    console.log(util.date + util.month);
    util.information('Thorium, W3D1, the topic for today is Nodejs module system')
    logger.mywelcomefunction(`Welcome to my application. I am a ruby and a part of FunctionUp Thorium cohort.`)
    console.log(formatter.str);
    console.log(formatter.string);
    console.log(formatter.upper);    
});


router.get('/hello',function(req,res){
res.send
    
});



module.exports = router;
// adding this comment for no reason