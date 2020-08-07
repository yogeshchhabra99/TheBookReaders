const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const config = require('config');
const Joi =require('joi');

const userSchema = new mongoose.Schema({
    name: String,
    token: String,
    booksToRead: [String], //array of bookids
    booksRead: [{
        bookId: String,
        review: String,
        rating: Number,
        favouriteLines: [String],
    }]
});

const User = mongoose.model('Users', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        token: Joi.string().min(1).required(),
    });
    return validationResult = schema.validate(user);
}

router.post('/', async (req, res) => {
    try {
        const validationResult = validateUser(req.body);
        if (validationResult.error) {
            // 400 bad request
            res.status(400).send(validationResult.error.details[0].message);
            return;
        }
        const user= new User({
            name:req.body.name,
            token:req.body.token
        });

        const userout = await user.save()
        console.log("user added", userout);
        res.send(userout);
    }
    catch(err){
        console.error(err);
        res.status(400).send(`Error processing request ${err.message}`);
    }
})


module.exports = router;