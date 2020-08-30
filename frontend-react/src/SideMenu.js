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
        dashBoardClass:"sideMenuItem",
        logOutClass:"sideMenuItem",
        addBookClass:"sideMenuItem",
        booksReadClass:"sideMenuItem",
        bookWantToReadClass:"sideMenuItem",
        aboutClass:"sideMenuItem",
    }

    logOut=(e)=>{
        localStorage.removeItem('x-auth-token');
        this.setState({
            loggedIn:false,
        });
    }

    resetState=()=>{
        this.state={
            loggedIn:true,
            dashBoardClass:"sideMenuItem",
            logOutClass:"sideMenuItem",
            addBookClass:"sideMenuItem",
            booksReadClass:"sideMenuItem",
            bookWantToReadClass:"sideMenuItem",
            aboutClass:"sideMenuItem",
        }
    }

    dashBoard=(e)=>{
        this.props.changePage("dashBoard");
    }

    booksRead=(e)=>{
        this.props.changePage("booksRead");
    }

    wantToRead=(e)=>{
        this.props.changePage("wantToRead");
    }
    newBook=(e)=>{
        this.props.changePage("newBook");
    }
    about=(e)=>{
        this.props.changePage("about");
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

        if(this.props.selected=="dashBoard"){
            this.resetState();
            this.state.dashBoardClass="sideMenuItemSelected"
        }
        else if(this.props.selected=="booksRead"){
            this.resetState();
            this.state.booksReadClass="sideMenuItemSelected"
        }
        else if(this.props.selected=="wantToRead"){
            this.resetState();
            this.state.bookWantToReadClass="sideMenuItemSelected"
        }
        else if(this.props.selected=="newBook"){
            this.resetState();
            this.state.newBookClass="sideMenuItemSelected"
        }
        else if(this.props.selected=="about"){
            this.resetState();
            this.state.aboutClass="sideMenuItemSelected"
        }

        return(
            <div id="sideMenu">
                <div className={this.state.dashBoardClass} onClick={this.dashBoard}>DashBoard</div>
                <div className={this.state.booksReadClass} onClick={this.booksRead}>Books Read</div>
                <div className={this.state.bookWantToReadClass} onClick={this.wantToRead}>Want to Read</div>
                <div className={this.state.addBookClass} onClick={this.newBook}>New Book</div>
                <div className={this.state.aboutClass} onClick={this.about}>About</div>
                <div className={this.state.logOutClass} onClick={this.logOut}>Log Out</div>
            </div>
        );
    }
}

export default SideMenu;