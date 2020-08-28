import React, { Component } from 'react';
import SideMenu from './SideMenu';
import './Home.css';

class Home extends Component{
    render(){
        return(
            <div id="home">
                <SideMenu/>
                <div id="mainHome"><h1>Sup</h1></div>
            </div>
        );
    }
}

export default Home;