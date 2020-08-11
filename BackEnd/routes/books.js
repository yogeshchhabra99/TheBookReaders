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
    author: String,
    genre: String,
    rating: Number,
    totalRatings: Number,
    reviews: [{
        review: String,
        id: String
    }]
});



const genreSchema = new mongoose.Schema({
    genre: String
});

const Book = mongoose.model('Books', bookSchema);
const Genre = mongoose.model('genres', genreSchema);


//get all books
router.get('/', (req, res) => {

});

//get book with an id
router.get('/:id', (req, res) => {
    const book = books.find(b => b.id == parseInt(req.params.id));
    if (!book) {
        res.status(404).send(`The book with given id=${req.params.id} was not found!`);
        return;
    }
    res.send(book);
});

//add a new book
router.post('/', async (req, res) => {
    try {
        const validationResult = validateBook(req.body);

        if (validationResult.error) {
            // 400 bad request
            res.status(400).send(validationResult.error.details[0].message);
            return;
        }

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre
        });

        const bookout = await book.save()
        console.log("book added", bookout);
        res.send(bookout);
    }
    catch(err){
        console.error(err);
        res.status(400).send(`Error processing request ${err.message}`);
    }
})

//update
router.put('/', (req, res) => {
    //look for the book
    const book = books.find(b => b.id == parseInt(req.params.id));
    if (!book) {
        res.status(404).send(`The book with given id=${req.params.id} was not found!`);
        return;
    }

    const validationResult = validateBook(req.body);
    if (validationResult.error) {
        // 400 bad request
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }
});

//Api to

function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        author: Joi.string().min(1).required(),
        genre: Joi.string().min(1).required(),
    });
    return validationResult = schema.validate(book);
}

module.exports = router;