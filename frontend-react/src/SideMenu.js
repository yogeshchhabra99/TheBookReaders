import React, { Component } from 'react';
import './SideMenu.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

class SideMenu extends Component{
    state={
        loggedIn:true,
    }

    logOut=(e)=>{
        localStorage.removeItem('x-auth-token');
        this.setState({
            loggedIn:false,
        });
    }

    render(){
        if(localStorage.getItem('x-auth-token')==null){
            this.state.loggedIn=false;
        }

        if(this.state.loggedIn==false){
            return(
                <Route>
                <Redirect to="/login" />
                </Route>
            );
        }
        else
        return(
            <div id="sideMenu">
                <div id="sideMenuItem">Home</div>
                <div id="sideMenuItem" onClick={this.logOut}>Log Out</div>
            </div>
        );
        return (
            <ul id="side-menu" className="sidenav side-menu">
            <li><a className="subheader">FOODNINJA</a></li>
            <li><a href="/" class="waves-effect">Home</a></li>
            <li><a href="./pages/about.html" className="waves-effect">About</a></li>
            <li><div className="divider"></div></li>
            <li><a href="./pages/contact.html" className="waves-effect">
            <i className="material-icons">mail_outline</i>Contact</a>
            </li>
            </ul>
        );
    }
}

export default SideMenu;