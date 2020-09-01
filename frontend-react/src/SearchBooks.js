import React, { Component } from 'react';
import './SearchBooks.css';
const config= require('./config.json');
import axios from 'axios';
import BookCard from './BookCard.js';

class SearchBooks extends Component{
    state={
        value:"",
        books:[]
    }
    handleChange=(e)=>{
        //console.log(e.target.value);
        this.setState({
        value:e.target.value});
    }
    handleSubmit=(e)=>{
        console.log("submit");
        var url = config.backendUrl+'api/books/search/'+this.state.value;
            var myOptions = {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Expose-Headers': 'x-auth-token',
                  'x-auth-token': localStorage.getItem('x-auth-token')
                },
              };
            axios.get(url, myOptions)
            .then(result=>{
                console.log(result.data);
                
                result.data.books.forEach((item)=>{
                    console.log(item);
                    this.state.books.push({
                        title:item.title,
                        id:item._id,
                        authorName:item.author.name
                    })
                });  
                this.forceUpdate();
            })
            .catch(e=>{
                console.log("error",e);
            })
    }
    render(){
        return(
            <div>
                <form>
                <label>
                <h6>Title:</h6>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="button" value="Search" onClick={this.handleSubmit} />
                </form>
                {this.state.books.map(item => 
                    <div key={item.id}>
                    <BookCard title={item.title} authorName={item.authorName}/>
                    <input type="button" value="Mark Read" onClick={(e)=>{
                        var url = config.backendUrl+'api/users/booksRead';
            var myOptions = {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Expose-Headers': 'x-auth-token',
                  'x-auth-token': localStorage.getItem('x-auth-token')
                },
              };
            axios.post(url,{bookId:item.id}, myOptions).then(r=>{console.log("read book success")}).catch(e=>{console.log(e.message)});

                    }}/>

                    <input type="button" value="Want To Read" onClick={(e)=>{
                        var url = config.backendUrl+'api/users/booksToRead';
            var myOptions = {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Expose-Headers': 'x-auth-token',
                  'x-auth-token': localStorage.getItem('x-auth-token')
                },
              };
            axios.post(url,{bookId:item.id}, myOptions).then(r=>{console.log("toRead book success")}).catch(e=>{console.log(e.message)});

                    }}/>
                </div>
                )}
                
            </div>
        );
    }
}

export default SearchBooks