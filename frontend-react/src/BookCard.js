import React, { Component } from 'react';
import './BookCard.css';

class BookCard extends Component{
    render(){
        return(
            <span className="bookCardWrapper" onClick={this.props.onClick}>
            <div class="bookCard">
                <div className="bookTitle">{this.props.title}</div>
                <div className="bookBy">by</div>
                <div className="bookTitle">{this.props.authorName}</div>
            </div>
            </span>
        );
    }
}

export default BookCard