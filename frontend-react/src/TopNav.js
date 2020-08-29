import React, { Component } from 'react';
import './TopNav.css';
import img from './icon-128x128.png';

class TopNav extends Component{
    render(){
        return(
            <nav className="z-depth-0 topNav">
                <div id="topBar">
                    <img src={img}></img>
                    <a href="/" id="topTitle">The<span>BookReaders</span></a>
                </div>
            </nav>
        );
    }
}

export default TopNav