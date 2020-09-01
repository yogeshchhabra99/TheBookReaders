import React, { Component } from 'react';
import DashBoard from './DashBoard.js';
import NewBook from './NewBook.js';
import SearchBooks from './SearchBooks.js';
import NewAuthor from './NewAuthor.js';
import EditBookRead from './EditBookRead.js';

class Home extends Component{
    render(){
        if(this.props.selected=="dashBoard")
            return(
                <DashBoard changePage={this.props.changePage}/>
            );
        if(this.props.selected=="booksRead")
            return(
                <div><h1>BooksRead</h1></div>
            );
        if(this.props.selected=="wantToRead")
            return(
                <div><h1>Want To Read</h1></div>
            );
        if(this.props.selected=="newBook")
            return(
                <NewBook/>
            );
        if(this.props.selected=="newAuthor"){
            return(
                <NewAuthor />
            );
        }
        if(this.props.selected=="about")
            return(
                <div><h1>About</h1></div>
            );
        if(this.props.selected=="searchBooks"){
            return(
                <SearchBooks/>
            ); 
        }
        if(this.props.selected=="editBookRead"){
            return(
                <EditBookRead/>
            )
        }
    }
}

export default Home;