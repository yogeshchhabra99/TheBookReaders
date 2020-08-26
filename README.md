# TheBookReaders

## Description
This is a app where Readers can add the books the have read or want to read. Add reviews for books they read and their favourite lines from that book. This app will mail the user one of their favourite lines daily. There will be a BookExchange program too.

##Backend
The backend is built on Node.js. We use mongodb database. The reaspn for picking up a non relational database is that the objects have components that grow in size. Using relational database for this will have tables with a one one relations which is not efficient.

### API Reference
#### Books
Schema:
{
    title: String, (title of the book)
    author:{
        id: string, (id_ of the author document in authors collection, node that thais id_ is created by mongoose itself)
        name: string, (name of author, this creates redundancy, but still do it for performance reasons)
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
Return:{
    success: bool,
    error:string(if success==false)
    book: JSON object of book added (if success==true)
}
Status: Completed
Note: When you add only these things, other fields will automatically be empty. return success= true and error=String.empty if added successfully else set success=false amd add error message This is same for all POST APIS.

2. Add a review to a book (Completed;(token == null check remaining))
Type: Post
Route: /api/books/addReview
Header:{
    'x-auth-token':string
}
Body:{
    bookId:string, (mongo id_ of the book document where we want to add a review)
    review: string,
}
Return:{
    success: bool,
    error:string
}
Note: to get the id_ of the user who has added the review, use jsonwebtoken package as following:
const jwt = require('jsonwebtoken');
const token = req.header('x-auth-token');
const id_= jwt.verify(token,config.get("tokenKey")).id

just for info, this token will be sent to the user when he logs in by us using jwt.sign({_id:id},config.get("tokenKey"));

3. Instert a new rating
Type: Post
Route:  /api/books/addRating
Header:{
    'x-auth-token'
}
Body:{
    bookId:string, (mongo id_ of the book document where we want to add a review)
    rating: Number (1-10),
}
Return:{
    success: bool,
    error:string
}
Note: add ratings to book.totalRatings, dont forget to increase numRatings by 1. We dont need who added this rating here.

4. Get all Books
Type: Get
Route: /api/books/:pageno
Header:{
    'x-auth-token': string
}
Return:{
    success:bool,
    books:[book objects],
    error: string
}
Note: each page has 10 books, pageno==1 will give first 10 books, think of some way we can call which are first 10 i.e. some default sorting.

later we'll add more apid, like gettiing books by genre or by author

#### Users
Schema:
{
    name: String,
    userId: String, (provided by google login)
    booksToRead: [{
        id: string, (_id of the book ducument added by mongoose)
        name: string, name of the book
    }]
    booksRead: [{
        bookId: String, (_id of the book ducument added by mongoose)
        name: String,
        review: String,
        rating: Number,
        favouriteLines: [String],
    }]
}

1. User login or signup, and give token
Route: /api/users/login
Type: POST, wee need this post to pass userid in body
body:{
    userId: String (the userid given by google),
    name: String
}
Return{
    1. {
        success: bool,
        error: string
    }
    2. return 'x-auth-token' in author as following:
    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send({success:bool, error: string}) 
}
Note: if user objects exists then get the _id or else create a new user object

2. Add a new Book I read
Route: /api/users/booksRead
Header:{
    'x-auth-token': string
}
Type: Post
body: {
    bookId: String, (_id of the book ducument added by mongoose)
}
Return:{
    success: true
    error:string
    book: book object added
}

3. Add a review to a book
Route: /api/users/addReview
Type: Post
Header:{
    'x-auth-token': string
}
body:{
    bookId: String, (_id of the book ducument added by mongoose)
    review: String
}
Return:{
    success: bool,
    error: String
}

4. Add a favourite Line to a book
Route: /api/users/favouriteLine
Type: Post
Header:{
    'x-auth-token': string
}
body:{
    bookId: String, (_id of the book ducument added by mongoose)
    favouriteLine: String
}
Return:{
    success: bool,
    error: String
}


5. Add a bookToRead
    same as 2.

6. Get all books a user has read:
Type:Get

7. Get all books he wants to read
Type:Get

####Author
Schema:{
    name:String
    books:[string] (ids of all the books he has written)
}

API:
1. Create a new Author using name
Route: /api/authors/newAuthor
Type:POST

2. Get All books by an author
Route: /api/authors/:id/:pageno
Type:Get

3. Add book to an author.
Route: /api/authors/addBook
Type:POST

##FrontEnd 
The frontend is a progressive web app.