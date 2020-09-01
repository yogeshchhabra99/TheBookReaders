import React, { Component } from 'react';
import './WelcomeBox.css';
import GoogleLogin from 'react-google-login'
import axios from 'axios';
import books from './books-200x200.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
const config= require('./config.json');
console.log(config);

class WelcomeBox extends Component{
  state={
    loggedIn:false
  }

    loginSuccessful=(response)=>{
        var myOptions = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'x-auth-token'
          },
        };
    
        console.log(response);
        console.log(response.profileObj.email);
        axios.post(config.backendUrl+'api/users/login',{
          userId : response.googleId,
          name: response.rt.Ad,
          email: response.profileObj.email,
        }, myOptions)
        .then(res=>{
          localStorage.setItem('x-auth-token',res.headers['x-auth-token']);
          this.setState({
            loggedIn:true
          });
        })
        .catch(e=>{
          console.log("Login Failed");
        })
      }
    
      loginFailed=(response)=>{
        console.log("Login Failed\n");
        console.log(response);
      }
    render(){
      if(localStorage.getItem('x-auth-token')!=null){
          this.state.loggedIn=true;
      }
      console.log(process.env.NODE_ENV);
      //console.log(process.env.REACT_APP_THEBOOKREADERS_GOOGLEID);

      if(this.state.loggedIn==true)
        return(
          <Route>
        <Redirect to="/home" />
        </Route>
        )
      else
        return(
            <div className="welcomeBoxWrapper">
                <div id ="infoBox">     
                    <img src={books} alt=" "></img>
                    <p>
                        One place to store all information about your favourite books. We'll keep reminding you of your favourite passages from different books.
                    </p>
                </div>
                <div id="loginButton-Box">
                <div>
                  <p>Please login<br/>to <br/> continue. </p>
                </div>
                <div >
                        <GoogleLogin
                            clientId={process.env.REACT_APP_THEBOOKREADERS_GOOGLEID}
                            buttonText="Login"
    //                         render={renderProps => (
    //   <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
    // )}
                            onSuccess={this.loginSuccessful}
                            onFailure={this.loginFailed}
                            cookiePolicy={'single_host_origin'}
                        />
                    
                </div>
                </div>
            </div>
            
        );
    }
}

export default WelcomeBox