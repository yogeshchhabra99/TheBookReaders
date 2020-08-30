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
    }
    

    booksReadRight=(e)=>{
        console.log("scrollRight");
    }

    booksReadLeft=(e)=>{
        console.log("scrollLeft");
    }

    render(){
        console.log("bookssize:",this.state.booksRead.length);
        if(this.state.booksRead.length<this.state.booksReadEnd+1){
            console.log("token ",localStorage.getItem('x-auth-token'));
            var pageNo=this.state.booksReadEnd/10 +1;
            var url = config.backendUrl+'api/users/booksRead/'+`${pageNo}`;
            var myOptions = {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Expose-Headers': 'x-auth-token',
                  'x-auth-token': localStorage.getItem('x-auth-token')
                },
              };
            axios.get(url, myOptions)
            .then(results=>{
                console.log(results);
            })
            .catch(e=>{
                console.log("error",e);
            })

        }
        return(
            <div>
            
            <div><h4>BooksRead:</h4></div>
            <div class="horizontalScroll">
            <KeyboardArrowLeftIcon class="icon" onClick={this.booksReadLeft}/>
            <BookCard title="Title" authorName="Author"/>
            <BookCard title="Title" authorName="Author"/>
            <BookCard title="Title" authorName="Author"/>
            <KeyboardArrowRightIcon class="icon" onClick={this.booksReadRight}/>
            
            </div>
            </div>
        );
    }
}

export default DashBoard