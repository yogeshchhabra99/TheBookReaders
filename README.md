# TheBookReaders

##Description
This is a app where Readers can add the books the have read or want to read. Add reviews for books they read and their favourite lines from that book. This app will mail the user one of their favourite lines daily. There will be a BookExchange program too.

##Backend
The backend is built on Node.js. We use mongodb database. The reaspn for picking up a non relational database is that the objects have components that grow in size. Using relational database for this will have tables with a one one relations which is not efficient.

###API Reference
#### Books
Schema:
{
    title: String, (title of the book)
    author:{
        id: string, (id_ of the author document in authors collection, node that thais id_ is created by mongoose itself)
        name: string, (name of author, this creates redundency, but still do it for performance reasons)
    }
    genre: String, (genre in string, not any id)
    totalRating: Number,(sum of ratings added by all persons)
    numRatings: Number, (how many people have rated, 1-infinite)
    reviews: [{ 
        review:String, (reviews)
        id:, (id_ of the person who added this review), this is again redundency
    ], 
}

1. Add a new Book
Type: Post
Route: /api/books/newBook
Header:{
    'x-auth-token':string, (auhentication token) // @gupta ignore this for now, I will add a middleware for this later
}
Body:{
    title:string,
    author:{
        id: string(mongo id_),
        name: string,
    }
    genre: string
}
Note: When you add only these things, other fields will automatically be empty

2. Add a review to a book
Type: Post
Route: /api/books/addReview
Header:{
    'x-auth-token':string
}
Body:{
    bookId:string, (mongo id_ of the book document where we want to add a review)
    review: string,
}
Note: to get the id_ of the user who has added the review, use jsonwebtoken package as following:
const jwt = require('jsonwebtoken');
const token = req.header('x-auth-token');
const id_= jwt.verify(token,config.get("TokenPrivateKey"))._id

just for info, this token will be sent to the user when he logs in by us using jwt.sign({_id:id},config.get("TokenPrivateKey"));

3. Instert a new rating
Type Post
Route:  /api/books/addRating
Header:{
    'x-auth-token'
}
Body:{
    bookId:string, (mongo id_ of the book document where we want to add a review)
    rating: Number (1-10),
}
Note: add ratings to book.totalRatings, dont forget to increase numRatings by 1. We dont need who added this rating here.




##FrontEnd 
The frontend is a progressive web app.