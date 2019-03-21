import React, { Component } from 'react';
import './App.css';
import {Route} from "react-router";
import UserAuth from './UserAuth/UserAuth';
import HomePage from './HomePage/HomePage';
import EditPage from './EditPage/EditPage';


class App extends Component {

    constructor(props){
        super(props);
        process.title = 'Bops';
    }

    render() {
    return (
        <div>
          <Route exact path="/" component={UserAuth}/>
          <Route exact path="/homepage" component={HomePage}/>
          <Route exact path="/editpage" component={EditPage}/>
        </div>
    );
  }
}

export default App;
