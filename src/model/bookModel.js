
const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
 
      title : { type : String, required : true, unique : true,  trim : true },
       excerpt : { type : String, require : true, trim : true },
        userId : { type : mongoose.Schema.Types.ObjectId,  require : true, refs : 'user', trim : true },
        ISBN : { type : String, require: true, unique: true, trim : true},
        category : { type : String, require : true},
        subcategory : { type : [String], require : true},  
        reviews : { type : Number, default : 0},                    //comment: Holds number of reviews of this book
        deletedAt : { type : Date},
        isDeleted : { type: Boolean, default : false},             //when the document is deleted
        releasedAt : { type : Date, require : true},                           //format("YYYY-MM-DD")           

    } ,   { timestamp : true})
    
    module.exports = mongoose.model('book',bookSchema)











