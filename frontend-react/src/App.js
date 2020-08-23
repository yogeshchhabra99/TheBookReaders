import React, { Component } from 'react';
import GoogleLogin from 'react-google-login'
import axios from 'axios';
import './App.css';

class App extends Component {

  loginSuccessful=(response)=>{
    axios.post('http://localhost:3000/api/users/login',{
      userId : response.googleId,
      name: response.rt.Ad,
    })
    .then(res=>{
      console.log(res);
    })
    .catch(e=>{
      console.log(e);
    })
  }

  loginFailed=(response)=>{
    console.log(response);
  }


  render() {
    return (
      <GoogleLogin
      clientId="604228920568-4b4s148gou4tqt6o8m5g6a3ephnrangf.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={this.loginSuccess}
      onFailure={this.loginFailed}
      cookiePolicy={'single_host_origin'}
      />
    );
  }
}

export default App;
