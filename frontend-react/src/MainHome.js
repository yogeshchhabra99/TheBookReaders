import React, { Component } from 'react';
import DashBoard from './DashBoard.js';

class Home extends Component{
    render(){
        if(this.props.selected=="dashBoard")
            return(
                <DashBoard/>
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
                <div><h1>New Book</h1></div>
            );
        if(this.props.selected=="about")
            return(
                <div><h1>About</h1></div>
            );
    }
}

export default Home;