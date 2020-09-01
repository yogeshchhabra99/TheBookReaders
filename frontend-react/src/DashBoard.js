import React, { Component } from 'react';
import './DashBoard.css';
import BookCard from './BookCard.js';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
const config= require('./config.json');
import axios from 'axios';

const styles = {

    largeIcon: {
      width: 300,
      height: 300,
    },
  
  };

class DashBoard extends Component{
    state={
        booksRead:[],
        booksReadStart:0,
        booksReadEnd:2,
        booksReadFinished:false,
    }
    

    booksReadRight=(e)=>{
        console.log("scrollRight");
    }

    booksReadLeft=(e)=>{
        console.log("scrollLeft");
    }

    render(){
        console.log("bookssize:",this.state.booksRead.length);
        if(this.state.booksRead.length<this.state.booksReadEnd+1 && this.state.booksReadFinished==false){
            console.log("token ",localStorage.getItem('x-auth-token'));
            var pageNo=Math.floor(this.state.booksReadEnd/10 +1);
            console.log(pageNo);
            var url = config.backendUrl+'api/users/booksRead/'+`${pageNo}`;
            var myOptions = {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Expose-Headers': 'x-auth-token',
                  'x-auth-token': localStorage.getItem('x-auth-token')
                },
              };
            axios.get(url, myOptions)
            .then(result=>{
                console.log(result);
                if(result.data.success==true){
                    result.data.books.forEach(
                        book=>{
                            console.log("getting details for"+book.bookId);
                            axios.get(config.backendUrl+'api/books/bookId/'+book.bookId,myOptions).then(bookDetails=>{
                                console.log(bookDetails.data);
                                if(bookDetails.data.success==true){
                                    this.state.booksRead.push({
                                        title:bookDetails.data.book.title,
                                        author:bookDetails.data.book.author,
                                        genre:bookDetails.data.book.genre,
                                        id:bookDetails.data.book._id
                                    });
                                    this.forceUpdate();
                                }
                            })
                        }
                    );
                    if(result.data.books.length!=10)
                        this.state.booksReadFinished=true;   
                    
                }
            })
            .catch(e=>{
                console.log("error",e);
            })

        }
        var toDraw=[];
        console.log(this.state);
        if(this.state.booksRead.length >this.state.booksReadStart){
            toDraw=this.state.booksRead.slice(this.state.booksReadStart,this.state.booksReadEnd);
        }
        console.log(toDraw);
        return(
            <div>
            
            <div><h4>BooksRead:</h4></div>
            <div className="horizontalScroll">
            <KeyboardArrowLeftIcon className="icon" onClick={this.booksReadLeft}/>
            {
                toDraw.map(book=><BookCard title={book.title} authorName={book.author.name} key={book.id} onClick={(e)=>{
                    console.log("edit", book.id);
                    localStorage.setItem("EditBookReadId",book.id);
                    this.props.changePage("editBookRead");
                }}/>)
            }
            
            <KeyboardArrowRightIcon className="icon" onClick={this.booksReadRight}/>
            
            </div>
            </div>
        );
    }
    log=(e)=>{
        console.log("Debug");
    }
}

export default DashBoard