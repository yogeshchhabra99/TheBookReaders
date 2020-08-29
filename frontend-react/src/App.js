import React, { Component } from 'react';
import './App.css';
import TopNav from './TopNav.js';
import WelcomeBox from './WelcomeBox.js';
import Home from './Home.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends Component {
  

  render() {
    
    return (
      <Router>
      <Switch>
        <Route path="/login">
          <TopNav/>
          <WelcomeBox/>
        </Route>
        <Route path="/home">
        <CheckLoginHome/>
          <TopNav/>
          <Home/>
        </Route>
        <Route path="/">
          <CheckLogin/>
        </Route>
      </Switch>
      </Router>
      
    );
  }
}

function CheckLogin(){
  if(localStorage.getItem('x-auth-token')!=null)
  return(
    <Route>
      <Redirect to="/home" />
    </Route>
  )
  else{
    return(
    <Route>
      <Redirect to="/login" />
    </Route>
    )
  }
}

function CheckLoginHome(){
  if(localStorage.getItem('x-auth-token')==null)
  {
    return(
    <Route>
      <Redirect to="/login" />
    </Route>
    )
  }else{
    return(
      <div></div>
    );
  }
}

export default App;
