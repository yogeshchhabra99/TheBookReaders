import React, { Component } from 'react';
const config= require('./config.json');
import axios from 'axios';

class EditBookRead extends Component{
    state={
        review:"",
        line:"",
        bookName:"",
    }

    handleChangeReview=(e)=>{
        console.log("handleChangeReview");
        this.setState({
            review:e.target.value,
        });
    }

    handleChangeLine=(e)=>{
        console.log("handleChangeLine");
        this.setState({
            line:e.target.value,
        });
    }

    handleSubmitReview=(e)=>{
        // books/addReview
        console.log("handleSubmitReview");
        var url = config.backendUrl+'api/books/addReview';
        var myOptions = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'x-auth-token',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
        };
        var body={
          bookId:localStorage.getItem("EditBookReadId"),
          review:this.state.review
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

    handleSubmitLine=(e)=>{
        console.log("handleSubmitLine");
        var url = config.backendUrl+'api/users/favouriteLine';
        var myOptions = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'x-auth-token',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
        };
        var body={
          bookId:localStorage.getItem("EditBookReadId"),
          favouriteLine:this.state.line
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
        console.log(this.state);
        if(this.state.bookName==""){
            var url = config.backendUrl+'api/boos/bookId/'+localStorage.getItem('EditBookReadId');
        var myOptions = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'x-auth-token',
            'x-auth-token': localStorage.getItem('x-auth-token')
          },
        };
        
        
      axios.get(url, myOptions)
      .then(result=>{
          if(result!=null && result.data!=null && result.data.success==true){
            this.state.bookName=result.data.book.name;    
          }
          this.forceUpdate();
      })
      .catch(e=>{
          console.log("error",e);
      })
        }
        return(
            <div>
           <div><h4>Edit Book {this.state.bookName}</h4></div>
           <form>
                <label>
                <h6>Review:</h6>
                <input type="text" value={this.state.review} onChange={this.handleChangeReview} />
                </label>
                
                <input type="button" value="Add Review" onClick={this.handleSubmitReview} />
            </form>

            <form id="form2">
                <label>
                
                <h6>Favourite Line:</h6>
                <input type="text" value={this.state.line} onChange={this.handleChangeLine} />
                {/* <textarea rows="4" cols="50" form="form2" value={this.state.line} onChange={this.handleChangeLine}>
Enter text here...</textarea> */}
                </label>
                <input type="button" value="Add Favourite Line" onClick={this.handleSubmitLine} />
            </form>
            </div>
        );
    }
}

export default EditBookRead