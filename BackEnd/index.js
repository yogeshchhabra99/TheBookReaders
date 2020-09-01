const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
//use export DEBUG=app:debug,app:db
const cors= require('cors');
const Joi =require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const booksRouter= require('./routes/books');
const usersRouter= require('./routes/users');
const authorsRouter= require('./routes/authors');
const mailer = require('./mailer.js');
var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('0 15 17 * * *', function(){
  usersRouter.getAllUsers().then((users=>{
    if(!users || users.length==0){
        console.log("No Users");
        return;
    }  
    users.forEach(async (user)=>{
        //console.log(user);
        if(user.booksRead.length!=0){
            toPick=user.lastMail+1;
            if(toPick>=user.booksRead.length){
                toPick%=user.booksRead.length;
            }
            checked=0;
            toMail=true;
            //console.log(toPick,user.booksRead.length);
            while(user.booksRead[toPick].favouriteLines.length==0){
                toPick++;
                toPick%=user.booksRead.length;
                checked++;
                if(checked==user.booksRead.length){
                    console.log("No favourite lines");
                    toMail=false;
                    break;
                }
            }
            //console.log("debug",toPick);
            //console.log(user.booksRead[toPick]);
            //console.log(user.booksRead[toPick].favouriteLines.length);
            if(toMail){
                try{
                var msg={line:""};
                msg.line=user.booksRead[toPick].favouriteLines[Math.floor(Math.random() * user.booksRead[toPick].favouriteLines.length)];
                //console.log("beforeee",user.email,msg.line);
                    book= await booksRouter.findBook(user.booksRead[toPick].bookId)
                //    console.log("before",user.email,msg.line);
                    mailer.mail(user.email,msg.line,book.name);
                    user.lastMail=toPick;
                    user.save()
                }
                catch(e){
                    console.log(e)
                }
            }
        }
      })
  })).catch(e=>console.log(e))
});

var app=express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

const corsOptions = {
    exposedHeaders: 'x-auth-token',
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(helmet());
app.use('/api/books',booksRouter); // routes starting with '/api/books will be handled by this router'
app.use('/api/users',usersRouter);
app.use('/api/authors',authorsRouter);
console.log(app.get('env'));
if(config.get('env')=='development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}


const PORT = config.get("port") || 7474;

app.listen(PORT,()=>console.log(`Listening on Port ${PORT}`));

