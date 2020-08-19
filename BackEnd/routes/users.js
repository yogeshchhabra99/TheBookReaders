const express = require('express');
const mongoose = require('mongoose');   // we do not need to connect in each file separately but need to import
const router = express.Router();
const config = require('config');
const Joi =require('joi');
const jwt=require('jsonwebtoken');
const books = require('./books.js');

const userSchema = new mongoose.Schema({
    name: String,
    userId: String, //provided by google
    booksToRead: [{
        id:String,
        name: String
    }],

    booksRead: [{
        bookId: String,
        name:String,
        review: String,
        rating: Number,
        favouriteLines: [String],
    }]
});

const User = mongoose.model('Users', userSchema);

router.post('/login',(req,res)=>{
    //input validation 
    validationResult = validateUser(req.body);
    if(validationResult.error){
        res.status(400).send(
            {
                success: false,
                error: validationResult.error
            });
        return ;
    }

    //check if user exists
    User.findOne({userId:req.body.userId}).then((user)=>{
        if(user){
            //if user exists
            const token= jwt.sign({id: user._id}, config.get("tokenKey"));
            res.header('x-auth-token',token).send({success:true});
        }
        else{
            user = new User({
                userId:req.body.userId,
                name:req.body.name,
            });
            user.save().then((user)=>{
                const token= jwt.sign({id: user._id}, config.get("tokenKey"));
                res.header('x-auth-token',token).send({success:true});
            });
        }
    })
    .catch((e)=>{
        console.log("Error finding user",e.message);
        res.status(500).send({
            success:false,
            error:e.message,
        });
    });
});

function validateUser(user){
    const schema=Joi.object({
        userId: Joi.string().min(1).required(),
        name: Joi.string().min(1).required()
    });
    return schema.validate(user);
}

//api to add booksRead to users profile
router.post('/booksRead', (req, res)=>{
    //INPUT VALIDATION
    validationResult = validateBookRead(req.body);
    if(validationResult.error){
        res.status(400).send(
            {
                success: false,
                error: validationResult.error
            });
        return ;
    }
    //retrieving user id from token key
    const token = req.header('x-auth-token');
    const id_= jwt.verify(token,config.get("tokenKey")).id;
    User.findOne({_id:id_,booksRead:{$elemMatch:{bookId:req.body.bookId}}}).then((id)=>{
        if(id){
            console.log(`Book with id ${req.body.bookId} has been already added to booksRead`);
            res.status(500).send({
                success:false,
                Error:`Book with id ${req.body.bookId} has been already added to booksRead`
            });
        }
        else{
            //sending bookId to books.js to find whether the book exist in database or not
            //retrieving a promise bookSearch
            const bookSearch = books.findBook(req.body.bookId);
            //Updating booksRead for the user
            bookSearch.then((result)=>{
                User.updateOne({_id:id_},{
                    $push:{
                        booksRead:{
                            bookId:result.id,
                            name : result.name
                        }
                    }
                }).then((bookRead)=>{
                    console.log("Book is added to booksRead: ",result);
                    res.status(200).send({
                        success:true,
                        bookRead:bookRead,
                        bookAdded:result
                    });
                }).catch((e)=>{
                    console.log("Error : ",e.message);
                    res.status(500).send({
                        success:false,
                        Error:e.message
                    });
                });
            }).catch((result)=>{
                console.log(`Book with id "${req.body.bookId}" is not found.`);
                res.status(404).send({
                    success:false,
                    bookRead:result
                });
            });
        }
    }).catch((e)=>{
        console.log("Error : ",e.message);
        res.status(500).send({
            success:false,
            Error:e.message
        });
    });
    
});

function validateBookRead(bookRead){
    const schema=Joi.object({
        bookId: Joi.string().min(1).required()
    });
    return schema.validate(bookRead);
}

module.exports = router;