const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const config = require('config');
const Joi =require('joi');

const authorSchema = new mongoose.Schema({
    name: String,
    rating: Number
});

const Author = mongoose.model('Authors', authorSchema);

module.exports = router;