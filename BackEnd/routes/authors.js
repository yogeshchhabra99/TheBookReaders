const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const config = require('config');
const Joi =require('joi');

const authorSchema = new mongoose.Schema({
    name: String,
    books:[String]
});

const Author = mongoose.model('Authors', authorSchema);

router.post('/newAuthor', (req, res)=>{
    //input validation
    validationResult=validationAuthor(req.body);
    if(validationResult.error){
        res.status(400).send(
            {
                success: false,
                error: validationResult.error
            });
        return;
    }
    const author = new Author({
        name: req.body.name
    });
    author.save()
        .then((authorAdded)=>{
            console.log("Author Added: ",authorAdded);
            res.status(200).send({
                success:true,
                author:authorAdded
            });
        }).catch((e)=>{
            console.log("Error Adding Author", e.message);
            res.status(500).send({
                success: false,
                error: e.message
            });
        });
});

function validationAuthor(author){
    //input validation
    const schema=Joi.object({
        name: Joi.string().min(1).required()
    });
    return schema.validate(author);
}

router.get('/:id/:pageno',(req,res)=>{
    console.log(`Finding books by author : ${req.params.id}`);
    Author.findOne({_id:req.params.id}).then((author)=>{
        if((req.params.pageno>author.books.length/10+1) || (req.params.pageno<1)){
            console.log('Error 404. No such page exists.');
            res.status(404).send({
                success : false,
                Error : `No page found.`
            });
            return;
        }
        else{
            let page = author.books.slice((req.params.pageno-1)*10,req.params.pageno*10);
            console.log(page);
            res.status(200).send({
                success : true,
                books : page
            });
        }
    }).catch((e)=>{
        console.log(`Error retrieving author with id:${req.params.id}`,e.message);
        res.status(500).send({
            success:false,
            error:e.message,
        });
    });
});

router.post('/addBook', (req, res)=>{
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
    Author.updateOne({_id:req.body.id},{
        $push:{
            books:req.body.book
        }
    }).then((book)=>{
        console.log(`${req.body.book} is added to author with id ${req.body.id}`);
        res.status(200).send({
            status:true,
            book: book,
            message: `${req.body.book} is added to author with id ${req.body.id}`
        });
    }).catch((e)=>{
        console.log(`Error in adding book`,e.message);
        res.status(500).send({
            success:false,
            error:e.message,
        });
    });
});

function validationBook(book){
    //input validation
    const schema=Joi.object({
        id: Joi.string().min(1).required(),
        book: Joi.string().min(1).required()
    });
    return schema.validate(book);
}

module.exports = router;