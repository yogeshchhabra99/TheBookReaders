import React, { Component } from 'react';
import './NewBook.css';
const config= require('./config.json');
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }
  console.log(value,escapedValue);
  if(escapedValue==null)
    return [];

  var url = config.backendUrl+'api/authors/search/'+value;
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
                allSuggestions=[];
                result.data.authors.forEach((item)=>{
                    console.log(item);
                    allSuggestions.push({
                        name:item.name,
                        id:item._id,
                    })
                });  
            })
            .catch(e=>{
                console.log("error",e);
            })
            const regex = new RegExp('^' + escapedValue, 'i');

            return allSuggestions.filter(author => regex.test(author.name));

}



function renderSuggestion(suggestion) {
  console.log("renderSuggestion",suggestion)
  return (
    <span>{suggestion.name}</span>
  );
}

var allSuggestions=[];

class NewBook extends Component{
    state={
        title:"",
        authorName:"",
        authorId:"",
        nameSuggestions: [],
        genre:""
    }
    getSuggestionValue=(suggestion)=> {
      this.state.authorId=suggestion.id;
      return suggestion.name;
    }
    onChange = (event, { newValue, method }) => {
      console.log(newValue);  
      this.setState({
          authorName: newValue
        });
      };
      
      onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          nameSuggestions: getSuggestions(value)
        });
      };
    
      onSuggestionsClearRequested = () => {
        this.setState({
          nameSuggestions: []
        });
      };

    handleChangeTitle=(e)=>{
        this.setState({
            title:e.target.value});
    }
    handleChangeGenre=(e)=>{
      this.setState({
        genre:e.target.value
      });
    }
    
    handleSubmit=(e)=>{
        console.log("submit");

        var url = config.backendUrl+'api/books/newBook';
        var myOptions = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'x-auth-token',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
        };
        var body={
          title: this.state.title,
          author:{
              id: this.state.authorId,
              name: this.state.authorName
          },
          genre:this.state.genre
        };
        console.log(body);
      axios.post(url,body, myOptions)
      .then(result=>{
          console.log(result.data);  
      })
      .catch(e=>{
          console.log("error",e);
      })
    }
    
    render(){
      console.log("suggestions",this.state.nameSuggestions, allSuggestions);
        const value=this.state.authorName;
        const inputProps = {
            placeholder: "Type 'c'",
            value,
            onChange: this.onChange
          };

        return(
            <div>
                <h4>Add a new book</h4>
                <form>
                <label>
                <h6>Title:</h6>
                <input type="text" value={this.state.title} onChange={this.handleChangeTitle} />
                </label>
                <label>
                <h6>Author:</h6>
                <Autosuggest 
                    suggestions={this.state.nameSuggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps} />
                </label>
                <label>
                <h6>Genre:</h6>
                <input type="text" value={this.state.genre} onChange={this.handleChangeGenre} />
                </label>
                <label></label>
                <input type="button" value="Submit" onClick={this.handleSubmit} />
                </form>
            </div>
        );
    }
}

export default NewBook