const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const config = require('config');
const Joi =require('joi');
const { ValidationError } = require('joi');
const jwt = require('jsonwebtoken');
const authors = require('./authors.js');

const uri = `mongodb+srv://admin:${config.get('MONGO_PASSWORD')}@cluster0.bipqf.mongodb.net/thebookreaders?retryWrites=true&w=majority`;
console.log(config.get('name'));
mongoose.connect(uri, {
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
router.get('/bookId/:id', (req, res) => {
    console.log("Find book with id:",req.params.id);
    Book.findOne({_id:req.params.id})
        .then((book_)=>{
            console.log(book_);
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

//searchBooks with partial keywords
router.get('/search/:title',(req,res)=>{
    console.log("/"+req.params.title+"/");
    //Book.find({title:{$regex:"/"+req.params.title+"/", $options:'i'}})
    Book.find({title:new RegExp(req.params.title,'i')})
    //Book.find({title:req.params.title})
    .then((results)=>{
        console.log(results);
        matches=results.slice(0,10);
        res.status(200).send({
            success:true,
            books:matches});
    })
    .catch((e)=>{
        console.log(e);
        res.status(500).send({success:false,error:e.message});
    })
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
            authors.addBookToAuthor(req.body.author.id, bookAdded._id).then((m)=>{
                console.log(m.message);
            }).catch((e)=>{
                console.log(e.message);
            });
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
});

/// <summary>validate if the book we got by Post request is valid</summary>
/// <parameter>body of the request</parameter>
/// <returns>JOI validation result, result.error exists if validation fails</returns>
function validationBook(book){
    //input validation
    const schema=Joi.object({
        title: Joi.string().min(1).required(),
        author:{
            id: Joi.string().min(1).required(),
            name: Joi.string().min(1).required()
        },
        genre: Joi.string().min(1).required()
    });
    return schema.validate(book);
}

//Add a review to the book
router.post('/addReview', (req, res) =>{
    //input validation
    validationResult = validationReview(req.body);
    if(validationResult.error){
        res.status(400).send({
            success: false,
            error: validationResult.error
        });
        return;
    }
    //update reviews[] if book exists
    const token = req.header('x-auth-token');
    Book.updateOne(
        {_id:req.body.bookId},
        {
            $push:{
                reviews:{
                    review: req.body.review,
                    id: jwt.verify(token,config.get("tokenKey")).id
                }
            }
        }
    )
    .then((reviewAdded)=>{
        if(reviewAdded.n){
            console.log("Review Added: ",reviewAdded);
            res.status(200).send({
                success:true,
                review:reviewAdded
            });
        }
        else{
            console.log(`No book with bookId : "${req.body.bookId}" is found.`);
                res.status(404).send({
                    success:false,
                    review:reviewAdded
                });
        }
    }).catch((e)=>{
        console.log("Error Adding Review", e.message);
        res.status(500).send({
            success: false,
            error: e.message
        });
    });  
});
/// <summary>validate if the review we got by Post request is valid</summary>
/// <parameter>body of the request</parameter>
/// <returns>JOI validation result, result.error exists if validation fails</returns>
function validationReview(newReview){
    const schema = Joi.object({
        bookId : Joi.string().min(1).required(),
        review : Joi.string().min(1).required()
    });
    return schema.validate(newReview);
}

//api to addRating
router.post('/addRating', (req,res)=>{
    //input validation
    validationResult = validationRating(req.body);
    if(validationResult.error){
        res.status(400).send({
            success: false,
            error: validationResult.error
        });
        return;
    }
    Book.updateOne({_id:req.body.bookId},{
        totalRating:totalRating+req.body.rating,
        numRatings:numRatings+1
    }).then((rating)=>{
        console.log(`Rating updated. New Rating is ${totalRating/numRatings}`);
        res.status(200).send({
            success:true,
            message:`Rating updated. New Rating is ${totalRating/numRatings}`
        });
    }).catch((e)=>{
        console.log(`Error in updating ratings : ${e.message}`);
        res.status(200).send({
            success:true,
            error: e.message
        });
    });
});

function validationRating(newRating){
    const schema = Joi.object({
        bookId : Joi.string().min(1).required(),
        rating : Joi.number().greater(0).less(11).required()
    });
    return schema.validate(newReview);
}

router.get('/:pageno', (req, res)=>{
    Book.find({}).then((book)=>{
    console.log(book);
    if((req.params.pageno>book.length/10+1) || (req.params.pageno<1)){
        console.log('Error 404. No such page exists.');
        res.status(404).send({
            success : false,
            Error : `No page found.`
        });
        return;
    }
    else{
        let page = book.slice((req.params.pageno-1)*10,req.params.pageno*10);
        console.log(page);
        res.status(200).send({
            success : true,
            books : page
        });
    }
    });
});

function findBook(bookToFind){
    return new Promise((resolve, reject)=>{
        Book.findOne({_id:bookToFind}).then((book)=>{
            if(book){
                resolve( obj ={
                    name : book.title,
                    id : book._id
                });
            }
            else{
                reject({
                    status:404,
                    message:'Book not found.',
                });
            }
        }).catch((e)=>{
            console.log("Error : ",e.message);
            reject({
                status:500,
                message:"Error finding book"
            });
        });
    });
}
module.exports = router;
module.exports.findBook = findBook;
