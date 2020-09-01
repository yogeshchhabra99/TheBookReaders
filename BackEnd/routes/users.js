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
    booksToRead: [String],
    email: String,
    booksRead: [{
        bookId: String,
        review: String,
        rating: Number,
        favouriteLines: [String]
    }],
    lastMail:Number
});

const User = mongoose.model('Users', userSchema);

router.post('/login',(req,res)=>{
    //input validation 
    console.log("Login Request", req.body);
    validationResult = validateUser(req.body);
    if(validationResult.error){
        console.log("validation failed");
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
                email:req.body.email,
                lastMail:-1,
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
        name: Joi.string().min(1).required(),
        email: Joi.string().min(1).required(),
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

    User.findOne({_id:id_,booksRead:{$elemMatch:{bookId:req.body.bookId}}})
        .then((bookInBooksRead)=>{
            if(bookInBooksRead){
                console.log(`Book with id ${req.body.bookId} has been already added to booksRead`);
                res.status(400).send({
                    status:400,
                    error: `Book with id ${req.body.bookId} has been already added to booksRead`
                });
            }
            else{
                User.updateOne({_id:id_},{
                    $push:{
                        booksRead:{
                            bookId: req.body.bookId
                        }
                    }
                }).then((bookRead)=>{
                    console.log("Book is added to booksRead: ",bookRead);
                    res.status(200).send({
                        success:true,
                        bookRead:bookRead
                    });
                }).catch((e)=>{
                    console.log("Error adding in booksRead");
                    res.status(500).send({
                        success:false,
                        bookRead:e.message
                    });
                });
            }
        })
        .catch((e)=>{
            res.status(500).send({
                success:false,
                error:e.message
            });
        });
});

function validateBookRead(bookRead){
    const schema=Joi.object({
        bookId: Joi.string().min(1).required()
    });
    return schema.validate(bookRead);
}

//api to add a favourite line
router.post('/favouriteLine', (req, res)=>{
    //INPUT VALIDATION
    console.log(`good morning`);
    validationResult = validateFavouriteLine(req.body);
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
    // User.updateOne({_id:id_,booksRead:{$elemMatch:{bookId:req.body.bookId}}},{
    //     $push:{
    //         "booksRead.$[favouriteLines]":req.body.favouriteLine
    //     }
    // });
    //,booksRead:{$elemMatch:{bookId:req.body.bookId}}
    User.findOne({_id:id_,booksRead:{$elemMatch:{bookId:req.body.bookId}}}).then((user)=>{//return ;
        user.booksRead.forEach((b)=>{
            if(b.bookId==req.body.bookId){
                b.favouriteLines.push(req.body.favouriteLine);
            }  
        });
        return user.save();
    }).then((fav)=>{
        console.log(`favourite line is added for ${req.body.bookId}`);
        res.status(200).send({
            status:200,
            message:`favourite line is added for ${req.body.bookId}`
        });
    }).catch((e)=>{
        console.log("Error adding in favouriteLine");
        res.status(500).send({
            success:false,
            error:e.message
        });
    });
});

function validateFavouriteLine(line){
    const schema=Joi.object({
        bookId: Joi.string().min(1).required(),
        favouriteLine: Joi.string().min(1).required()
    });
    return schema.validate(line);
}

//api to add booksToRead to users profile
router.post('/booksToRead', (req, res)=>{
    //INPUT VALIDATION
    validationResult = validateBookToRead(req.body);
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

    User.findOne({_id:id_,booksToRead:req.body.bookId})
        .then((bookInBooksToRead)=>{
            if(bookInBooksToRead)
                console.log(`Book with id ${req.body.bookId} has been already added to booksToRead`);
            else{
                User.updateOne({_id:id_},{
                    $push:{
                        booksToRead:req.body.bookId
                    }
                }).then((bookToRead)=>{
                    console.log("Book is added to booksToRead: ",bookToRead);
                    res.status(200).send({
                        success:true,
                        bookToRead:bookToRead,
                    });
                }).catch((e)=>{
                    console.log("Error adding in booksToRead");
                    res.status(500).send({
                        success:false,
                        error:e.message
                    });
                });
            }
        })
        .catch((e)=>{
            res.status(400).send({
                success:false,
                error:`Book with id ${req.body.bookId} has been already added to booksToRead`
            });
        });
});

function validateBookToRead(bookToRead){
    const schema=Joi.object({
        bookId: Joi.string().min(1).required()
    });
    return schema.validate(bookToRead);
}

//Get all books he has read
router.get('/booksRead/:pageno',(req,res)=>{
    const token = req.header('x-auth-token');
    const id_= jwt.verify(token,config.get("tokenKey")).id;
    console.log(`Finding booksRead by : ${id_}`);
    User.findOne({_id:id_}).then((user)=>{
        if((req.params.pageno>user.booksRead.length/10+1) || (req.params.pageno<1)){
            console.log('No such page exists.');
            res.status(200).send({
                success : true,
                books : []
            });
            return;
        }
        else{
            let page = user.booksRead.slice((req.params.pageno-1)*10,req.params.pageno*10);
            console.log(page);
            res.status(200).send({
                success : true,
                books : page
            });
        }
    }).catch((e)=>{
        console.log(`Error retrieving booksToRead : `,e.message);
        res.status(500).send({
            success:false,
            error:e.message,
        });
    });
});

//Get all books he wants to read
router.get('/booksToRead/:pageno',(req,res)=>{
    const token = req.header('x-auth-token');
    const id_= jwt.verify(token,config.get("tokenKey")).id;
    console.log(`Finding booksToRead by : ${id_}`);
    User.findOne({_id:id_}).then((user)=>{
        if((req.params.pageno>user.booksToRead.length/10+1) || (req.params.pageno<1)){
            console.log('Error 404. No such page exists.');
            res.status(404).send({
                success : false,
                Error : `No page found.`
            });
            return;
        }
        else{
            let page = user.booksToRead.slice((req.params.pageno-1)*10,req.params.pageno*10);
            console.log(page);
            res.status(200).send({
                success : true,
                books : page
            });
        }
    }).catch((e)=>{
        console.log(`Error retrieving booksToRead : `,e.message);
        res.status(500).send({
            success:false,
            error:e.message,
        });
    });
});

function getAllUsers(){
    return User.findOne({});
}

module.exports = router;
module.exports.getAllUsers=getAllUsers;