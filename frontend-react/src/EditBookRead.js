import React, { Component } from 'react';

class EditBookRead extends Component{
    state={
        review:"",
        line:"",
    }

    handleChangeReview=(e)=>{
        this.setState({
            review:e.target.value,
        });
    }
    handleChangeLine=(e)=>{
        this.setState({
            line:e.target.value,
        });
    }
    handleChangeReview=(e)=>{
        // books/addReview
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
    handleChangeLine=(e)=>{

    }
    render(){
        return(
            <div>
           <div><h4>Edit Book {localStorage.getItem("EditBookReadId")}</h4></div>
           <form>
                <label>
                <h6>Review:</h6>
                <input type="textArea" value={this.state.review} onChange={this.handleChangeReview} />
                </label>
                
                <input type="button" value="Add Review" onClick={this.handleSubmitReview} />
            </form>

            <form>
                <label>
                
                <h6>Favourite Line:</h6>
                <input type="text" value={this.state.line} onChange={this.handleChangeLine} />
                </label>
                <input type="button" value="Add Favourite Line" onClick={this.handleSubmitLine} />
            </form>
            </div>
        );
    }
}

export default EditBookRead