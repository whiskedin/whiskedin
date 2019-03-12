import React, { Component } from 'react';
import './App.css';
import {Route} from "react-router";
import UserAuth from './UserAuth/UserAuth';
import Home from './Home/Home';
import HomePage from './HomePage/HomePage';


class App extends Component {

    constructor(props){
        super(props);
        process.title = 'Bops';
    }

    render() {
    return (
        <div className="App">
          <Route exact path="/" component={UserAuth}/>
          <Route exact path="/home" component={Home}/>
          <Route exact path="/homepage" component={HomePage}/>
        </div>
    );
  }
}

export default App;
