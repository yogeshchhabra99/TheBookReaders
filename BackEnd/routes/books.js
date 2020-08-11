const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const config = require('config');
const Joi =require('joi');

console.log(config.get('name'));
mongoose.connect(config.get('mongodb'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Error connecting to mongodb"));



const bookSchema = new mongoose.Schema({
    title: String,
    author: {
        name:String,
        id:String,
    },
    genre: String,
    totalRating: Number,
    numRatings: Number,
    reviews: [{
        review: String,
        id: String
    }]
});



const genreSchema = new mongoose.Schema({
    genre: String
});

const Book = mongoose.model('Books', bookSchema);

//get book with an id
router.get('/:id', (req, res) => {
    console.log("Find book with id:",req.params.id);
    Book.findOne({_id:req.params.id})
        .then((book_)=>{
            res.status(200).send({
                success:true,
                book:book_
            });
        }).catch((e)=>{
            console.log(`Error retrieving book with id:${req.params.id}`,e.message);
            res.status(500).send({
                success:false,
                error:e.message,
            });
        });
    
});



//Add a new book
router.post('/newBook',(req,res)=>{
    //input validation
    validationResult=validationBook(req.body);
    if(validationResult.error){
        res.status(400).send(
            {
                success: false,
                error: validationResult.error
            });
        return;
    }

    const book = new Book({
        title: req.body.title,
        author:{
            id: req.body.author.id,
            name: req.body.author.name
        },
        genre:req.body.genre 
    });

    book.save()
        .then((bookAdded)=>{
            console.log("Book Added: ",bookAdded);
            res.status(200).send({
                success:true,
                book:bookAdded
            });
        }).catch((e)=>{
            console.log("Error Adding Book", e.message);
            res.status(500).send({
                success: false,
                error: e.message
            });
        });
})

/// <summary>validate if the book we got by Post request is valid</summary>
/// <parameter>body of the request</parameter>
/// <returns>JOI vvalidation result, result.error exists if validation fails</returns>
function validationBook(book){
    const schema=Joi.object({
        title: Joi.string().min(1).required(),
        author:{
            id: Joi.string().min(1).required(),
            name: Joi.string().min(1).required(),
        },
        genre: Joi.string().min(1).required()
    });
    return schema.validate(book);
}


module.exports = router;