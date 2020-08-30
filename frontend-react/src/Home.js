import React, { Component } from 'react';
import SideMenu from './SideMenu';
import './Home.css';
import MainHome from './MainHome.js';

class Home extends Component{
    state={
        selected:"dashBoard"
    }
    
    changePage=(p)=>{
        this.setState({
            selected:p
        });
    }

    render(){
        return(
            <div id="home">
                <SideMenu selected={this.state.selected} changePage={this.changePage}/>
                <div id="mainHome">
                    <MainHome selected={this.state.selected}/>
                </div>
            </div>
        );
    }
}

export default Home;