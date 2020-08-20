const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
//use export DEBUG=app:debug,app:db
const Joi =require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const booksRouter= require('./routes/books').router;
const usersRouter= require('./routes/users').router;
var app=express();
app.use(express.json());
app.use(helmet());
app.use('/api/books',booksRouter); // routes starting with '/api/books will be handled by this router'
app.use('/api/users',usersRouter)
console.log(app.get('env'))
if(config.get('env')=='development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...')
}


const PORT = config.get("port") || 7474;

app.listen(PORT,()=>console.log(`Listening on Port ${PORT}`));

