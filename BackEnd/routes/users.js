const express = require('express');
const mongoose = require('mongoose');   // we do not need to connect in each file separately but need to import
const router = express.Router();
const config = require('config');
const Joi =require('joi');
const jwt=require('jsonwebtoken');

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

function validateUser(user){
    const schema=Joi.object({
        userId: Joi.string().min(1).required(),
        name: Joi.string().min(1).required()
    });
    return schema.validate(user);
}

router.post('/login',(req,res)=>{
    //input validation 
    validationResult = validateUser(req.body)
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
            res.header('x-auth-token',token).send({success:true})
        }
        else{
            user = new User({
                userId:req.body.userId,
                name:req.body.name,
            });
            user.save().then((user)=>{
                const token= jwt.sign({id: user._id}, config.get("tokenKey"));
                res.header('x-auth-token',token).send({success:true})
            });
        }
    })
    .catch((e)=>{
        console.log("Error finding user",e.message);
        res.status(500).send({
            success:false,
            error:e.message,
        })
    })
})


module.exports = router;