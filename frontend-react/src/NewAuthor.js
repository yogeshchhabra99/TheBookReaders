import React, { Component } from 'react';
import './NewBook.css';
const config= require('./config.json');
import axios from 'axios';

class NewBook extends Component{
    state={
        value:""
    }
    handleChange=(e)=>{
        this.setState({
            value:e.target.value});
    }
    handleSubmit=(e)=>{
        var url = config.backendUrl+'api/authors/newAuthor';
            var myOptions = {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Expose-Headers': 'x-auth-token',
                  'x-auth-token': localStorage.getItem('x-auth-token')
                },
              };
            axios.post(url,{name:this.state.value}, myOptions).then(r=>{console.log("author created",r)}).catch(e=>{console.log(e.message)});
    }
    render(){
        return(
            <div>
                <h4>Add a new Author</h4>
                <form>
                <label>
                <h6>Name:</h6>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="button" value="Submit" onClick={this.handleSubmit} />
                </form>
            </div>
        );
    }
}

export default NewBook