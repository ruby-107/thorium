const express = require('express');

const router = express.Router();

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

//1

router.get('/movies', function (req, res) {
 

    res.send('["singham","ready","dhoom","kabir Singh","om shanti on","wanted"]');





});

// Q2 & 3


router.get('/movies/1', function (req, res) {
 

    let movies = ["singham","ready","dhoom","kabir Singh","om shanti on","wanted"];

    let result = req.params.moviesId;


    if(result > movies.length - 1 ){
        res.send('"doesent exits"');
    }else{
        res.send(movies[result])
    }
});

/// Q4`


router.get('/films', function (req, res) {
 
    let id = [
        {
        "id": 1,
        "name": "The Shining"
       }, {
        "id": 2,
        "name": "Incendies"
       }, {
        "id": 3,
        "name": "Rang de Basanti"
       }, {
        "id": 4,
        "name": "Finding Demo"
       }]
    res.send(id);
    
});
//Q5
router.get('/films:filmId', function (req, res) {
 
    let movie = [
        {
        "id": 1,
        "name": "The Shining"
       }, {
        "id": 2,
        "name": "Incendies"
       }, {
        "id": 3,
        "name": "Rang de Basanti"
       }, {
        "id": 4,
        "name": "Finding Demo"
       }]
     let values = req.params.filmId;

     let found = 0;
       for (i=0; i < movie.length;i++){
     if (movie[i].id == values){
         found = 1;
         res.send(movie[i])
         break;
     
     
        }
       }

       if(found == 0 ){
           res.send("No movie exist with this id");
       }

       
});







module.exports = router;
// adding this comment for no reason