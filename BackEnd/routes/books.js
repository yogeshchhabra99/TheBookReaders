const express= require('express');
const router = express.Router();

const books =[
    {id:1, title:'The Great Gatsby', author:'DontKnow',},
    {id:2, title:'Immortals of Meluha', author:'DontKnow',}
]

//get all books
router.get('/',(req,res)=>{
    res.send(books);
});

//get book with an id
router.get('/:id',(req,res)=>{
    const book = books.find(b => b.id == parseInt(req.params.id)); 
    if(!book){
        res.status(404).send(`The book with given id=${req.params.id} was not found!`);
        return;
    }
    res.send(book);
});

//add a new book
router.post('/',(req,res)=>{
    const validationResult=Joi.validate(req.body, schema);

    if(validationResult.error){
        // 400 bad request
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }

    const book = {
        id: books.length +1,
        title: req.body.title,
        author: req.body.author
    }
    console.log(req.body);
    books.push(book);
    res.send(book);
})

router.put('/',(req,res)=>{
    //look for the book
    const book = books.find(b => b.id == parseInt(req.params.id)); 
    if(!book){
        res.status(404).send(`The book with given id=${req.params.id} was not found!`);
        return;
    }
    
    const validationResult=validateBook(req.body);
    if(validationResult.error){
        // 400 bad request
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }
});

function validateBook(book){
    const schema={
        name: Joi.string().min(1).required(),
        author:Joi.string().min(1).required()
    }
    return validationResult=Joi.validate(book, schema);
}

module.exports = router;